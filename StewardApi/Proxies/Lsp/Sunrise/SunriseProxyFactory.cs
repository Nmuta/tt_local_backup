using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Forza.LiveOps.FH4.Generated;
using Forza.WebServices.FH4.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Contracts.STS;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise.Services;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise
{
    /// <inheritdoc />
    public class SunriseProxyFactory : ISunriseProxyFactory
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseProxyFactory"/> class.
        /// </summary>
        public SunriseProxyFactory(
            SunriseSettings settingsProvider,
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
        ///     Gets the sunrise settings.
        /// </summary>
        public SunriseSettings Settings { get; }

        /// <summary>
        ///     Gets the forged credential provider.
        /// </summary>
        public ForgedCredentialProvider ForgedCredentialProvider { get; }

        private Client ForzaClient { get; }

        /// <inheritdoc/>
        public IUserService PrepareUserService(string endpoint)
        {
            var service = new UserService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SunriseToken, false);
            var serviceProxy = service.ProxyInterface<UserService, IUserService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IUserManagementService PrepareUserManagementService(string endpoint)
        {
            var service = new UserManagementService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SunriseToken, false);
            var serviceProxy = service.ProxyInterface<UserManagementService, IUserManagementService>();
            return serviceProxy;
        }

        /// <inheritdoc/>
        public IStorefrontService PrepareStorefrontService(string endpoint)
        {
            var service = new StorefrontService(this.ForzaClient, endpoint, this.Settings.AdminXuid, this.ForgedCredentialProvider.SunriseToken, false);
            var serviceProxy = service.ProxyInterface<StorefrontService, IStorefrontService>();
            return serviceProxy;
        }
    }
}
