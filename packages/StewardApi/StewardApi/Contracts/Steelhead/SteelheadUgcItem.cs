using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Model for a Steelhead UGC Livery.
    /// </summary>
    public class SteelheadUgcItem : UgcItem
    {
        public IEnumerable<SteelheadUgcGeoFlagOption> GeoFlags { get; set; }
    }
}
