﻿using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <inheritdoc />
    public sealed class StewardUserProvider : IStewardUserProvider, IScopedStewardUserProvider
    {
        private readonly ITableStorageClient tableStorageClient;
        private readonly IRefreshableCacheStore refreshableCacheStore;

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardUserProvider"/> class.
        /// </summary>
        [SuppressMessage("Usage", "VSTHRD002:Avoid problematic synchronous waits", Justification = "Constructor")]
        public StewardUserProvider(
            ITableStorageClientFactory tableStorageClientFactory,
            IConfiguration configuration,
            IKeyVaultProvider keyVaultProvider,
            IRefreshableCacheStore refreshableCacheStore)
        {
            tableStorageClientFactory.ShouldNotBeNull(nameof(tableStorageClientFactory));
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));

            var tableStorageProperties = new TableStorageProperties();
            var tableStorageConnectionString = keyVaultProvider.GetSecretAsync(
                configuration[ConfigurationKeyConstants.KeyVaultUrl],
                "table-storage-connection-string").GetAwaiter().GetResult();

            configuration.Bind("StewardUserStorageProperties", tableStorageProperties);
            tableStorageProperties.ConnectionString = tableStorageConnectionString;

            this.tableStorageClient = tableStorageClientFactory.CreateTableStorageClient(tableStorageProperties);
            this.refreshableCacheStore = refreshableCacheStore;
        }

        /// <inheritdoc />
        public async Task CreateStewardUserAsync(StewardUser user)
        {
            user.ShouldNotBeNull(nameof(user));

            await this.CreateStewardUserAsync(user.ObjectId, user.Name, user.EmailAddress, user.Role, user.Attributes).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task CreateStewardUserAsync(string id, string name, string email, string role, string attributes)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));
            email.ShouldNotBeNullEmptyOrWhiteSpace(nameof(email));
            role.ShouldNotBeNullEmptyOrWhiteSpace(nameof(role));

            try
            {
                var stewardUser = new StewardUserInternal(id, name, email, role, attributes);

                var insertOrReplaceOperation = TableOperation.InsertOrReplace(stewardUser);

                await this.tableStorageClient.ExecuteAsync(insertOrReplaceOperation).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Unable to upload create Steward user with ID: {id}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task UpdateStewardUserAsync(StewardUser user)
        {
            user.ShouldNotBeNull(nameof(user));

            await this.UpdateStewardUserAsync(user.ObjectId, user.Name, user.EmailAddress, user.Role, user.Attributes).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task UpdateStewardUserAsync(string id, string name, string email, string role, string attributes)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));
            email.ShouldNotBeNullEmptyOrWhiteSpace(nameof(email));
            try
            {
                var result = await this.GetStewardUserAsync(id).ConfigureAwait(false);
                result.Name = name;
                result.EmailAddress = email;
                result.Role = role;
                result.Attributes = attributes;

                var replaceOperation = TableOperation.Replace(result);

                await this.tableStorageClient.ExecuteAsync(replaceOperation).ConfigureAwait(false);
                this.refreshableCacheStore.ClearItem(id);

                // Make sure the user gets updated in the cache, but don't block
                _ = this.GetStewardUserAsync(id);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Failed to update user with ID: {id}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<StewardUserInternal> GetStewardUserAsync(string id)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));

            async Task<StewardUserInternal> QueryUser()
            {
                var tableQuery = new TableQuery<StewardUserInternal>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, id));

                var result = (await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false)).First();
                this.refreshableCacheStore.PutItem(id, TimeSpan.FromDays(1), result);

                return result;
            }

            try
            {
                return this.refreshableCacheStore.GetItem<StewardUserInternal>(id) ?? await QueryUser().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"Lookup failed for ID: {id}", ex);
            }
        }

        /// <inheritdoc />
        public async Task EnsureStewardUserAsync(StewardUser user)
        {
            await this.EnsureStewardUserAsync(user.ObjectId, user.Name, user.EmailAddress, user.Role, user.Attributes).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task EnsureStewardUserAsync(string id, string name, string email, string role, string attributes)
        {
            try
            {
                var user = await this.GetStewardUserAsync(id).ConfigureAwait(false);

                if (name != user.Name || email != user.EmailAddress || role != user.Role || attributes != user.Attributes)
                {
                    await this.UpdateStewardUserAsync(id, name, email, role, attributes).ConfigureAwait(false);
                }
            }
            catch
            {
                await this.CreateStewardUserAsync(id, name, email, role, attributes).ConfigureAwait(false);
            }
        }
    }
}
