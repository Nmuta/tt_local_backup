using System;
using Autofac;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise;
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
        protected Lazy<string> WoodstockEndpoint { get; set; }

        /// <summary>Gets (lazily) the Sunrise Endpoint passed to this call.</summary>
        protected Lazy<string> SunriseEndpoint { get; set; }

        /// <summary>Gets (lazily) the Apollo Endpoint passed to this call.</summary>
        protected Lazy<string> ApolloEndpoint { get; set; }

        /// <summary>Gets (lazily) the Steelhead Endpoint passed to this call.</summary>
        protected Lazy<string> SteelheadEndpoint { get; set; }

        // TODO: Find better way to reference services below. Ideally one that doesn't require a `.Value` on each reference call.

        /// <summary>Gets (lazily) the Steelhead services.</summary>
        protected Lazy<SteelheadProxyBundle> SteelheadServices { get; }

        /// <summary>Gets (lazily) the Woodstock services.</summary>
        protected Lazy<WoodstockProxyBundle> WoodstockServices { get; }

        /// <summary>Gets (lazily) the Woodstock services.</summary>
        protected Lazy<ApolloProxyBundle> ApolloServices { get; }

        /// <summary>Gets (lazily) the Sunrise services.</summary>
        protected Lazy<SunriseProxyBundle> SunriseServices { get; }

        protected V2ControllerBase()
        {
            this.SteelheadEndpoint = new Lazy<string>(() => this.GetSteelheadEndpoint());
            this.WoodstockEndpoint = new Lazy<string>(() => this.GetWoodstockEndpoint());
            this.SunriseEndpoint = new Lazy<string>(() => this.GetSunriseEndpoint());
            this.ApolloEndpoint = new Lazy<string>(() => this.GetApolloEndpoint());

            this.SteelheadServices = new Lazy<SteelheadProxyBundle>(() =>
            {
                var componentContext = this.HttpContext.RequestServices.GetService<IComponentContext>();
                var proxyBundle = componentContext.Resolve<SteelheadProxyBundle>();
                proxyBundle.Endpoint = this.SteelheadEndpoint.Value;
                return proxyBundle;
            });

            this.WoodstockServices = new Lazy<WoodstockProxyBundle>(() =>
            {
                var componentContext = this.HttpContext.RequestServices.GetService<IComponentContext>();
                var proxyBundle = componentContext.Resolve<WoodstockProxyBundle>();
                proxyBundle.Endpoint = this.WoodstockEndpoint.Value;
                return proxyBundle;
            });

            this.ApolloServices = new Lazy<ApolloProxyBundle>(() =>
            {
                var componentContext = this.HttpContext.RequestServices.GetService<IComponentContext>();
                var proxyBundle = componentContext.Resolve<ApolloProxyBundle>();
                proxyBundle.Endpoint = this.ApolloEndpoint.Value;
                return proxyBundle;
            });

            this.SunriseServices = new Lazy<SunriseProxyBundle>(() =>
            {
                var componentContext = this.HttpContext.RequestServices.GetService<IComponentContext>();
                var proxyBundle = componentContext.Resolve<SunriseProxyBundle>();
                proxyBundle.Endpoint = this.SunriseEndpoint.Value;
                return proxyBundle;
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
