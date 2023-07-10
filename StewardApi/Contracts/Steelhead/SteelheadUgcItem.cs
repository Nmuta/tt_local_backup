using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Model for a Steelhead UGC Livery.
    /// </summary>
    public class SteelheadUgcItem : UgcItem
    {
        public IEnumerable<WoodstockUgcGeoFlagOption> GeoFlags { get; set; }
    }
}
