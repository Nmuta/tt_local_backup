using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.Services.ForzaClient;
using Turn10.Services.LiveOps.FM8.Generated;
using Turn10.Services.MessageEncryption;
using AuctionManagementService = Turn10.Services.LiveOps.FM8.Generated.AuctionManagementService;
using ConfigurationManagementService = Turn10.Services.LiveOps.FM8.Generated.ConfigurationManagementService;
using GiftingManagementService = Turn10.Services.LiveOps.FM8.Generated.GiftingManagementService;
using LiveOpsService = Forza.WebServices.FM8.Generated.LiveOpsService;
using LocalizationManagementService = Turn10.Services.LiveOps.FM8.Generated.LocalizationManagementService;
using NotificationManagementService = Turn10.Services.LiveOps.FM8.Generated.NotificationsManagementService;
using PermissionsManagementService = Turn10.Services.LiveOps.FM8.Generated.PermissionsManagementService;
using StorefrontManagementService = Turn10.Services.LiveOps.FM8.Generated.StorefrontManagementService;
using UserInventoryManagementService = Turn10.Services.LiveOps.FM8.Generated.UserInventoryManagementService;
using UserManagementService = Turn10.Services.LiveOps.FM8.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead
{
    /// <inheritdoc />
    public sealed class SteelheadProxyFactory : ISteelheadProxyFactory
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadProxyFactory"/> class.
        /// </summary>
        public SteelheadProxyFactory(
            SteelheadSettings settingsProvider,
            ForgedCredentialProvider forgedCredentialProvider)
        {
            this.Settings = settingsProvider;
            this.ForgedCredentialProvider = forgedCredentialProvider;

            // TODO: This should also be injected
            this.ForzaClient = new Client(
                new CleartextMessageCryptoProvider(),
                new CleartextMessageCryptoProvider(),
                clientVersion: this.Settings.ClientVersion);
        }

        /// <summary>
        ///     Gets the steelhead settings.
        /// </summary>
        public SteelheadSettings Settings { get; }

        /// <summary>
        ///     Gets the forged credential provider.
        /// </summary>
        public ForgedCredentialProvider ForgedCredentialProvider { get; }

        private Client ForzaClient { get; }

        /// <inheritdoc/>
        public IAuctionManagementService PrepareAuctionManagementService(string endpoint)
        {
            var service = new AuctionManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<AuctionManagementService, IAuctionManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IGiftingManagementService PrepareGiftingManagementService(string endpoint)
        {
            var service = new GiftingManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<GiftingManagementService, IGiftingManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public ILiveOpsService PrepareLiveOpsService(string endpoint)
        {
            var service = new LiveOpsService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<LiveOpsService, ILiveOpsService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public ILocalizationManagementService PrepareLocalizationManagementService(string endpoint)
        {
            var service = new LocalizationManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<LocalizationManagementService, ILocalizationManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IUserManagementService PrepareUserManagementService(string endpoint)
        {
            var service = new UserManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<UserManagementService, IUserManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IUserInventoryManagementService PrepareUserInventoryManagementService(string endpoint)
        {
            var service = new UserInventoryManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<UserInventoryManagementService, IUserInventoryManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IStorefrontManagementService PrepareStorefrontManagementService(string endpoint)
        {
            var service = new StorefrontManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<StorefrontManagementService, IStorefrontManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public INotificationManagementService PrepareNotificationManagementService(string endpoint)
        {
            var service = new NotificationManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<NotificationManagementService, INotificationManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IPermissionsManagementService PreparePermissionsManagementService(string endpoint)
        {
            var service = new PermissionsManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<PermissionsManagementService, IPermissionsManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IScoreboardManagementService PrepareScoreboardManagementService(string endpoint)
        {
            var service = new ScoreboardManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<ScoreboardManagementService, IScoreboardManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IConfigurationManagementService PrepareConfigurationManagementService(string endpoint)
        {
            var service = new ConfigurationManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<ConfigurationManagementService, IConfigurationManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public ITaskManagementService PrepareTaskManagementService(string endpoint)
        {
            var service = new TaskManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<TaskManagementService, ITaskManagementService>();
            return serviceProxy;
        }
    }
}
