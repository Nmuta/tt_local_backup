using System;
using System.Threading.Tasks;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Forges credentials for use in the Castle Proxy layer.
    /// </summary>
    public class ForgedCredentialProvider : IInitializeable
    {
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IStsClient stsClient;
        private readonly SteelheadSettings steelheadSettings;
        private readonly WoodstockSettings woodstockSettings;
        private readonly SunriseSettings sunriseSettings;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ForgedCredentialProvider"/> class.
        /// </summary>
        public ForgedCredentialProvider(
            SteelheadSettings steelheadSettings,
            WoodstockSettings woodstockSettings,
            SunriseSettings sunriseSettings,
            IRefreshableCacheStore refreshableCacheStore,
            IStsClient stsClient)
        {
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            stsClient.ShouldNotBeNull(nameof(stsClient));

            this.refreshableCacheStore = refreshableCacheStore;
            this.stsClient = stsClient;
            this.steelheadSettings = steelheadSettings;
            this.woodstockSettings = woodstockSettings;
            this.sunriseSettings = sunriseSettings;
        }

        /// <summary>
        ///     Gets the Steelhead token.
        /// </summary>
        public string SteelheadToken => this.refreshableCacheStore.GetItem<string>(SteelheadCacheKey.MakeAuthTokenKey());

        /// <summary>
        ///     Gets the Woodstock token.
        /// </summary>
        public string WoodstockToken => this.refreshableCacheStore.GetItem<string>(WoodstockCacheKey.MakeAuthTokenKey());

        /// <summary>
        ///     Gets the Sunrise token.
        /// </summary>
        public string SunriseToken => this.refreshableCacheStore.GetItem<string>(SunriseCacheKey.MakeAuthTokenKey());

        /// <inheritdoc/>
        public async Task InitializeAsync()
        {
            // steelhead
            var steelheadToken = await this.ForgeCachedSteelheadAuthTokenAsync().ConfigureAwait(false);
            this.refreshableCacheStore.PutItem(
                SteelheadCacheKey.MakeAuthTokenKey(),
                TimeSpan.FromMinutes(55),
                steelheadToken,
                () => this.ForgeCachedSteelheadAuthTokenAsync().GetAwaiter().GetResult());

            // woodstock
            var woodstockToken = await this.ForgeCachedWoodstockAuthTokenAsync().ConfigureAwait(false);
            this.refreshableCacheStore.PutItem(
                WoodstockCacheKey.MakeAuthTokenKey(),
                TimeSpan.FromMinutes(55),
                woodstockToken,
                () => this.ForgeCachedWoodstockAuthTokenAsync().GetAwaiter().GetResult());

            // sunrise
            var sunriseToken = await this.ForgeCachedSunriseAuthTokenAsync().ConfigureAwait(false);
            this.refreshableCacheStore.PutItem(
                SunriseCacheKey.MakeAuthTokenKey(),
                TimeSpan.FromMinutes(55),
                woodstockToken,
                () => this.ForgeCachedWoodstockAuthTokenAsync().GetAwaiter().GetResult());
        }

        private async Task<string> ForgeCachedSteelheadAuthTokenAsync()
        {
            var tokenForgeryParameters = new TokenForgeryRequest
            {
                AgeGroup = "2",
                CountryCode = 103,
                DeviceId = "65535",
                DeviceRegion = "1",
                DeviceType = "WindowsOneCore",
                TitleId = this.steelheadSettings.TitleId,
                TitleVersion = this.steelheadSettings.ClientVersion,
                Gamertag = "UNKNOWN",
                Sandbox = this.steelheadSettings.Sandbox,
                TokenLifetimeMinutes = 60,
                Xuid = this.steelheadSettings.AdminXuid
            };

            var result = await this.stsClient.ForgeUserTokenAsync(tokenForgeryParameters).ConfigureAwait(false);
            return result.Token;
        }

        private async Task<string> ForgeCachedWoodstockAuthTokenAsync()
        {
            var tokenForgeryParameters = new TokenForgeryRequest
            {
                AgeGroup = "2",
                CountryCode = 103,
                DeviceId = "65535",
                DeviceRegion = "1",
                DeviceType = "WindowsOneCore",
                TitleId = this.woodstockSettings.TitleId,
                TitleVersion = this.woodstockSettings.ClientVersion,
                Gamertag = "UNKNOWN",
                Sandbox = this.woodstockSettings.Sandbox,
                TokenLifetimeMinutes = 60,
                Xuid = this.woodstockSettings.AdminXuid
            };

            var result = await this.stsClient.ForgeUserTokenAsync(tokenForgeryParameters).ConfigureAwait(false);
            return result.Token;
        }

        private async Task<string> ForgeCachedSunriseAuthTokenAsync()
        {
            var tokenForgeryParameters = new TokenForgeryRequest
            {
                AgeGroup = "2",
                CountryCode = 103,
                DeviceId = "65535",
                DeviceRegion = "1",
                DeviceType = "WindowsOneCore",
                TitleId = this.sunriseSettings.TitleId,
                TitleVersion = this.sunriseSettings.ClientVersion,
                Gamertag = "UNKNOWN",
                Sandbox = this.sunriseSettings.Sandbox,
                TokenLifetimeMinutes = 60,
                Xuid = this.sunriseSettings.AdminXuid
            };

            var result = await this.stsClient.ForgeUserTokenAsync(tokenForgeryParameters).ConfigureAwait(false);
            return result.Token;
        }
    }
}
