using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.BuildersCup
{
    /// <summary>
    ///     Represents car restrictions in Builders Cup Championship Series.
    /// </summary>
    public sealed class CarRestrictions
    {
        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets the car class name.
        /// </summary>
        public string CarClassName { get; set; }

        /// <summary>
        ///     Gets or sets the car class ID.
        /// </summary>
        public long CarClassId { get; set; }
    }
}
