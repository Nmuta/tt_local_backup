using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using Xls.WebServices.FH4.master.Generated;
using static Xls.WebServices.FH4.master.Generated.NotificationsService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public class SunriseNotificationsServiceWrapper : ISunriseNotificationsService
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
        ///      Initializes a new instance of the <see cref="SunriseNotificationsServiceWrapper"/> class.
        /// </summary>
        public SunriseNotificationsServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider, IRefreshableCacheStore refreshableCacheStore, IStsClient stsClient)
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
        public async Task<LiveOpsRetrieveForUserOutput> LiveOpsRetrieveForUserAsync(ulong xuid, int maxResults)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            return await notificationsService.LiveOpsRetrieveForUser(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task ClearAsync(Guid notificationId)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            await notificationsService.Clear(notificationId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetCategoriesOutput> GetCategoriesAsync(int maxResults)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            return await notificationsService.GetCategories(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetCategoriesForWebOutput> GetCategoriesForWebAsync(string cultureCode)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            return await notificationsService.GetCategoriesForWeb(cultureCode).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task MarkReadAsync(Guid notificationId)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            await notificationsService.MarkRead(notificationId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<RetrieveForUserOutput> RetrieveForUserAsync(short nonce, int maxResults, int parameterBlockSize)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            return await notificationsService.RetrieveForUser(nonce, maxResults, parameterBlockSize).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task StartNewSessionAsync()
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            await notificationsService.StartNewSession().ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SendMessageNotificationAsync(ulong xuid, string message, DateTime expireTimeUtc)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            await notificationsService.SendMessageNotification(xuid, message, expireTimeUtc).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SendGroupMessageNotificationAsync(int groupId, string message, DateTime expireTimeUtc)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            await notificationsService.SendGroupMessageNotification(groupId, message, expireTimeUtc).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<SendMessageNotificationToMultipleUsersOutput> SendMessageNotificationToMultipleUsersAsync(IList<ulong> xuids, string message, DateTime expireTimeUtc)
        {
            var notificationsService = await this.PrepareNotificationsServiceAsync().ConfigureAwait(false);

            return await notificationsService.SendMessageNotificationToMultipleUsers(xuids.ToArray(), xuids.Count, message, expireTimeUtc).ConfigureAwait(false);
        }

        private async Task<NotificationsService> PrepareNotificationsServiceAsync()
        {
            var forzaClient = new Client(new CleartextMessageCryptoProvider(), new CleartextMessageCryptoProvider(), clientVersion: this.clientVersion);
            var authToken = this.refreshableCacheStore.GetItem<string>(AuthTokenKey)
                            ?? await this.GetAuthTokenAsync().ConfigureAwait(false);

            return new NotificationsService(forzaClient, this.environmentUri, this.adminXuid, authToken, false);
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
