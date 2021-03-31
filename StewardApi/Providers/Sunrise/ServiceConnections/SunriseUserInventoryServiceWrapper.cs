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
using static Forza.WebServices.FH4.master.Generated.UserInventoryService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunriseUserInventoryServiceWrapper : ISunriseUserInventoryService
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
        ///      Initializes a new instance of the <see cref="SunriseUserInventoryServiceWrapper"/> class.
        /// </summary>
        public SunriseUserInventoryServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider, IRefreshableCacheStore refreshableCacheStore, IStsClient stsClient)
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

        /// <inheritdoc />
        public async Task<SyncUserInventoryOutput> SyncUserInventoryAsync(ForzaUserInventorySummary clientInventory)
        {
            clientInventory.ShouldNotBeNull(nameof(clientInventory));

            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userInventoryService.SyncUserInventory(clientInventory).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles)
        {
            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userInventoryService.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid)
        {
            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userInventoryService.GetAdminUserInventory(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId)
        {
            var userInventoryService = await this.PrepareUserInventoryServiceAsync().ConfigureAwait(false);

            return await userInventoryService.GetAdminUserInventoryByProfileId(profileId).ConfigureAwait(false);
        }

        private async Task<UserInventoryService> PrepareUserInventoryServiceAsync()
        {
            var forzaClient = new Client(new CleartextMessageCryptoProvider(), new CleartextMessageCryptoProvider(), clientVersion: this.clientVersion);
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                                ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new UserInventoryService(forzaClient, this.environmentUri, this.adminXuid, authToken, false);
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
