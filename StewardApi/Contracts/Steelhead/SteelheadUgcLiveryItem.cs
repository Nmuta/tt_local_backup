using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Model for a Steelhead UGC Livery.
    /// </summary>
    public class SteelheadUgcLiveryItem : UgcLiveryItem
    {
        [JsonProperty(ItemConverterType=typeof(StringEnumConverter))]
        public IEnumerable<WoodstockUgcGeoFlagOption> GeoFlags { get; set; }
    }
}
