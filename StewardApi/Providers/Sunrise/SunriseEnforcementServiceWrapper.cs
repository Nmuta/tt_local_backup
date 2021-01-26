using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Forza.WebServices.FH4.master.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using Xls.FH4.master.Generated;
using static Forza.WebServices.FH4.master.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc/>
    public sealed class SunriseEnforcementServiceWrapper : ISunriseEnforcementService
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
        ///      Initializes a new instance of the <see cref="SunriseEnforcementServiceWrapper"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        /// <param name="refreshableCacheStore">The refreshable cache store.</param>
        /// <param name="stsClient">The STS client.</param>
        public SunriseEnforcementServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider, IRefreshableCacheStore refreshableCacheStore, IStsClient stsClient)
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
        public async Task<GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids, int xuidCount)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.GetUserBanSummaries(xuids, xuidCount).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<BanUsersOutput> BanUsersAsync(ulong[] xuids, int xuidCount, ForzaUserBanParameters banParameters)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.BanUsers(xuids, xuidCount, banParameters).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.GetUserBanHistory(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<CheckUserForMPBanOutput> CheckUserForMPBanAsync(ulong xuid)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.CheckUserForMPBan(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetCompareStatsByBucketOutput> GetCompareStatsByBucketAsync(int bucketId, int numUsers, ulong[] xuids)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.GetCompareStatsByBucket(bucketId, numUsers, xuids).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetCompareStatsForRelatedUsersOutput> GetCompareStatsForRelatedUsersAsync(int numDesiredUsers)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.GetCompareStatsForRelatedUsers(numDesiredUsers).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetLegacyLicensePlateOutput> GetLegacyLicensePlateAsync()
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.GetLegacyLicensePlate().ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetPermissionsTableOutput> GetPermissionsTableAsync(uint maxPermissions)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.GetPermissionsTable(maxPermissions).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetTreatmentOutput> GetTreatmentAsync()
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.GetTreatment().ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetVipStateOutput> GetVipStateAsync()
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.GetVipState().ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<LogonOutput> LogonAsync(UserLogonData loginData)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.Logon(loginData).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<IncludeEncryptionKey> RenegotiateAsync()
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.Renegotiate().ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task ReportPlayerForLicensePlateAsync(ulong xuid, string currentLicensePlate)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            await enforcementService.ReportPlayerForLicensePlate(xuid, currentLicensePlate).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<RetrieveOnlineCreditsOutput> RetrieveOnlineCreditsAsync(bool unused)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            return await enforcementService.RetrieveOnlineCredits(unused).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetPlayerCardInfoAsync(
                                            uint currentCareerLevel,
                                            ushort currentBadgeId,
                                            ushort currentPlayerTitleId,
                                            int driverModelId,
                                            ushort painterThreadLevel,
                                            ushort tunerThreadLevel,
                                            ushort photoThreadLevel,
                                            ushort blueprintThreadLevel,
                                            short[] customizationSlots,
                                            bool isClubIdKnown,
                                            string clubId,
                                            bool isTeamIdKnown,
                                            string teamId,
                                            string licensePlate)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            await enforcementService.SetPlayerCardInfo(
                                                       currentCareerLevel,
                                                       currentBadgeId,
                                                       currentPlayerTitleId,
                                                       driverModelId,
                                                       painterThreadLevel,
                                                       tunerThreadLevel,
                                                       photoThreadLevel,
                                                       blueprintThreadLevel,
                                                       customizationSlots,
                                                       isClubIdKnown,
                                                       clubId,
                                                       isTeamIdKnown,
                                                       teamId,
                                                       licensePlate).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetPlayerFlagsAsync(ulong xuid, ForzaUserFlags userFlags)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            await enforcementService.SetPlayerFlags(xuid, userFlags).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetVipStateAsync(bool isVip, bool isUltimateVip)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            await enforcementService.SetVipState(isVip, isUltimateVip).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetWebPrivacyForPlayerAsync(bool isWebProfilePrivate)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            await enforcementService.SetWebPrivacyForPlayer(isWebProfilePrivate).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task UpdateProfileCheckpointAsync(UserProfileCheckpoint clientProfile, int titleVersion)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            await enforcementService.UpdateProfileCheckpoint(clientProfile, titleVersion).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task ValidateProfileCheckpointAsync(UserProfileCheckpoint clientProfile, int titleVersion)
        {
            var enforcementService = await this.PrepareEnforcementServiceAsync().ConfigureAwait(false);

            await enforcementService.ValidateProfileCheckpoint(clientProfile, titleVersion).ConfigureAwait(false);
        }

        private async Task<UserService> PrepareEnforcementServiceAsync()
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
