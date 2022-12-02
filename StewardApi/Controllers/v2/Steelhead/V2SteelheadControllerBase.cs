using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.Services.LiveOps.FM8.Generated;
using ApolloContracts = Turn10.LiveOps.StewardApi.Contracts.Apollo;
using SteelheadContracts = Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using SunriseContracts = Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using WoodstockContracts = Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>Base class for Steelhead V2 controllers.</summary>
    public class V2SteelheadControllerBase : V2ControllerBase
    {
        /// <summary>Initializes a new instance of the <see cref="V2SteelheadControllerBase"/> class.</summary>
        protected V2SteelheadControllerBase()
        {
        }

        /// <summary>Gets the Steelhead proxy service.</summary>
        protected SteelheadProxyBundle Services => this.SteelheadServices.Value;

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
