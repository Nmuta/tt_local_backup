namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Pegasus slot for use by Steelhead Pegasus Service.
    /// </summary>
    public sealed class SteelheadPegasusSlot
    {
        /// <summary>
        ///     Gets Steelhead 'live' Pegasus slot.
        /// </summary>
        /// <remarks>Slot typically used by Steward, represents data for cars in live game.</remarks>
        public const string Live = "live";

        /// <summary>
        ///     Gets Steelhead 'live-steward' Pegasus slot.
        /// </summary>
        /// /// <remarks>
        ///     Similar to live slot, but has increased release version for items.
        ///     A 'preview' of what will be in the game soon.
        /// </remarks>
        public const string LiveSteward = "live-steward";

        /// <summary>
        ///     Gets Steelhead 'daily' Pegasus slot.
        /// </summary>
        /// <remarks>
        ///     This should only be used in for testing and development purposes.
        /// </remarks>
        public const string Daily = "daily";
    }
}
