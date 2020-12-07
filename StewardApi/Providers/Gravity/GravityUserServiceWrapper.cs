﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Forza.WebServices.FMG.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using static Forza.WebServices.FMG.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <inheritdoc />
    public sealed class GravityUserServiceWrapper : IGravityUserService
    {
        private const string AuthTokenKey = "GravityServiceAuthToken";

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.GravityUri,
            ConfigurationKeyConstants.GravityClientVersion,
            ConfigurationKeyConstants.GravityAdminXuid,
            ConfigurationKeyConstants.GravitySandbox,
            ConfigurationKeyConstants.GravityTitleId
        };

        private readonly string environmentUri;
        private readonly string clientVersion;
        private readonly ulong adminXuid;
        private readonly string sandbox;
        private readonly uint titleId;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IStsClient stsClient;

        /// <summary>
        ///      Initializes a new instance of the <see cref="GravityUserServiceWrapper"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        /// <param name="refreshableCacheStore">The refreshable cache store.</param>
        /// <param name="stsClient">The STS client.</param>
        public GravityUserServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider, IRefreshableCacheStore refreshableCacheStore, IStsClient stsClient)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            stsClient.ShouldNotBeNull(nameof(stsClient));
            configuration.ShouldContainSettings(RequiredSettings);

            this.refreshableCacheStore = refreshableCacheStore;
            this.stsClient = stsClient;

            this.environmentUri = configuration[ConfigurationKeyConstants.GravityUri];
            this.clientVersion = configuration[ConfigurationKeyConstants.GravityClientVersion];
            this.adminXuid = Convert.ToUInt64(configuration[ConfigurationKeyConstants.GravityAdminXuid], CultureInfo.InvariantCulture);
            this.sandbox = configuration[ConfigurationKeyConstants.GravitySandbox];
            this.titleId = Convert.ToUInt32(configuration[ConfigurationKeyConstants.GravityTitleId], CultureInfo.InvariantCulture);
        }

        /// <inheritdoc />
        public async Task<LiveOpsGetUserDetailsByGamerTagOutput> LiveOpsGetUserDetailsByGamerTagAsync(string gamerTag, int maxResults)
        {
            gamerTag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamerTag));

            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.LiveOpsGetUserDetailsByGamerTag(gamerTag, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsGetUserDetailsByT10IdOutput> LiveOpsGetUserDetailsByT10IdAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.LiveOpsGetUserDetailsByT10Id(t10Id).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LiveOpsGetUserDetailsByXuidOutput> LiveOpsGetUserDetailsByXuidAsync(ulong xuid, int maxResults)
        {
            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.LiveOpsGetUserDetailsByXuid(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LogonOutput> LogonAsync(UserLogonData loginData)
        {
            loginData.ShouldNotBeNull(nameof(loginData));

            var userService = await this.PrepareUserServiceAsync().ConfigureAwait(false);

            return await userService.Logon(loginData).ConfigureAwait(false);
        }

        private async Task<UserService> PrepareUserServiceAsync()
        {
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                                ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new UserService(this.environmentUri, this.adminXuid, authToken, false);
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
