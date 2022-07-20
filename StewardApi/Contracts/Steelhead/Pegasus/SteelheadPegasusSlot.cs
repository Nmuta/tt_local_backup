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
        public const string Live = "live";

        /// <summary>
        ///     Gets Steelhead 'live-steward' Pegasus slot.
        /// </summary>
        public const string LiveSteward = "live-steward";
    }
}
