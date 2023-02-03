using System;

#pragma warning disable SA1600 // Elements should be documented
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents PlayFab Build Lock request data.
    /// </summary>
    public class PlayFabBuildLockRequest
    {
        public string Reason { get; set; }

        public bool IsLocked { get; set; }
    }
}
