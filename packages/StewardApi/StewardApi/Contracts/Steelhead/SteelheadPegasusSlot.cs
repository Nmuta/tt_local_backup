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
        ///     Gets Steelhead 'daily' Pegasus slot.
        /// </summary>
        /// <remarks>
        ///     This should only be used in for testing and development purposes.
        /// </remarks>
        public const string Daily = "daily";
    }
}
