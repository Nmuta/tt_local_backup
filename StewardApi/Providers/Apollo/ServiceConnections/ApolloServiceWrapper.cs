using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Forza.UserInventory.FM7.Generated;
using Forza.WebServices.FM7.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using GroupingService = Xls.WebServices.FM7.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections
{
    /// <inheritdoc />
    public sealed class ApolloServiceWrapper : IApolloService
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.ApolloUri,
            ConfigurationKeyConstants.ApolloClientVersion,
            ConfigurationKeyConstants.ApolloAdminXuid,
            ConfigurationKeyConstants.ApolloCertificateKeyVaultName,
            ConfigurationKeyConstants.ApolloCertificateSecretName
        };

        private readonly string environmentUri;
        private readonly X509Certificate2 lspCertificate;
        private readonly string clientVersion;
        private readonly ulong adminXuid;
        private readonly Client forzaClient;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloServiceWrapper"/> class.
        /// </summary>
        public ApolloServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            configuration.ShouldContainSettings(RequiredSettings);

            this.environmentUri = configuration[ConfigurationKeyConstants.ApolloUri];
            this.clientVersion = configuration[ConfigurationKeyConstants.ApolloClientVersion];
            this.adminXuid = Convert.ToUInt64(configuration[ConfigurationKeyConstants.ApolloAdminXuid], CultureInfo.InvariantCulture);
            var keyVaultName = configuration[ConfigurationKeyConstants.ApolloCertificateKeyVaultName];
            var secretName = configuration[ConfigurationKeyConstants.ApolloCertificateSecretName];

            var certificateSecret = keyVaultProvider.GetSecretAsync(keyVaultName, secretName).GetAwaiter().GetResult();
            this.lspCertificate = this.ConvertToCertificate(certificateSecret);

            this.forzaClient = new Client(
                new CleartextMessageCryptoProvider(),
                new CleartextMessageCryptoProvider(),
                this.lspCertificate,
                false,
                clientVersion: this.clientVersion);
        }

        /// <inheritdoc/>
        public async Task<UserService.LiveOpsGetUserDataByGamertagOutput> LiveOpsGetUserDataByGamertagAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var userService = this.GetUserService();

            return await userService.LiveOpsGetUserDataByGamertag(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.LiveOpsGetUserDataByXuidOutput> LiveOpsGetUserDataByXuidAsync(ulong xuid)
        {
            var userService = this.GetUserService();

            return await userService.LiveOpsGetUserDataByXuid(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.BanUsersOutput> BanUsersAsync(ForzaUserBanParameters[] banParameters)
        {
            var userService = this.GetUserService();

            return await userService.BanUsers(banParameters, banParameters.Length).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults)
        {
            var userService = this.GetUserService();

            return await userService.GetUserBanHistory(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids, int xuidCount)
        {
            var userService = this.GetUserService();

            return await userService.GetUserBanSummaries(xuids, xuidCount).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults)
        {
            var userService = this.GetUserService();

            return await userService.GetConsoles(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned)
        {
            var userService = this.GetUserService();

            await userService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            var userService = this.GetUserService();

            return await userService.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserService.GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid)
        {
            var userService = this.GetUserService();

            return await userService.GetIsUnderReview(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview)
        {
            var userService = this.GetUserService();

            await userService.SetIsUnderReview(xuid, isUnderReview).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid)
        {
            var userInventoryService = this.GetUserInventoryService();

            return await userInventoryService.GetAdminUserInventory(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId)
        {
            var userInventoryService = this.GetUserInventoryService();

            return await userInventoryService.GetAdminUserInventoryByProfileId(profileId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles)
        {
            var userInventoryService = this.GetUserInventoryService();

            return await userInventoryService.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AddToUserGroupsAsync(ulong xuid, int[] groupIds)
        {
            var groupingService = this.GetGroupingService();

            await groupingService.AddToUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GroupingService.GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupIdFilter, int maxResults)
        {
            var groupingService = this.GetGroupingService();

            return await groupingService.GetUserGroupMemberships(xuid, groupIdFilter, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GroupingService.GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults)
        {
            var groupingService = this.GetGroupingService();

            return await groupingService.GetUserGroups(startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds)
        {
            var groupingService = this.GetGroupingService();

            await groupingService.RemoveFromUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GiftingService.AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults)
        {
            var giftingService = this.GetGiftingService();

            return await giftingService.AdminGetSupportedGiftTypes(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AdminSendItemGiftAsync(ulong recipientXuid, InventoryItemType itemType, int itemValue)
        {
            var giftingService = this.GetGiftingService();

            await giftingService.AdminSendItemGift(recipientXuid, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue)
        {
            var giftingService = this.GetGiftingService();

            await giftingService.AdminSendItemGroupGift(groupId, itemType, itemValue).ConfigureAwait(false);
        }

        private X509Certificate2 ConvertToCertificate(string certificateSecret)
        {
            certificateSecret.ShouldNotBeNullEmptyOrWhiteSpace(nameof(certificateSecret));

            var privateKeyBytes = Convert.FromBase64String(certificateSecret);
            privateKeyBytes.ShouldNotBeNull(nameof(privateKeyBytes));

            return new X509Certificate2(privateKeyBytes);
        }

        private UserService GetUserService()
        {
            return new UserService(this.forzaClient, this.environmentUri, this.adminXuid, null, false);
        }

        private UserInventoryService GetUserInventoryService()
        {
            return new UserInventoryService(this.forzaClient, this.environmentUri, this.adminXuid, null, false);
        }

        private GroupingService GetGroupingService()
        {
            return new GroupingService(this.forzaClient, this.environmentUri, this.adminXuid, null, false);
        }

        private GiftingService GetGiftingService()
        {
            return new GiftingService(this.forzaClient, this.environmentUri, this.adminXuid, null, false);
        }
    }
}
