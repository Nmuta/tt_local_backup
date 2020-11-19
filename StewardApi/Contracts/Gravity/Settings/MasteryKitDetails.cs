namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents the mastery kit details.
    /// </summary>
    public sealed class MasteryKitDetails
    {
        /// <summary>
        ///     Gets or sets the car class.
        /// </summary>
        public string CarClass { get; set; }

        /// <summary>
        ///     Gets or sets the class bonus value.
        /// </summary>
        public int ClassBonusValue { get; set; }

        /// <summary>
        ///     Gets or sets the currency modifier.
        /// </summary>
        public double CurrencyModifier { get; set; }

        /// <summary>
        ///     Gets or sets the currency ID.
        /// </summary>
        public int CurrencyId { get; set; }

        /// <summary>
        ///     Gets or sets the value.
        /// </summary>
        public int Value { get; set; }
    }
}
