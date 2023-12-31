﻿using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Model for a Woodstock UGC Livery.
    /// </summary>
    public class WoodstockUgcLiveryItem : UgcLiveryItem
    {
        [JsonProperty(ItemConverterType = typeof(StringEnumConverter))]
        public IEnumerable<WoodstockUgcGeoFlagOption> GeoFlags { get; set; }
    }
}
