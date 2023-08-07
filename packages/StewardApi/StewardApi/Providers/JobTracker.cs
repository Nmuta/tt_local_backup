using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Hubs;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <inheritdoc />
    public sealed class JobTracker : IJobTracker, IInitializeable
    {
        private const string JobContainerName = "jobs";
        private const int LeaseLockTimeInSeconds = 30;

        private readonly ITableStorageClientFactory tableStorageClientFactory;
        private readonly IBlobRepository blobRepository;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly KeyVaultConfig keyVaultConfig;
        private readonly IConfiguration configuration;
        private readonly HubManager hubManager;
        private ITableStorageClient tableStorageClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="JobTracker"/> class.
        /// </summary>
        public JobTracker(
            HubManager hubManager,
            ITableStorageClientFactory tableStorageClientFactory,
            IConfiguration configuration,
            IBlobRepository blobRepository,
            IRefreshableCacheStore refreshableCacheStore,
            KeyVaultConfig keyVaultConfig)
        {
            hubManager.ShouldNotBeNull(nameof(hubManager));
            tableStorageClientFactory.ShouldNotBeNull(nameof(tableStorageClientFactory));
            blobRepository.ShouldNotBeNull(nameof(blobRepository));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultConfig.ShouldNotBeNull(nameof(keyVaultConfig));

            this.keyVaultConfig = keyVaultConfig;
            this.configuration = configuration;
            this.tableStorageClientFactory = tableStorageClientFactory;
            this.hubManager = hubManager;
            this.blobRepository = blobRepository;
            this.refreshableCacheStore = refreshableCacheStore;
        }

        /// <inheritdoc />
        public async Task<string> CreateNewJobAsync(string requestBody, string userObjectId, string reason, HttpResponse httpResponse)
        {
            userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));
            reason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(reason));

            var jobId = Guid.NewGuid().ToString();

            try
            {
                var backgroundJob = new BackgroundJobInternal(jobId, userObjectId, reason, BackgroundJobStatus.InProgress);
                await this.hubManager.ForwardJobChange(backgroundJob).ConfigureAwait(false);

                await this.blobRepository
                    .AddOrReplaceFromBytesExclusiveAsync(
                        string.Empty,
                        jobId,
                        JobContainerName,
                        Encoding.ASCII.GetBytes(requestBody))
                    .ConfigureAwait(false);

                var leaseId = await this.blobRepository
                    .GetBlobLeaseAsync(string.Empty, jobId, JobContainerName, LeaseLockTimeInSeconds)
                    .ConfigureAwait(false);

                var insertOrReplaceOperation = TableOperation.InsertOrReplace(backgroundJob);

                await this.tableStorageClient.ExecuteAsync(insertOrReplaceOperation).ConfigureAwait(false);

                await this.blobRepository.ReleaseBlobLeaseAsync(string.Empty, jobId, JobContainerName, leaseId)
                    .ConfigureAwait(false);

                httpResponse.Headers.Add("jobId", jobId);

                return jobId;
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Creation failed for job with ID: {jobId}", ex);
            }
        }

        /// <inheritdoc />
        public async Task UpdateJobAsync(string jobId, string userObjectId, BackgroundJobStatus backgroundJobStatus)
        {
            await this.UpdateJobAsync(jobId, userObjectId, backgroundJobStatus, string.Empty).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task UpdateJobAsync(string jobId, string userObjectId, BackgroundJobStatus backgroundJobStatus, object jobResult)
        {
            jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));
            userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));

            async Task<BackgroundJobInternal> UpdateTable()
            {
                var serializedResults = JsonConvert.SerializeObject(jobResult, new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                });

                var tableQuery = new TableQuery<BackgroundJobInternal>()
                    .Where(
                        TableQuery.CombineFilters(
                            TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, jobId),
                            TableOperators.And,
                            TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, userObjectId)));

                var results = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);
                if (results.Count <= 0)
                {
                    throw new NotFoundStewardException($"Query failed with jobId: {jobId}");
                }

                if (results.Count > 1)
                {
                    throw new NotFoundStewardException($"Too many results for jobId: {jobId}");
                }

                var updateJob = results[0];
                updateJob.Status = backgroundJobStatus.ToString();
                updateJob.Result = serializedResults;

                var command = TableOperation.Replace(updateJob);

                var operationResponse = await this.tableStorageClient.ExecuteAsync(command).ConfigureAwait(false);

                var result = operationResponse.Result as BackgroundJobInternal;
                await this.hubManager.ForwardJobChange(result).ConfigureAwait(false);

                this.AddFinalStatusToCache(result, jobId);

                return result;
            }

            try
            {
                await this.UpdateTableStorageSafelyAsync(UpdateTable, jobId).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Update failed for job with ID: {jobId}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<BackgroundJobInternal> GetJobStatusAsync(string jobId)
        {
            jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));

            async Task<BackgroundJobInternal> QueryStatus()
            {
                var tableQuery = new TableQuery<BackgroundJobInternal>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, jobId));
                var result = (await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false)).First();

                this.AddFinalStatusToCache(result, jobId);

                return result;
            }

            try
            {
                var backgroundJob = this.refreshableCacheStore.GetItem<BackgroundJobInternal>(jobId) ?? await QueryStatus().ConfigureAwait(false);

                return backgroundJob;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"Lookup failed for job ID: {jobId}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<BackgroundJobInternal>> GetJobsByUserAsync(string userObjectId, TimeSpan? resultsFrom)
        {
            userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));

            try
            {
                var partitionKeyFilter = TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, userObjectId);
                var tableQuery = new TableQuery<BackgroundJobInternal>()
                    .Where(partitionKeyFilter);

                if (resultsFrom.HasValue)
                {
                    var resultsFromFilter = TableQuery.GenerateFilterConditionForDate("CreatedTimeUtc", QueryComparisons.GreaterThan, DateTime.UtcNow.Subtract(resultsFrom.Value));
                    var combinedFilters = TableQuery.CombineFilters(partitionKeyFilter, TableOperators.And, resultsFromFilter);
                    tableQuery = new TableQuery<BackgroundJobInternal>()
                        .Where(combinedFilters);
                }

                var results = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);

                return results;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"Failed to lookup jobs with object ID: {userObjectId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<BackgroundJobInternal>> GetUnreadJobsByUserAsync(string userObjectId)
        {
            userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));

            try
            {
                var tableQuery = new TableQuery<BackgroundJobInternal>()
                    .Where(
                        TableQuery.CombineFilters(
                            TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, userObjectId),
                            TableOperators.And,
                            TableQuery.GenerateFilterConditionForBool("IsRead", QueryComparisons.Equal, false)));
                var results = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);

                return results;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"Failed to lookup unread jobs with object ID: {userObjectId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task SetJobIsReadAsync(string jobId, string userObjectId, bool isRead)
        {
            jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));
            userObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userObjectId));

            try
            {
                var tableQuery = new TableQuery<BackgroundJobInternal>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, jobId));

                var results = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);
                if (results.Count <= 0)
                {
                    throw new NotFoundStewardException($"Lookup failed with job ID: {jobId}");
                }

                var result = results[0];

                if (result.PartitionKey != userObjectId)
                {
                    throw new InvalidArgumentsStewardException($"Object ID {userObjectId} is not allowed to update job with job ID: {jobId}");
                }

                result.IsRead = isRead;

                var replaceOperation = TableOperation.Replace(result);
                await this.tableStorageClient.ExecuteAsync(replaceOperation).ConfigureAwait(false);
                await this.hubManager.ForwardJobChange(result).ConfigureAwait(false);

                this.AddFinalStatusToCache(result, jobId);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"Failed to find job: {jobId} to edit.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<BackgroundJobInternal>> GetInProgressJobsAsync()
        {
            var tableQuery = new TableQuery<BackgroundJobInternal>().Where(TableQuery.GenerateFilterCondition("Status", QueryComparisons.Equal, Enum.GetName(typeof(BackgroundJobStatus), BackgroundJobStatus.InProgress)));

            var results = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);

            return results;
        }

        /// <inheritdoc />
        public Task InitializeAsync()
        {
            var tableStorageProperties = new TableStorageProperties();
            var tableStorageConnectionString = this.keyVaultConfig.TableStorageConnectionString;

            this.configuration.Bind("BackgroundJobStorageProperties", tableStorageProperties);
            tableStorageProperties.ConnectionString = tableStorageConnectionString;

            this.tableStorageClient = this.tableStorageClientFactory.CreateTableStorageClient(tableStorageProperties);

            return Task.CompletedTask;
        }

        private void AddFinalStatusToCache(BackgroundJobInternal backgroundJob, string jobId)
        {
            _ = Enum.TryParse<BackgroundJobStatus>(backgroundJob.Status, out var status);

            if (status != BackgroundJobStatus.InProgress)
            {
                this.refreshableCacheStore.PutItem(jobId, TimeSpan.FromDays(1), backgroundJob);
            }
        }

        private async Task UpdateTableStorageSafelyAsync<T>(Func<Task<T>> tableUpdate, string jobId)
        {
            var leaseId = string.Empty;
            var retries = 0;
            var retry = true;
            var waitTimeInMilliseconds = 1000;

            do
            {
                try
                {
                    leaseId = await this.blobRepository.GetBlobLeaseAsync(string.Empty, jobId, JobContainerName, LeaseLockTimeInSeconds).ConfigureAwait(false);
                    retry = false;
                }
                catch
                {
                    if (retries > 4)
                    {
                        throw;
                    }

                    Thread.Sleep(waitTimeInMilliseconds);

                    waitTimeInMilliseconds *= 2;
                    retries++;
                }
            }
            while (retry);

            try
            {
                await tableUpdate().ConfigureAwait(false);
            }
            finally
            {
                await this.blobRepository.ReleaseBlobLeaseAsync(string.Empty, jobId, JobContainerName, leaseId)
                    .ConfigureAwait(false);
            }
        }
    }
}