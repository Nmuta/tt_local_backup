using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Model for a Woodstock UGC Prop Prefab.
    /// </summary>
    public class WoodstockUgcProPrefabItem : WoodstockUgcItem
    {
        public byte[] PropPrefabDownloadDataBase64 { get; set; }
    }
}
