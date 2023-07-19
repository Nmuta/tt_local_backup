using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Model for a Woodstock UGC Livery.
    /// </summary>
    public class WoodstockUgcItem : UgcItem
    {
        public IEnumerable<WoodstockUgcGeoFlagOption> GeoFlags { get; set; }
    }
}
