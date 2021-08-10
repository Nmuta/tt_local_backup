namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead user flags.
    /// </summary>
    public sealed class SteelheadUserFlags
    {
        /// <summary>
        ///     Gets or sets a value indicating whether the user is VIP.
        /// </summary>
        public bool IsVip { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the user is ultimate VIP.
        /// </summary>
        public bool IsUltimateVip { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the user is a Turn 10 employee.
        /// </summary>
        public bool IsTurn10Employee { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the user is early access.
        /// </summary>
        public bool IsEarlyAccess { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the user is under review.
        /// </summary>
        public bool IsUnderReview { get; set; }
    }
}
