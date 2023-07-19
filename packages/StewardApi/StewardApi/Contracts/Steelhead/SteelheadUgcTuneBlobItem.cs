using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Model for a Steelhead Tune Blob item.
    /// </summary>
    public class SteelheadUgcTuneBlobItem : UgcTuneBlobItem
    {
        public IEnumerable<SteelheadUgcGeoFlagOption> GeoFlags { get; set; }
    }
}
