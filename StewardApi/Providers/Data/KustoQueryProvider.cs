using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <inheritdoc />
    public sealed class KustoQueryProvider : IKustoQueryProvider
    {
        private readonly ITableStorageClient tableStorageClient;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="KustoQueryProvider"/> class.
        /// </summary>
        public KustoQueryProvider(
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

            configuration.Bind("KustoQueryStorageProperties", tableStorageProperties);
            tableStorageProperties.ConnectionString = tableStorageConnectionString;

            this.tableStorageClient = tableStorageClientFactory.CreateTableStorageClient(tableStorageProperties);
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task SaveKustoQueryAsync(KustoQuery kustoQuery)
        {
            kustoQuery.ShouldNotBeNull(nameof(kustoQuery));

            await this.SaveKustoQueryAsync(kustoQuery.Name, kustoQuery.Title, kustoQuery.Query).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task SaveKustoQueryAsync(string name, string title, string query)
        {
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));
            query.ShouldNotBeNullEmptyOrWhiteSpace(nameof(query));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));

            try
            {
                var internalQuery = new KustoQueryInternal(name, title, query);

                var insertOrReplaceOperation = TableOperation.InsertOrReplace(internalQuery);

                await this.tableStorageClient.ExecuteAsync(insertOrReplaceOperation).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Unable to upload query with name: {name}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<KustoQuery>> GetKustoQueriesAsync()
        {
            try
            {
                var tableQuery = new TableQuery<KustoQueryInternal>();

                var result = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);

                return this.mapper.Map<IList<KustoQuery>>(result);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException("Failed to lookup saved Kusto Queries.", ex);
            }
        }

        /// <inheritdoc />
        public async Task ReplaceKustoQueryAsync(string queryId, KustoQuery query)
        {
            queryId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(queryId));

            try
            {
                var tableQuery = new TableQuery<KustoQueryInternal>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, queryId));

                var results = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);
                if (results.Count <= 0)
                {
                    throw new NotFoundStewardException($"Query failed with queryId: {queryId}");
                }

                var result = results[0];
                result.Name = query.Name;
                result.Title = query.Title;
                result.Query = query.Query;

                var replaceOperation = TableOperation.Replace(result);
                await this.tableStorageClient.ExecuteAsync(replaceOperation).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException("Failed to find query to edit.", ex);
            }
        }

        /// <inheritdoc />
        public async Task DeleteKustoQueryAsync(string queryId)
        {
            queryId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(queryId));

            try
            {
                var tableQuery = new TableQuery<KustoQueryInternal>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, queryId));

                var results = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);

                foreach (var result in results)
                {
                    var deleteOperation = TableOperation.Delete(result);
                    await this.tableStorageClient.ExecuteAsync(deleteOperation).ConfigureAwait(false);
                }
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException("Failed to find query to remove.", ex);
            }
        }
    }
}
