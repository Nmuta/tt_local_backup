using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;
using ApolloContracts = Turn10.LiveOps.StewardApi.Contracts.Apollo;
using SteelheadContracts = Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using SunriseContracts = Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using WoodstockContracts = Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock
{
    /// <summary>Base class for Woodstock V2 Controllers.</summary>
    public class V2WoodstockControllerBase : V2ControllerBase
    {
        /// <summary>Initializes a new instance of the <see cref="V2WoodstockControllerBase"/> class.</summary>
        protected V2WoodstockControllerBase()
        {
            this.WoodstockServicesWithProdLiveStewardCms = new Lazy<WoodstockProxyBundle>(() => this.ResolveWoodstockBundle("woodstockProdLiveStewardProxyBundle"));
        }

        /// <summary>Gets the Woodstock proxy service with prod live CMS slot set.</summary>
        protected WoodstockProxyBundle Services => this.WoodstockServices.Value;

        /// <summary>Gets the Woodstock proxy service with prod live-steward CMS slot set.</summary>
        protected WoodstockProxyBundle ServicesWithProdLiveStewardCms => this.WoodstockServicesWithProdLiveStewardCms.Value;

        /// <summary>Gets or sets the (lazily) the Woodstock services.</summary>
        protected Lazy<WoodstockProxyBundle> WoodstockServicesWithProdLiveStewardCms { get; set; }

        /// <summary>Ensures all provided xuids are valid, else throws error.</summary>
        [Obsolete("Use services.EnsurePlayersExistAsync(...)")]
        protected Task EnsurePlayersExist(WoodstockProxyBundle services, IList<ulong> xuids)
        {
            return services.EnsurePlayersExistAsync(xuids);
        }
    }
}
