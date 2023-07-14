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
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise;
using SunriseContracts = Turn10.LiveOps.StewardApi.Contracts.Sunrise;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Sunrise
{
    /// <summary>Base class for Sunrise V2 controllers.</summary>
    public class V2SunriseControllerBase : V2ControllerBase
    {
        /// <summary>Initializes a new instance of the <see cref="V2SunriseControllerBase"/> class.</summary>
        protected V2SunriseControllerBase()
        {
        }

        /// <summary>Gets the Sunrise proxy service.</summary>
        protected SunriseProxyBundle Services => this.SunriseServices.Value;
    }
}
