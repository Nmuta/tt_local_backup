using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <summary>
    ///     Prepares Woodstock Service objects while targeting the "live" Pegasus slot.
    /// </summary>
    public sealed class LiveProjectionWoodstockServiceFactory : WoodstockServiceFactory, ILiveProjectionWoodstockServiceFactory
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="LiveProjectionWoodstockServiceFactory"/> class.
        /// </summary>
        public LiveProjectionWoodstockServiceFactory(
            IConfiguration configuration,
            IKeyVaultProvider keyVaultProvider,
            IRefreshableCacheStore refreshableCacheStore,
            IStsClient stsClient)
            : base(configuration, keyVaultProvider, refreshableCacheStore, stsClient)
        {
            this.forzaClient = new Client(
                new CleartextMessageCryptoProvider(),
                new CleartextMessageCryptoProvider(),
                clientVersion: this.clientVersion);
        }
    }
}
