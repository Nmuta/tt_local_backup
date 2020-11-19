using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using Xls.FH4.master.Generated;
using Xls.WebServices.FH4.master.Generated;
using static Xls.WebServices.FH4.master.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunriseUserServiceWrapper : ISunriseUserService
    {
        private const string AuthTokenKey = "SunriseServiceAuthToken";

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.SunriseUri,
            ConfigurationKeyConstants.SunriseClientVersion,
            ConfigurationKeyConstants.SunriseAdminXuid,
            ConfigurationKeyConstants.SunriseSandbox,
            ConfigurationKeyConstants.SunriseTitleId
        };

        private readonly string environmentUri;
        private readonly string clientVersion;
        private readonly ulong adminXuid;
        private readonly string sandbox;
        private readonly uint titleId;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IStsClient stsClient;

        /// <summary>
        ///      Initializes a new instance of the <see cref="SunriseUserServiceWrapper"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        /// <param name="refreshableCacheStore">The refreshable cache store.</param>
        /// <param name="stsClient">The STS client.</param>
        public SunriseUserServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider, IRefreshableCacheStore refreshableCacheStore, IStsClient stsClient)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            stsClient.ShouldNotBeNull(nameof(stsClient));
            configuration.ShouldContainSettings(RequiredSettings);

            this.refreshableCacheStore = refreshableCacheStore;
            this.stsClient = stsClient;

            this.environmentUri = configuration[ConfigurationKeyConstants.SunriseUri];
            this.clientVersion = configuration[ConfigurationKeyConstants.SunriseClientVersion];
            this.adminXuid = Convert.ToUInt64(configuration[ConfigurationKeyConstants.SunriseAdminXuid], CultureInfo.InvariantCulture);
            this.sandbox = configuration[ConfigurationKeyConstants.SunriseSandbox];
            this.titleId = Convert.ToUInt32(configuration[ConfigurationKeyConstants.SunriseTitleId], CultureInfo.InvariantCulture);
        }

        /// <inheritdoc/>
        public async Task<GetLiveOpsUserDataByGamerTagOutput> GetLiveOpsUserDataByGamerTagAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetLiveOpsUserDataByGamerTag(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetLiveOpsUserDataByXuidOutput> GetLiveOpsUserDataByXuidAsync(ulong xuid)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetLiveOpsUserDataByXuid(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetConsoles(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            await userService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            await userService.SetIsUnderReview(xuid, isUnderReview).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetProfileSummaryOutput> GetProfileSummaryAsync(ulong xuid)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetProfileSummary(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetCreditUpdateEntriesOutput> GetCreditUpdateEntriesAsync(ulong xuid, int startIndex, int maxResults)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetCreditUpdateEntries(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetIsUnderReview(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupIdFilter, int maxResults)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetUserGroupMemberships(xuid, groupIdFilter, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AddToUserGroupsAsync(ulong xuid, int[] groupIds)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            await userService.AddToUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            await userService.RemoveFromUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetUserGroups(startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetFriendsAsync(ulong[] friendXuids)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            await userService.SetFriends(friendXuids).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserDataOutput> GetUserDataAsync()
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetUserData().ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserDatasOutput> GetUserDatasAsync(ulong[] xuids, int numberOfUsers)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.GetUserDatas(xuids, numberOfUsers).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task ReportPiracyCheckStateAsync(PiracyCheckState piracyCheckState)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            await userService.ReportPiracyCheckState(piracyCheckState).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ReportPiracyCheckStateExOutput> ReportPiracyCheckStateExAsync(
                                                                                        PiracyCheckState piracyCheckState,
                                                                                        uint dwFailedReads,
                                                                                        uint dwFailedHashes,
                                                                                        uint dwBlocksChecked,
                                                                                        uint dwTotalBlocks,
                                                                                        bool fComplete)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.ReportPiracyCheckStateEx(
                                                              piracyCheckState,
                                                              dwFailedReads,
                                                              dwFailedHashes,
                                                              dwBlocksChecked,
                                                              dwTotalBlocks,
                                                              fComplete).ConfigureAwait(false);
        }

        private async Task<UserService> PrepareUserServiceAsync()
        {
            var forzaClient = new Client(new CleartextMessageCryptoProvider(), new CleartextMessageCryptoProvider(), clientVersion: this.clientVersion);
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                                ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new UserService(forzaClient, this.environmentUri, this.adminXuid, authToken, false);
        }

        private async Task<string> GetAuthTokenAsync()
        {
            var tokenForgeryParameters = new TokenForgeryRequest
            {
                AgeGroup = "2",
                CountryCode = 103,
                DeviceId = "65535",
                DeviceRegion = "1",
                DeviceType = "WindowsOneCore",
                TitleId = this.titleId,
                TitleVersion = this.clientVersion,
                Gamertag = "UNKNOWN",
                Sandbox = this.sandbox,
                TokenLifetimeMinutes = 60,
                Xuid = this.adminXuid
            };

            var result = await this.stsClient.ForgeUserTokenAsync(tokenForgeryParameters).ConfigureAwait(false);
            this.refreshableCacheStore.PutItem(AuthTokenKey, TimeSpan.FromMinutes(55), result.Token);

            return result.Token;
        }
    }
}
