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
    /// <summary>
    ///     Base class for v2 controllers.
    /// </summary>
    public class V2SunriseControllerBase : ControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="V2SunriseControllerBase"/> class.
        /// </summary>
        protected V2SunriseControllerBase()
        {
            this.SunriseEndpoint = new Lazy<string>(() => this.GetSunriseEndpoint());

            this.SunriseServices = new Lazy<SunriseProxyBundle>(() =>
            {
                var componentContext = this.HttpContext.RequestServices.GetService<IComponentContext>();
                var proxyBundle = componentContext.Resolve<SunriseProxyBundle>();
                proxyBundle.Endpoint = this.SunriseEndpoint.Value;
                return proxyBundle;
            });
        }

        /// <summary>
        ///     Gets the Sunrise proxy service.
        /// </summary>
        protected SunriseProxyBundle Services
        {
            get { return this.SunriseServices.Value; }
        }

        /// <summary>Gets (lazily) the Sunrise Endpoint passed to this call.</summary>
        protected Lazy<string> SunriseEndpoint { get; }

        /// <summary>Gets (lazily) the Sunrise services.</summary>
        private Lazy<SunriseProxyBundle> SunriseServices { get; }

        private string GetSunriseEndpoint()
        {
            if (!this.Request.Headers.TryGetValue("Endpoint-Sunrise", out var key))
            {
                key = SunriseContracts.SunriseEndpoint.V2Default;
            }

            return SunriseContracts.SunriseEndpoint.GetEndpoint(key);
        }
    }
}
