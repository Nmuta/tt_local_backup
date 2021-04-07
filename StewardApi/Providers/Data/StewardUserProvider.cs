﻿using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <inheritdoc />
    public sealed class StewardUserProvider : IStewardUserProvider
    {
        private readonly ITableStorageClient tableStorageClient;
        private readonly IMapper mapper;
        private readonly IRefreshableCacheStore refreshableCacheStore;

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardUserProvider"/> class.
        /// </summary>
        public StewardUserProvider(
            ITableStorageClientFactory tableStorageClientFactory,
            IMapper mapper,
            IConfiguration configuration,
            IKeyVaultProvider keyVaultProvider,
            IRefreshableCacheStore refreshableCacheStore)
        {
            tableStorageClientFactory.ShouldNotBeNull(nameof(tableStorageClientFactory));
            mapper.ShouldNotBeNull(nameof(mapper));
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
            this.mapper = mapper;
            this.refreshableCacheStore = refreshableCacheStore;
        }

        /// <inheritdoc />
        public async Task CreateStewardUserAsync(StewardUserClaims user)
        {
            user.ShouldNotBeNull(nameof(user));

            await this.CreateStewardUserAsync(user.ObjectId, user.Name, user.EmailAddress).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task CreateStewardUserAsync(string id, string name, string email)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));
            email.ShouldNotBeNullEmptyOrWhiteSpace(nameof(email));

            try
            {
                var stewardUser = new StewardUser(id, name, email);

                var insertOrReplaceOperation = TableOperation.InsertOrReplace(stewardUser);

                await this.tableStorageClient.ExecuteAsync(insertOrReplaceOperation).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Unable to upload create Steward user with ID: {id}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task UpdateStewardUserAsync(StewardUserClaims user)
        {
            user.ShouldNotBeNull(nameof(user));

            await this.UpdateStewardUserAsync(user.ObjectId, user.Name, user.EmailAddress).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task UpdateStewardUserAsync(string id, string name, string email)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));
            email.ShouldNotBeNullEmptyOrWhiteSpace(nameof(email));
            try
            {
                var result = await this.GetStewardUserAsync(id).ConfigureAwait(false);
                result.Name = name;
                result.EmailAddress = email;

                var replaceOperation = TableOperation.Replace(result);

                await this.tableStorageClient.ExecuteAsync(replaceOperation).ConfigureAwait(false);
                this.refreshableCacheStore.ClearItem(id);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Failed to update user with ID: {id}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<StewardUser> GetStewardUserAsync(string id)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));

            async Task<StewardUser> QueryUser()
            {
                var tableQuery = new TableQuery<StewardUser>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, id));

                var result = (await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false)).First();
                this.refreshableCacheStore.PutItem(id, TimeSpan.FromDays(1), result);

                return result;
            }

            try
            {
                var user = this.refreshableCacheStore.GetItem<StewardUser>(id) ?? await QueryUser().ConfigureAwait(false);

                return user;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"Lookup failed for ID: {id}", ex);
            }
        }

        /// <inheritdoc />
        public async Task EnsureStewardUserAsync(StewardUserClaims user)
        {
            await this.EnsureStewardUserAsync(user.ObjectId, user.Name, user.EmailAddress).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task EnsureStewardUserAsync(string id, string name, string email)
        {
            try
            {
                var user = await this.GetStewardUserAsync(id).ConfigureAwait(false);

                if (name != user.Name || email != user.EmailAddress)
                {
                    await this.UpdateStewardUserAsync(id, name, email).ConfigureAwait(false);
                }
            }
            catch
            {
                await this.CreateStewardUserAsync(id, name, email).ConfigureAwait(false);
            }
        }
    }
}
