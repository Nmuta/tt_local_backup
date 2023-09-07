using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;

#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.Forte
{
    /// <summary>
    ///     Config for Woodstock PlayFab.
    /// </summary>
    public class FortePlayFabConfig
    {
        public Dictionary<FortePlayFabEnvironment, PlayFabConfig> Environments { get; } = new Dictionary<FortePlayFabEnvironment, PlayFabConfig>();
    }
}
