using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;

#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Config for Woodstock PlayFab.
    /// </summary>
    public class WoodstockPlayFabConfig
    {
        public Dictionary<WoodstockPlayFabEnvironment, PlayFabConfig> Environments { get; } = new Dictionary<WoodstockPlayFabEnvironment, PlayFabConfig>();
    }
}
