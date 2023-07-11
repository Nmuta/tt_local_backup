using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Autofac;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.Extensions.Configuration;
using Microsoft.OpenApi.Writers;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services;
using Turn10.Services.ForzaClient;
using Turn10.Services.LiveOps.FH5_main.Generated;
using Turn10.Services.MessageEncryption;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;
using ConfigurationManagementService = Turn10.Services.LiveOps.FH5_main.Generated.ConfigurationManagementService;
using UserInventoryManagementService = Turn10.Services.LiveOps.FH5_main.Generated.UserInventoryManagementService;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock
{
    /// <inheritdoc />
    public class WoodstockProxyFactory : IWoodstockProxyFactory
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockProxyFactory"/> class.
        /// </summary>
        public WoodstockProxyFactory(
            Client client,
            WoodstockSettings settingsProvider,
            ForgedCredentialProvider forgedCredentialProvider)
        {
            this.Settings = settingsProvider;
            this.ForgedCredentialProvider = forgedCredentialProvider;

            // TODO: This should also be injected
            this.ForzaClient = client;
        }

        /// <summary>
        ///     Gets the woodstock settings.
        /// </summary>
        public WoodstockSettings Settings { get; }

        /// <summary>
        ///     Gets the forged credential provider.
        /// </summary>
        public ForgedCredentialProvider ForgedCredentialProvider { get; }

        private Client ForzaClient { get; }

        /// <inheritdoc/>
        public ILiveOpsService PrepareLiveOpsService(string endpoint)
        {
            var service = new LiveOpsService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.WoodstockToken, false);
            var serviceProxy = service.ProxyInterface<LiveOpsService, ILiveOpsService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IUserInventoryManagementService PrepareUserInventoryManagementService(string endpoint)
        {
            var service = new UserInventoryManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.WoodstockToken, false);
            var serviceProxy = service.ProxyInterface<UserInventoryManagementService, IUserInventoryManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IUserManagementService PrepareUserManagementService(string endpoint)
        {
            var service = new UserManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.WoodstockToken, false);
            var serviceProxy = service.ProxyInterface<UserManagementService, IUserManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IPermissionsManagementService PreparePermissionsManagementService(string endpoint)
        {
            var service = new PermissionsManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.WoodstockToken, false);
            var serviceProxy = service.ProxyInterface<PermissionsManagementService, IPermissionsManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IStorefrontManagementService PrepareStorefrontManagementService(string endpoint)
        {
            var service = new StorefrontManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.WoodstockToken, false);
            var serviceProxy = service.ProxyInterface<StorefrontManagementService, IStorefrontManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IGiftingManagementService PrepareGiftingManagementService(string endpoint)
        {
            var service = new GiftingManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.WoodstockToken, false);
            var serviceProxy = service.ProxyInterface<GiftingManagementService, IGiftingManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IRareCarShopService PrepareRareCarShopService(string endpoint)
        {
            var service = new RareCarShopService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.WoodstockToken, false);
            var serviceProxy = service.ProxyInterface<RareCarShopService, IRareCarShopService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public INotificationsManagementService PrepareNotificationsManagementService(string endpoint)
        {
            var service = new NotificationsManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.WoodstockToken, false);
            var serviceProxy = service.ProxyInterface<NotificationsManagementService, INotificationsManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IAuctionManagementService PrepareAuctionManagementService(string endpoint)
        {
            var service = new AuctionManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.WoodstockToken, false);
            var serviceProxy = service.ProxyInterface<AuctionManagementService, IAuctionManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IConfigurationManagementService PrepareConfigurationManagementService(string endpoint)
        {
            var service = new ConfigurationManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.WoodstockToken, false);
            var serviceProxy = service.ProxyInterface<ConfigurationManagementService, IConfigurationManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IScoreboardManagementService PrepareScoreboardManagementService(string endpoint)
        {
            var service = new ScoreboardManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.WoodstockToken, false);
            var serviceProxy = service.ProxyInterface<ScoreboardManagementService, IScoreboardManagementService>();
            return serviceProxy;
        }
    }
}
