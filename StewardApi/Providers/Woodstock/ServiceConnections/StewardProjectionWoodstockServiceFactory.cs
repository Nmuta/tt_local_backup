using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <summary>
    ///     Prepares Woodstock Service objects while targeting the "live-steward" Pegasus slot.
    /// </summary>
    public sealed class StewardProjectionWoodstockServiceFactory : WoodstockServiceFactory, IStewardProjectionWoodstockServiceFactory
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="StewardProjectionWoodstockServiceFactory"/> class.
        /// </summary>
        /// <remarks>
        ///     On LSP the cmsInstance string expects to parse environment and slot.
        ///     The deliminator between environment and slot is '-x'.
        ///     This factory targets environment: 'prod' and slot: 'live-steward'.
        /// </remarks>
        public StewardProjectionWoodstockServiceFactory(
            IConfiguration configuration,
            IKeyVaultProvider keyVaultProvider,
            IRefreshableCacheStore refreshableCacheStore,
            IStsClient stsClient)
            : base(configuration, keyVaultProvider, refreshableCacheStore, stsClient)
        {
            this.forzaClient = new Client(
                new CleartextMessageCryptoProvider(),
                new CleartextMessageCryptoProvider(),
                clientVersion: this.clientVersion,
                cmsInstance: "prod-xlive-steward");
        }
    }
}
