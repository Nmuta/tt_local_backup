using System;
using Microsoft.AspNetCore.Mvc;

using ApolloContracts = Turn10.LiveOps.StewardApi.Contracts.Apollo;
using SteelheadContracts = Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using SunriseContracts = Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using WoodstockContracts = Turn10.LiveOps.StewardApi.Contracts.Woodstock;

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
