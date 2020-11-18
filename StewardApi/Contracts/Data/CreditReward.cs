namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a credit reward.
    /// </summary>
    public sealed class CreditReward
    {
        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        ///     Gets or sets the amount.
        /// </summary>
        public long Amount { get; set; }

        /// <summary>
        ///     Gets or sets the rarity.
        /// </summary>
        public string Rarity { get; set; }
    }
}
