using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <inheritdoc />
    public sealed class PlayFabBuildLocksProvider : IPlayFabBuildLocksProvider
    {
        private readonly ITableStorageClient tableStorageClient;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PlayFabBuildLocksProvider"/> class.
        /// </summary>
        [SuppressMessage("Usage", "VSTHRD002:Avoid problematic synchronous waits", Justification = "Constructor")]
        public PlayFabBuildLocksProvider(
            ITableStorageClientFactory tableStorageClientFactory,
            IMapper mapper,
            IConfiguration configuration,
            IKeyVaultProvider keyVaultProvider)
        {
            tableStorageClientFactory.ShouldNotBeNull(nameof(tableStorageClientFactory));
            mapper.ShouldNotBeNull(nameof(mapper));
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));

            var tableStorageProperties = new TableStorageProperties();
            var tableStorageConnectionString = keyVaultProvider.GetSecretAsync(configuration[ConfigurationKeyConstants.KeyVaultUrl], "table-storage-connection-string").GetAwaiter().GetResult();

            configuration.Bind("PlayFabBuildLocksStorageProperties", tableStorageProperties);
            tableStorageProperties.ConnectionString = tableStorageConnectionString;

            this.tableStorageClient = tableStorageClientFactory.CreateTableStorageClient(tableStorageProperties);
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<PlayFabBuildLock> GetAsync(Guid buildId)
        {
            PlayFabBuildLockInternal result;

            try
            {
                var tableQuery = new TableQuery<PlayFabBuildLockInternal>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, buildId.ToString()));

                var results = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);
                if (results.Count <= 0)
                {
                    throw new NotFoundStewardException($"Could not find PlayFab build lock in database. (buildId: {buildId})");
                }

                result = results[0];
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get PlayFab build lock. (buildId: {buildId})", ex);
            }

            return this.mapper.Map<PlayFabBuildLock>(result);
        }

        /// <inheritdoc />
        public async Task<IList<PlayFabBuildLock>> GetMultipleAsync(WoodstockPlayFabEnvironment environment, bool? withActiveLocks = null)
        {
            IList<PlayFabBuildLockInternal> result;

            try
            {
                var tableQuery = new TableQuery<PlayFabBuildLockInternal>().Where(TableQuery.GenerateFilterCondition("PlayFabEnvironment", QueryComparisons.Equal, environment.ToString()));
                if (withActiveLocks.HasValue)
                {
                    tableQuery = tableQuery.Where(TableQuery.GenerateFilterCondition("IsLocked", QueryComparisons.Equal, withActiveLocks.Value.ToString()));
                }

                result = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to get PlayFab build locks.", ex);
            }

            return this.mapper.Map<IList<PlayFabBuildLock>>(result);
        }

        /// <inheritdoc />
        public async Task CreateAsync(PlayFabBuildLock newbuildLock)
        {
            var internalLock = this.mapper.SafeMap<PlayFabBuildLockInternal>(newbuildLock);

            try
            {
                var insertOrReplaceOperation = TableOperation.InsertOrReplace(internalLock);

                await this.tableStorageClient.ExecuteAsync(insertOrReplaceOperation).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to create new PlayFab build lock. (buildId: {newbuildLock.Id})", ex);
            }
        }

        /// <inheritdoc />
        public async Task UpdateAsync(Guid buildId, PlayFabBuildLockRequest updatedBuildLock)
        {
            var existingBuildLock = await this.GetAsync(buildId).ConfigureAwait(true);
            var existingBuildLockInternal = this.mapper.SafeMap<PlayFabBuildLockInternal>(existingBuildLock);

            try
            {
                // Only update fields we care about.
                existingBuildLockInternal.ETag = "*";
                existingBuildLockInternal.Reason = updatedBuildLock.Reason;
                existingBuildLockInternal.IsLocked = updatedBuildLock.IsLocked;

                var replaceOperation = TableOperation.Replace(existingBuildLockInternal);
                await this.tableStorageClient.ExecuteAsync(replaceOperation).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to create new PlayFab build lock. (buildId: {buildId})", ex);
            }
        }

        /// <inheritdoc />
        public async Task DeleteAsync(Guid buildId)
        {
            var existingBuildLock = await this.GetAsync(buildId).ConfigureAwait(true);
            var existingBuildLockInternal = this.mapper.SafeMap<PlayFabBuildLockInternal>(existingBuildLock);

            try
            {
                existingBuildLockInternal.ETag = "*";
                var deleteOperation = TableOperation.Delete(existingBuildLockInternal);
                await this.tableStorageClient.ExecuteAsync(deleteOperation).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to delete PlayFab build lock. (buildId: {buildId})", ex);
            }
        }
    }
}
