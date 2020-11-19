namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents the energy refill details.
    /// </summary>
    public sealed class EnergyRefillDetails
    {
        /// <summary>
        ///     Gets or sets a value indicating whether is full.
        /// </summary>
        public bool IsFull { get; set; }

        /// <summary>
        ///     Gets or sets the partial value.
        /// </summary>
        public int PartialValue { get; set; }
    }
}
