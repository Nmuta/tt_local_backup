namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents Steward settings for PlayFab integrations.
    /// </summary>
    public sealed class StewardPlayFabSettings
    {
        /// <summary>
        ///     Gets or sets the maximum number of allowed build locks.
        /// </summary>
        public int MaxBuildLocks { get; set; }
    }
}
