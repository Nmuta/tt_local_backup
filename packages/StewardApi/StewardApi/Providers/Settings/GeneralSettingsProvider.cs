using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Forte;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Providers.Settings
{
    /// <inheritdoc/>
    public class GeneralSettingsProvider : IGeneralSettingsProvider
    {
        /// <inheritdoc/>
        public TitleEndpoints GetLspEndpoints()
        {
            return new TitleEndpoints
            {
                Apollo = typeof(ApolloEndpoint).GetProperties()
                   .Where(p => p.GetValue(p.Name) != null).Select(p => new LspEndpoint(p.Name)).OrderBy(p => this.MapEndpointPriority(p.Name)),
                Sunrise = typeof(SunriseEndpoint).GetProperties()
                   .Where(p => p.GetValue(p.Name) != null).Select(p => new LspEndpoint(p.Name)).OrderBy(p => this.MapEndpointPriority(p.Name)),
                Woodstock = typeof(WoodstockEndpoint).GetProperties()
                   .Where(p => p.GetValue(p.Name) != null).Select(p => new LspEndpoint(p.Name)).OrderBy(p => this.MapEndpointPriority(p.Name)),
                Steelhead = typeof(SteelheadEndpoint).GetProperties()
                   .Where(p => p.GetValue(p.Name) != null).Select(p => new LspEndpoint(p.Name)).OrderBy(p => this.MapEndpointPriority(p.Name)),
                Forte = typeof(ForteEndpoint).GetProperties()
                   .Where(p => p.GetValue(p.Name) != null).Select(p => new LspEndpoint(p.Name)).OrderBy(p => this.MapEndpointPriority(p.Name)),
                Forum = new List<LspEndpoint>() { new LspEndpoint("Retail") },
            };
        }

        /// <summary>
        ///     Determines priority of endpoints returned to client.
        ///     Priority goes lowest to highest with Retail always first (1)
        /// </summary>
        private int MapEndpointPriority(string priority)
        {
            switch (priority.ToUpperInvariant())
            {
                case "RETAIL":
                    return 1;
                case "STUDIO":
                    return 2;
                case "FLIGHT":
                    return 3;
                default:
                    return int.MaxValue;
            }
        }
    }
}
