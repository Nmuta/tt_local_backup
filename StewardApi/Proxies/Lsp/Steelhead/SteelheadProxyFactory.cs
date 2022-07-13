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
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using UserInventoryService = Forza.LiveOps.FM8.Generated.UserInventoryService;

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
        public IUserInventoryService PrepareUserInventoryService(string endpoint)
        {
            var service = new UserInventoryService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SteelheadToken, false);
            var serviceProxy = service.ProxyInterface<UserInventoryService, IUserInventoryService>();
            return serviceProxy;
        }
    }
}
