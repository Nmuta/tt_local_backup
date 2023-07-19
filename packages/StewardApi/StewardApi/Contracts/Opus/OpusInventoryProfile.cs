namespace Turn10.LiveOps.StewardApi.Contracts.Opus
{
    /// <summary>
    ///     Represents an Opus inventory profile.
    /// </summary>
    public class OpusInventoryProfile
    {
        /// <summary>
        ///     Gets or sets the profile ID.
        /// </summary>
        public int ProfileId { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether profile is current.
        /// </summary>
        public bool IsCurrent { get; set; }
    }
}
