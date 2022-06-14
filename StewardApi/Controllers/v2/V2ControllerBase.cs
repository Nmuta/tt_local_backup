using System;
using Microsoft.AspNetCore.Mvc;

namespace Turn10.LiveOps.StewardApi.Controllers.v2
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

        protected V2ControllerBase()
        {
            this.WoodstockEndpoint = new Lazy<string>(() => this.GetWoodstockEndpoint());
            this.SunriseEndpoint = new Lazy<string>(() => this.GetSunriseEndpoint());
            this.ApolloEndpoint = new Lazy<string>(() => this.GetApolloEndpoint());
            this.SteelheadEndpoint = new Lazy<string>(() => this.GetSteelheadEndpoint());
        }

        private string GetWoodstockEndpoint()
        {
            const string DefaultEndpointKey = "Retail";
            if (!this.Request.Headers.TryGetValue("Endpoint-Woodstock", out var key))
            {
                key = DefaultEndpointKey;
            }

            return Contracts.Woodstock.WoodstockEndpoint.GetEndpoint(key);
        }

        private string GetSunriseEndpoint()
        {
            const string DefaultEndpointKey = "Retail";
            if (!this.Request.Headers.TryGetValue("Endpoint-Sunrise", out var key))
            {
                key = DefaultEndpointKey;
            }

            return Turn10.LiveOps.StewardApi.Contracts.Sunrise.SunriseEndpoint.GetEndpoint(key);
        }

        private string GetApolloEndpoint()
        {
            const string DefaultEndpointKey = "Retail";
            if (!this.Request.Headers.TryGetValue("Endpoint-Apollo", out var key))
            {
                key = DefaultEndpointKey;
            }

            return Turn10.LiveOps.StewardApi.Contracts.Apollo.ApolloEndpoint.GetEndpoint(key);
        }

        private string GetSteelheadEndpoint()
        {
            const string DefaultEndpointKey = "Retail";
            if (!this.Request.Headers.TryGetValue("Endpoint-Steelhead", out var key))
            {
                key = DefaultEndpointKey;
            }

            return Turn10.LiveOps.StewardApi.Contracts.Steelhead.SteelheadEndpoint.GetEndpoint(key);
        }
    }
}
