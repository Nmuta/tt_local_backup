using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using SteelheadContracts = Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>Base class for Steelhead V2 controllers.</summary>
    public class V2SteelheadControllerBase : V2ControllerBase
    {
        /// <summary>Initializes a new instance of the <see cref="V2SteelheadControllerBase"/> class.</summary>
        protected V2SteelheadControllerBase()
        {
            this.SteelheadServicesWithProdLiveStewardCms = new Lazy<SteelheadProxyBundle>(() => this.ResolveSteelheadBundle("steelheadProdLiveStewardProxyBundle"));
            this.SteelheadServicesWithDevLiveStewardCms = new Lazy<SteelheadProxyBundle>(() => this.ResolveSteelheadBundle("steelheadDevLiveStewardProxyBundle"));
        }

        /// <summary>Gets the Steelhead proxy service.</summary>
        protected SteelheadProxyBundle Services
        {
            get
            {
                // Default to prod live-steward cms override unless provided endpoint points to studio
                var endpoint = this.SteelheadEndpoint.Value;
                if (endpoint == SteelheadContracts.SteelheadEndpoint.Studio)
                {
                    return this.SteelheadServicesWithDevLiveStewardCms.Value;
                }

                return this.SteelheadServicesWithProdLiveStewardCms.Value;
            }
        }

        /// <summary>Gets or sets the (lazily) the Steelhead services with prod live-steward cms override.</summary>
        protected Lazy<SteelheadProxyBundle> SteelheadServicesWithProdLiveStewardCms { get; set; }

        /// <summary>Gets or sets the (lazily) the Steelhead services  with dev live-steward cms override.</summary>
        protected Lazy<SteelheadProxyBundle> SteelheadServicesWithDevLiveStewardCms { get; set; }

        /// <summary>Ensures all provided xuids are valid, else throws error.</summary>
        [Obsolete("Use services.EnsurePlayersExistAsync(...)")]
        protected Task EnsurePlayersExist(SteelheadProxyBundle services, IList<ulong> xuids)
        {
            return services.EnsurePlayersExistAsync(xuids);
        }

        /// <summary>Ensures provided xuid is valid, else throws error.</summary>
        [Obsolete("Use services.EnsurePlayerExistAsync(...)")]
        protected Task EnsurePlayerExist(SteelheadProxyBundle services, ulong xuid)
        {
            return services.EnsurePlayersExistAsync(new List<ulong>() { xuid });
        }
    }
}
