using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using ApolloContracts = Turn10.LiveOps.StewardApi.Contracts.Apollo;
using SteelheadContracts = Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using SunriseContracts = Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using WoodstockContracts = Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers.V2
{
    /// <summary>
    ///     Base class for v2 controllers.
    /// </summary>
    public class V2ControllerBase : ControllerBase
    {
        /// <summary>Gets (lazily) the Woodstock Endpoint passed to this call.</summary>
        protected Lazy<string> WoodstockEndpoint { get; }

        /// <summary>Gets (lazily) the Sunrise Endpoint passed to this call.</summary>
        protected Lazy<string> SunriseEndpoint { get; }

        /// <summary>Gets (lazily) the Apollo Endpoint passed to this call.</summary>
        protected Lazy<string> ApolloEndpoint { get; }

        /// <summary>Gets (lazily) the Steelhead Endpoint passed to this call.</summary>
        protected Lazy<string> SteelheadEndpoint { get; }

        // TODO: Find better way to reference services below. Ideally one that doesn't require a `.Value` on each reference call.

        /// <summary>Gets (lazily) the Steelhead services.</summary>
        protected Lazy<SteelheadProxyBundle> SteelheadServices { get; }

        /// <summary>Gets (lazily) the Woodstock services.</summary>
        protected Lazy<WoodstockProxyBundle> WoodstockServices { get; }

        protected V2ControllerBase()
        {
            this.SteelheadEndpoint = new Lazy<string>(() => this.GetSteelheadEndpoint());
            this.WoodstockEndpoint = new Lazy<string>(() => this.GetWoodstockEndpoint());
            this.SunriseEndpoint = new Lazy<string>(() => this.GetSunriseEndpoint());
            this.ApolloEndpoint = new Lazy<string>(() => this.GetApolloEndpoint());

            this.SteelheadServices = new Lazy<SteelheadProxyBundle>(() =>
            {
                var steelheadProxyBundle = this.HttpContext.RequestServices.GetService<SteelheadProxyBundle>();
                steelheadProxyBundle.Endpoint = this.SteelheadEndpoint.Value;
                return steelheadProxyBundle;
            });

            this.WoodstockServices = new Lazy<WoodstockProxyBundle>(() =>
            {
                var woodstockProxyBundle = this.HttpContext.RequestServices.GetService<WoodstockProxyBundle>();
                woodstockProxyBundle.Endpoint = this.WoodstockEndpoint.Value;
                return woodstockProxyBundle;
            });
        }

        private string GetWoodstockEndpoint()
        {
            if (!this.Request.Headers.TryGetValue("Endpoint-Woodstock", out var key))
            {
                key = WoodstockContracts.WoodstockEndpoint.V2Default;
            }

            return WoodstockContracts.WoodstockEndpoint.GetEndpoint(key);
        }

        private string GetSunriseEndpoint()
        {
            if (!this.Request.Headers.TryGetValue("Endpoint-Sunrise", out var key))
            {
                key = SunriseContracts.SunriseEndpoint.V2Default;
            }

            return SunriseContracts.SunriseEndpoint.GetEndpoint(key);
        }

        private string GetApolloEndpoint()
        {
            if (!this.Request.Headers.TryGetValue("Endpoint-Apollo", out var key))
            {
                key = ApolloContracts.ApolloEndpoint.V2Default;
            }

            return ApolloContracts.ApolloEndpoint.GetEndpoint(key);
        }

        private string GetSteelheadEndpoint()
        {
            if (!this.Request.Headers.TryGetValue("Endpoint-Steelhead", out var key))
            {
                key = SteelheadContracts.SteelheadEndpoint.V2Default;
            }

            return SteelheadContracts.SteelheadEndpoint.GetEndpoint(key);
        }
    }
}
