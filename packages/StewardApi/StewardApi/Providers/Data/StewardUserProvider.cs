using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Kusto.Cloud.Platform.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Turn10.Data.Azure;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <inheritdoc />
    public sealed class StewardUserProvider : IStewardUserProvider, IScopedStewardUserProvider, IInitializeable
    {
        private readonly string allStewardUsersCacheKey = "AllStewardUserIds";

        private readonly ITableStorageClientFactory tableStorageClientFactory;
        private readonly KeyVaultConfig keyVaultConfig;
        private readonly IConfiguration configuration;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private ITableStorageClient tableStorageClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardUserProvider"/> class.
        /// </summary>
        public StewardUserProvider(
            ITableStorageClientFactory tableStorageClientFactory,
            IConfiguration configuration,
            KeyVaultConfig keyVaultConfig,
            IRefreshableCacheStore refreshableCacheStore)
        {
            tableStorageClientFactory.ShouldNotBeNull(nameof(tableStorageClientFactory));
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultConfig.ShouldNotBeNull(nameof(keyVaultConfig));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));

            this.keyVaultConfig = keyVaultConfig;
            this.configuration = configuration;
            this.tableStorageClientFactory = tableStorageClientFactory;
            this.refreshableCacheStore = refreshableCacheStore;
        }

        /// <inheritdoc />
        public Task InitializeAsync()
        {
            var tableStorageProperties = new TableStorageProperties();
            var tableStorageConnectionString = keyVaultConfig.TableStorageConnectionString;

            this.configuration.Bind("StewardUserStorageProperties", tableStorageProperties);
            tableStorageProperties.ConnectionString = tableStorageConnectionString;

            this.tableStorageClient = this.tableStorageClientFactory.CreateTableStorageClient(tableStorageProperties);

            return Task.CompletedTask;
        }

        /// <inheritdoc />
        public async Task CreateStewardUserAsync(StewardUser user)
        {
            user.ShouldNotBeNull(nameof(user));

            await this.CreateStewardUserAsync(user.ObjectId, user.Name, user.EmailAddress, user.Role, JsonConvert.SerializeObject(user.Attributes), JsonConvert.SerializeObject(user.Team)).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task CreateStewardUserAsync(string id, string name, string email, string role, string attributes, string team)
        {
            id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(id));
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));
            email.ShouldNotBeNullEmptyOrWhiteSpace(nameof(email));
            role.ShouldNotBeNullEmptyOrWhiteSpace(nameof(role));

            try
            {
                var stewardUser = new StewardUserInternal(id, name, email, role, attributes, team);

                var insertOrReplaceOperation = TableOperation.InsertOrReplace(stewardUser);

                await this.tableStorageClient.ExecuteAsync(insertOrReplaceOperation).ConfigureAwait(false);

                // Update all user ids mem cache. No need to await, letting it run in the background
                await this.QueryUserIdsAsync();
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

            await this.UpdateStewardUserAsync(user.ObjectId, user.Name, user.EmailAddress, user.Role, JsonConvert.SerializeObject(user.Attributes), JsonConvert.SerializeObject(user.Team)).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task UpdateStewardUserAsync(string id, string name, string email, string role, string attributes, string team)
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
                result.Team = team;

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
        public async Task<bool> HasPermissionsForAsync(HttpContext httpContext, string objectId, string attribute)
        {
            // If the user is a LiveOpsAdmin, skip permissions checks
            if (httpContext.User.IsInRole(UserRole.LiveOpsAdmin))
            {
                return true;
            }

            StewardUserInternal user = null;

            try
            {
                user = await this.GetStewardUserAsync(objectId).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new ForbiddenStewardException("Invalid user claim.", ex);
            }

            this.EnvironmentAndTitle(httpContext, out string title, out string environment);

            var authorized = user.AuthorizationAttributes().Where(authAttr =>
                    Equals(authAttr.Environment, environment) &&
                    Equals(authAttr.Title, title) &&
                    Equals(authAttr.Attribute, attribute));

            return authorized.Any();

            static bool Equals(string str, string attr)
            {
                return str?.Equals(attr, StringComparison.OrdinalIgnoreCase) == true;
            }
        }

        /// <inheritdoc />
        public async Task EnsureStewardUserAsync(StewardClaimsUser user)
        {
          // We shouldnt pass in the attributes from claim. it doesnt exist
            await this.EnsureStewardUserAsync(user.ObjectId, user.Name, user.EmailAddress, user.Role).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task EnsureStewardUserAsync(string id, string name, string email, string role)
        {
            try
            {
                var user = await this.GetStewardUserAsync(id).ConfigureAwait(false);

                if (name != user.Name || email != user.EmailAddress || role != user.Role)
                {
                    await this.UpdateStewardUserAsync(id, name, email, role, user.Attributes, user.Team).ConfigureAwait(false);
                }
            }
            catch (NotFoundStewardException)
            {
                await this.CreateStewardUserAsync(id, name, email, role, string.Empty, string.Empty).ConfigureAwait(false);
            }
            catch (Exception e)
            {
                throw new UnknownFailureStewardException("Could not validate Steward User", e);
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<StewardUserInternal>> GetAllStewardUsersAsync()
        {
            try
            {
                var userIds = this.refreshableCacheStore.GetItem<IEnumerable<StewardUserId>>(this.allStewardUsersCacheKey) ?? await this.QueryUserIdsAsync().ConfigureAwait(false);
                var tasks = userIds.Select(u => this.GetStewardUserAsync(u.ObjectId));
                await Task.WhenAll(tasks).ConfigureAwait(false);
                var allUsers = tasks.Select(t => t.GetAwaiter().GetResult()).ToList();

                return allUsers;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to lookup all users in Steward.", ex);
            }
        }

        /// <summary>
        ///     Queries all user ids and sets the list in memory cache.
        /// </summary>
        private async Task<IEnumerable<StewardUserId>> QueryUserIdsAsync()
        {
            var tableQuery = new TableQuery<StewardUserId>().Select(new List<string>() { "ObjectId" });
            var result = await this.tableStorageClient.ExecuteQueryAsync(tableQuery).ConfigureAwait(false);
            this.refreshableCacheStore.PutItem(this.allStewardUsersCacheKey, TimeSpan.FromDays(1), result);

            return result;
        }

        public void EnvironmentAndTitle(HttpContext httpContext, out string title, out string environment)
        {
            title = this.RequestPathSegment(httpContext.Request.Path, "title", true);
            var api = this.RequestPathSegment(httpContext.Request.Path, "api");
            environment = string.Empty;

            if (string.IsNullOrEmpty(title))
            {
                return;
            }

            // v1 apis use endpointKey, value is Title|environment
            // v2 apis use Endpoint-Title, value is environment
            var environmentKey = "v1".Equals(api, StringComparison.OrdinalIgnoreCase) ? "endpointKey" : $"Endpoint-{title}";

            if (!httpContext.Request.Headers.TryGetValue(environmentKey, out var env))
            {
                throw new BadRequestStewardException($"Missing {environmentKey} header.");
            }

            if (string.IsNullOrEmpty(env))
            {
                throw new BadRequestStewardException($"Null or empty {environmentKey} header.");
            }

            environment = env.ToString().Contains('|', StringComparison.OrdinalIgnoreCase) ? env.ToString().Split("|")[1] : env;

            return;
        }

        string RequestPathSegment(PathString path, string key, bool capitalize = false)
        {
            if (path == null)
            {
                return string.Empty;
            }

            var segments = path.ToUriComponent().Split("/");

            var index = segments.IndexOf(segment => string.Equals(segment, key, StringComparison.OrdinalIgnoreCase)) + 1;
            if (index >= segments.Length || index == 0)
            {
                return string.Empty;
            }

            var segment = segments[index];

            return capitalize ? char.ToUpperInvariant(segment[0]) + segment[1..] : segment;
        }
    }
}
