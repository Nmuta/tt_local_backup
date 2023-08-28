namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents Steward settings for PlayFab integrations.
    /// </summary>
    public sealed class StewardPlayFabSettings
    {
        /// <summary>
        ///     Gets or sets the maximum number of allowed build locks for Woodstock.
        /// </summary>
        public int WoodstockMaxBuildLocks { get; set; }

        /// <summary>
        ///     Gets or sets the maximum number of allowed build locks for Forte.
        /// </summary>
        public int ForteMaxBuildLocks { get; set; }

        /// <summary>
        ///     Gets or sets the maximum number of allowed build locks.
        /// </summary>
        /// <remarks>TODO: Remove property once title specific properties above are populated in Prod.</remarks>
        public int MaxBuildLocks { get; set; }
    }
}
