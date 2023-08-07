using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Forza.UserInventory.FM7.Generated;
using Forza.WebServices.FM7.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections
{
    /// <inheritdoc />
    public sealed class ApolloServiceWrapper : IApolloService
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.StewardEnvironment,
            ConfigurationKeyConstants.ApolloClientVersion,
            ConfigurationKeyConstants.ApolloAdminXuid,
            ConfigurationKeyConstants.ApolloCertificateKeyVaultName,
            ConfigurationKeyConstants.ApolloCertificateSecretName
        };

        private readonly bool allowGiftingToAllUsers;
        private readonly X509Certificate2 lspCertificate;
        private readonly string clientVersion;
        private readonly ulong adminXuid;
        private readonly Client forzaClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloServiceWrapper"/> class.
        /// </summary>
        [SuppressMessage("Usage", "VSTHRD002:Avoid problematic synchronous waits", Justification = "Constructor")]
        public ApolloServiceWrapper(IConfiguration configuration, KeyVaultConfig keyVaultConfig)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultConfig.ShouldNotBeNull(nameof(keyVaultConfig));
            configuration.ShouldContainSettings(RequiredSettings);

            this.allowGiftingToAllUsers = configuration[ConfigurationKeyConstants.StewardEnvironment] == "prod";

            this.clientVersion = configuration[ConfigurationKeyConstants.ApolloClientVersion];
            this.adminXuid = Convert.ToUInt64(
                configuration[ConfigurationKeyConstants.ApolloAdminXuid],
                CultureInfo.InvariantCulture);

            var certificateSecret = keyVaultConfig.ApolloCertificateSecret;
            this.lspCertificate = this.ConvertToCertificate(certificateSecret);

            this.forzaClient = new Client(
                new CleartextMessageCryptoProvider(),
                new CleartextMessageCryptoProvider(),
                this.lspCertificate,
                false,
                clientVersion: this.clientVersion);
        }

        /// <inheritdoc/>
        public async Task<UserService.LiveOpsGetUserDataByGamertagOutput> LiveOpsGetUserDataByGamertagAsync(
            string gamertag,
            string endpoint)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var userService = this.GetUserService(endpoint);

            return await userService.LiveOpsGetUserDataByGamertag(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.LiveOpsGetUserDataByXuidOutput> LiveOpsGetUserDataByXuidAsync(
            ulong xuid,
            string endpoint)
        {
            var userService = this.GetUserService(endpoint);

            return await userService.LiveOpsGetUserDataByXuid(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.BanUsersV2Output> BanUsersAsync(
            ForzaUserBanParametersV2[] banParameters,
            int xuidCount,
            string endpoint)
        {
            var userService = this.GetUserService(endpoint);

            return await userService.BanUsersV2(banParameters, xuidCount).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserService.ExpireBanEntriesOutput> ExpireBanEntriesAsync(
            ForzaUserExpireBanParameters[] banParameters,
            int entryCount,
            string endpoint)
        {
            var userService = this.GetUserService(endpoint);

            return await userService.ExpireBanEntries(banParameters, entryCount).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<UserService.DeleteBanEntriesOutput> DeleteBanEntriesAsync(
            int[] banParameters,
            string endpoint)
        {
            var userService = this.GetUserService(endpoint);

            return await userService.DeleteBanEntries(banParameters).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetUserBanHistoryV2Output> GetUserBanHistoryAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var userService = this.GetUserService(endpoint);

            return await userService.GetUserBanHistoryV2(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetUserBanSummariesV2Output> GetUserBanSummariesAsync(
            ulong[] xuids,
            string endpoint)
        {
            var userService = this.GetUserService(endpoint);

            return await userService.GetUserBanSummariesV2(xuids).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetConsolesOutput> GetConsolesAsync(
            ulong xuid,
            int maxResults,
            string endpoint)
        {
            var userService = this.GetUserService(endpoint);

            return await userService.GetConsoles(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint)
        {
            var userService = this.GetUserService(endpoint);

            await userService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var userService = this.GetUserService(endpoint);

            return await userService.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid, string endpoint)
        {
            var userService = this.GetUserService(endpoint);

            return await userService.GetIsUnderReview(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview, string endpoint)
        {
            var userService = this.GetUserService(endpoint);

            await userService.SetIsUnderReview(xuid, isUnderReview).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(
            ulong xuid,
            string endpoint)
        {
            var userInventoryService = this.GetUserInventoryService(endpoint);

            return await userInventoryService.GetAdminUserInventory(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput>
            GetAdminUserInventoryByProfileIdAsync(int profileId, string endpoint)
        {
            var userInventoryService = this.GetUserInventoryService(endpoint);

            return await userInventoryService.GetAdminUserInventoryByProfileId(profileId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(
            ulong xuid,
            uint maxProfiles,
            string endpoint)
        {
            var userInventoryService = this.GetUserInventoryService(endpoint);

            return await userInventoryService.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AddToUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint)
        {
            var groupingService = this.GetGroupingService(endpoint);

            await groupingService.AddToUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(
            ulong xuid,
            int[] groupIdFilter,
            int maxResults,
            string endpoint)
        {
            var groupingService = this.GetGroupingService(endpoint);

            return await groupingService.GetUserGroupMemberships(xuid, groupIdFilter, maxResults)
                .ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserManagementService.GetUserGroupsOutput> GetUserGroupsAsync(
            int startIndex,
            int maxResults,
            string endpoint)
        {
            var groupingService = this.GetGroupingService(endpoint);

            return await groupingService.GetUserGroups(startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds, string endpoint)
        {
            var groupingService = this.GetGroupingService(endpoint);

            await groupingService.RemoveFromUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(
            int maxResults,
            string endpoint)
        {
            var giftingService = this.GetGiftingService(endpoint);

            return await giftingService.AdminGetSupportedGiftTypes(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AdminSendItemGiftAsync(
            ulong recipientXuid,
            InventoryItemType itemType,
            int itemValue,
            string endpoint)
        {
            var giftingService = this.GetGiftingService(endpoint);

            await giftingService.AdminSendItemGift(recipientXuid, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AdminSendItemGroupGiftAsync(
            int groupId,
            InventoryItemType itemType,
            int itemValue,
            string endpoint)
        {
            if (groupId == 0 && !this.allowGiftingToAllUsers)
            {
                throw new FailedToSendStewardException(
                    "Sending to All User group is blocked outside of the production environment.");
            }

            var giftingService = this.GetGiftingService(endpoint);

            await giftingService.AdminSendItemGroupGift(groupId, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GiftingService.AdminSendLiveryGiftOutput> SendCarLiveryAsync(ulong[] xuids, string liveryId, string endpoint)
        {
            var giftingService = this.GetGiftingService(endpoint);

            return await giftingService.AdminSendLiveryGift(xuids, xuids.Length, liveryId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GiftingService.AdminSendGroupLiveryGiftOutput> SendCarLiveryAsync(int groupId, string liveryId, string endpoint)
        {
            if (groupId == 0 && !this.allowGiftingToAllUsers)
            {
                throw new FailedToSendStewardException(
                    "Sending to All User group is blocked outside of the production environment.");
            }

            var giftingService = this.GetGiftingService(endpoint);

            return await giftingService.AdminSendGroupLiveryGift(groupId, liveryId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<StorefrontManagementService.GetUGCForUserOutput> GetPlayerUgcContentAsync(
            ulong xuid,
            ForzaUGCContentType contentType,
            string endpoint,
            bool includeThumbnails = false)
        {
            var storefrontService = this.GeStorefrontService(endpoint);

            return await storefrontService.GetUGCForUser(xuid, contentType, includeThumbnails, 8_000).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<StorefrontManagementService.SearchUGCV2Output> SearchUgcContentAsync(
            ForzaUGCSearchV2Request filters,
            ForzaUGCContentType contentType,
            string endpoint,
            bool includeThumbnails = false)
        {
            var storefrontService = this.GeStorefrontService(endpoint);

            return await storefrontService.SearchUGCV2(filters, contentType, includeThumbnails, 5_000).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<StorefrontManagementService.GetUGCLiveryOutput> GetPlayerLiveryAsync(
            string liveryId,
            string endpoint)
        {
            var storefrontService = this.GeStorefrontService(endpoint);

            return await storefrontService.GetUGCLivery(liveryId).ConfigureAwait(false);
        }

        private X509Certificate2 ConvertToCertificate(string certificateSecret)
        {
            certificateSecret.ShouldNotBeNullEmptyOrWhiteSpace(nameof(certificateSecret));

            var privateKeyBytes = Convert.FromBase64String(certificateSecret);
            privateKeyBytes.ShouldNotBeNull(nameof(privateKeyBytes));

            return new X509Certificate2(privateKeyBytes);
        }

        private UserService GetUserService(string endpoint)
        {
            return new UserService(this.forzaClient, endpoint, this.adminXuid, null, false);
        }

        private UserInventoryService GetUserInventoryService(string endpoint)
        {
            return new UserInventoryService(this.forzaClient, endpoint, this.adminXuid, null, false);
        }

        private UserManagementService GetGroupingService(string endpoint)
        {
            return new UserManagementService(this.forzaClient, endpoint, this.adminXuid, null, false);
        }

        private GiftingService GetGiftingService(string endpoint)
        {
            return new GiftingService(this.forzaClient, endpoint, this.adminXuid, null, false);
        }

        private StorefrontManagementService GeStorefrontService(string endpoint)
        {
            return new StorefrontManagementService(this.forzaClient, endpoint, this.adminXuid, null, false);
        }
    }
}
