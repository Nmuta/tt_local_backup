using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <inheritdoc />
    public sealed class JobTracker : IJobTracker
    {
        private const string JobContainerName = "jobs";
        private const int LeaseLockTimeInSeconds = 30;

        private readonly IBlobRepository blobRepository;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly ITableStorageClient tableStorageClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="JobTracker"/> class.
        /// </summary>
        /// <param name="tableStorageClientFactory">The table storage client factory.</param>
        /// <param name="configuration">The configuration.</param>
        /// <param name="blobRepository">The blob repository.</param>
        /// <param name="refreshableCacheStore">The refreshable cache store.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        public JobTracker(
                          ITableStorageClientFactory tableStorageClientFactory,
                          IConfiguration configuration,
                          IBlobRepository blobRepository,
                          IRefreshableCacheStore refreshableCacheStore,
                          IKeyVaultProvider keyVaultProvider)
        {
            tableStorageClientFactory.ShouldNotBeNull(nameof(tableStorageClientFactory));
            blobRepository.ShouldNotBeNull(nameof(blobRepository));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));

            var tableStorageProperties = new TableStorageProperties();
            var tableStorageConnectionString = keyVaultProvider.GetSecretAsync(configuration[ConfigurationKeyConstants.KeyVaultUrl], "table-storage-connection-string").GetAwaiter().GetResult();

            configuration.Bind("BackgroundJobStorageProperties", tableStorageProperties);
            tableStorageProperties.ConnectionString = tableStorageConnectionString;

            this.tableStorageClient = tableStorageClientFactory.CreateTableStorageClient(tableStorageProperties);
            this.blobRepository = blobRepository;
            this.refreshableCacheStore = refreshableCacheStore;
        }

        /// <inheritdoc />
        public async Task<string> CreateNewJobAsync(string requestBody, string username)
        {
            username.ShouldNotBeNullEmptyOrWhiteSpace(nameof(username));

            var jobId = Guid.NewGuid().ToString();
            var backgroundJob = new BackgroundJob(jobId, username, BackgroundJobStatus.InProgress);

            await this.blobRepository
                .AddOrReplaceFromBytesExclusiveAsync(string.Empty, jobId, JobContainerName, Encoding.ASCII.GetBytes(requestBody))
                .ConfigureAwait(false);

            var leaseId = await this.blobRepository.GetBlobLeaseAsync(string.Empty, jobId, JobContainerName, LeaseLockTimeInSeconds)
                .ConfigureAwait(false);

            var insertOrReplaceOperation = TableOperation.InsertOrReplace(backgroundJob);

            await this.tableStorageClient.ExecuteAsync(insertOrReplaceOperation).ConfigureAwait(false);

            await this.blobRepository.ReleaseBlobLeaseAsync(string.Empty, jobId, JobContainerName, leaseId)
                .ConfigureAwait(false);

            return jobId;
        }

        /// <inheritdoc />
        public async Task UpdateJobAsync(string jobId, string username, BackgroundJobStatus backgroundJobStatus)
        {
            await this.UpdateJobAsync(jobId, username, backgroundJobStatus, string.Empty).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task UpdateJobAsync(string jobId, string username, BackgroundJobStatus backgroundJobStatus, string jobResult)
        {
            jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));
            username.ShouldNotBeNullEmptyOrWhiteSpace(nameof(username));

            async Task<BackgroundJob> UpdateTable()
            {
                var backgroundJob = new BackgroundJob(jobId, username, backgroundJobStatus, jobResult);

                var command = TableOperation.InsertOrMerge(backgroundJob);

                var operationResponse = await this.tableStorageClient.ExecuteAsync(command).ConfigureAwait(false);

                var result = operationResponse.Result as BackgroundJob;

                this.AddFinalStatusToCache(result, jobId);

                return result;
            }

            await this.UpdateTableStorageSafely(UpdateTable, jobId).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<BackgroundJob> GetJobStatusAsync(string jobId)
        {
            jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));

            async Task<BackgroundJob> QueryStatus()
            {
                var tableQuery = new TableQuery<BackgroundJob>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, jobId));

                var result = (await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false)).First();

                this.AddFinalStatusToCache(result, jobId);

                return result;
            }

            var backgroundJob = this.refreshableCacheStore.GetItem<BackgroundJob>(jobId) ?? await QueryStatus().ConfigureAwait(false);

            return backgroundJob;
        }

        private void AddFinalStatusToCache(BackgroundJob backgroundJob, string jobId)
        {
            var success = Enum.TryParse<BackgroundJobStatus>(backgroundJob.Status, out var status);

            if (status != BackgroundJobStatus.InProgress)
            {
                this.refreshableCacheStore.PutItem(jobId, TimeSpan.FromDays(1), backgroundJob);
            }
        }

        private async Task UpdateTableStorageSafely<T>(Func<Task<T>> tableUpdate, string jobId)
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