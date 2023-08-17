using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <inheritdoc />
    public sealed class PlayFabBuildLocksProvider : IPlayFabBuildLocksProvider, IInitializeable
    {
        private readonly ITableStorageClientFactory tableStorageClientFactory;
        private readonly KeyVaultConfig keyVaultConfig;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;
        private ITableStorageClient tableStorageClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PlayFabBuildLocksProvider"/> class.
        /// </summary>
        public PlayFabBuildLocksProvider(
            ITableStorageClientFactory tableStorageClientFactory,
            IMapper mapper,
            IConfiguration configuration,
            KeyVaultConfig keyVaultConfig)
        {
            tableStorageClientFactory.ShouldNotBeNull(nameof(tableStorageClientFactory));
            mapper.ShouldNotBeNull(nameof(mapper));
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultConfig.ShouldNotBeNull(nameof(keyVaultConfig));

            this.keyVaultConfig = keyVaultConfig;
            this.configuration = configuration;
            this.tableStorageClientFactory = tableStorageClientFactory;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public Task InitializeAsync()
        {
            var tableStorageProperties = new TableStorageProperties();
            var tableStorageConnectionString = this.keyVaultConfig.SharedTableStorageConnectionString;

            this.configuration.Bind("PlayFabBuildLocksStorageProperties", tableStorageProperties);
            tableStorageProperties.ConnectionString = tableStorageConnectionString;

            this.tableStorageClient = this.tableStorageClientFactory.CreateTableStorageClient(tableStorageProperties);

            return Task.CompletedTask;
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

            return this.mapper.SafeMap<PlayFabBuildLock>(result);
        }

        /// <inheritdoc />
        public async Task<IList<PlayFabBuildLock>> GetMultipleAsync(WoodstockPlayFabEnvironment environment)
        {
            IList<PlayFabBuildLockInternal> result;

            try
            {
                var tableQuery = new TableQuery<PlayFabBuildLockInternal>().Where(TableQuery.GenerateFilterCondition("PlayFabEnvironment", QueryComparisons.Equal, environment.ToString()));

                result = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to get PlayFab build locks.", ex);
            }

            return this.mapper.SafeMap<IList<PlayFabBuildLock>>(result);
        }

        /// <inheritdoc />
        public async Task<PlayFabBuildLock> CreateAsync(PlayFabBuildLock newbuildLock)
        {
            var internalLock = this.mapper.SafeMap<PlayFabBuildLockInternal>(newbuildLock);

            try
            {
                var insertOrReplaceOperation = TableOperation.InsertOrReplace(internalLock);

                await this.tableStorageClient.ExecuteAsync(insertOrReplaceOperation).ConfigureAwait(false);

                return newbuildLock;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to create new PlayFab build lock. (buildId: {newbuildLock.Id})", ex);
            }
        }

        /// <inheritdoc />
        public async Task<PlayFabBuildLock> DeleteAsync(WoodstockPlayFabEnvironment environment, Guid buildId)
        {
            var existingBuildLock = await this.GetAsync(buildId).ConfigureAwait(true);
            var existingBuildLockInternal = this.mapper.SafeMap<PlayFabBuildLockInternal>(existingBuildLock);
            var parsedExistingLockEnvironment = existingBuildLockInternal.PlayFabEnvironment.TryParseEnumElseThrow<WoodstockPlayFabEnvironment>(nameof(existingBuildLockInternal.PlayFabEnvironment));
            if (parsedExistingLockEnvironment != environment)
            {
                throw new InvalidArgumentsStewardException($"PlayFab build was found, but incorrect environment was provided. (environment: {environment}) (buildId: {buildId})");
            }

            try
            {
                existingBuildLockInternal.ETag = "*";
                var deleteOperation = TableOperation.Delete(existingBuildLockInternal);
                await this.tableStorageClient.ExecuteAsync(deleteOperation).ConfigureAwait(false);

                return existingBuildLock;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to delete PlayFab build lock. (buildId: {buildId})", ex);
            }
        }
    }
}
