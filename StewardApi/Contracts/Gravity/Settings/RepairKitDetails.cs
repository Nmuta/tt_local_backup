namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents repair kit details.
    /// </summary>
    public sealed class RepairKitDetails
    {
        /// <summary>
        ///     Gets or sets the repair value.
        /// </summary>
        public int RepairValue { get; set; }

        /// <summary>
        ///     Gets or sets the star rating requirement.
        /// </summary>
        public int StarRatingRequirement { get; set; }
    }
}
