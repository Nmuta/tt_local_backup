using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.Extensions.Configuration;
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
            WoodstockSettings settingsProvider,
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
    }
}
