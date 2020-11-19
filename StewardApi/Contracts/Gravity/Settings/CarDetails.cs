using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents car details.
    /// </summary>
    public sealed class CarDetails
    {
        /// <summary>
        ///     Gets or sets the car ID.
        /// </summary>
        public int CarId { get; set; }

        /// <summary>
        ///     Gets or sets the car class.
        /// </summary>
        public string CarClass { get; set; }

        /// <summary>
        ///     Gets or sets the car name.
        /// </summary>
        public string CarName { get; set; }

        /// <summary>
        ///     Gets or sets the manufacturer ID.
        /// </summary>
        public int ManufacturerId { get; set; }

        /// <summary>
        ///     Gets or sets the release year.
        /// </summary>
        public int ReleaseYear { get; set; }

        /// <summary>
        ///     Gets or sets the model ID.
        /// </summary>
        public int ModelId { get; set; }

        /// <summary>
        ///     Gets or sets the country ID.
        /// </summary>
        public int CountryId { get; set; }

        /// <summary>
        ///     Gets or sets the min performance index.
        /// </summary>
        public int MinPerformanceIndex { get; set; }

        /// <summary>
        ///     Gets or sets the max performance index.
        /// </summary>
        public int MaxPerformanceIndex { get; set; }

        /// <summary>
        ///     Gets or sets the max condition pips.
        /// </summary>
        public int MaxConditionPips { get; set; }

        /// <summary>
        ///     Gets or sets the star rating.
        /// </summary>
        public int StarRating { get; set; }

        /// <summary>
        ///     Gets or sets the star ranks.
        /// </summary>
        public IList<StarRank> StarRanks { get; set; }

        /// <summary>
        ///     Gets or sets the duplicate rewards package.
        /// </summary>
        public Guid DuplicateRewardsPackage { get; set; }

        /// <summary>
        ///     Gets or sets the era.
        /// </summary>
        public string Era { get; set; }

        /// <summary>
        ///     Gets or sets the grade.
        /// </summary>
        public string Grade { get; set; }

        /// <summary>
        ///     Gets or sets the transition car ID.
        /// </summary>
        public int TransitionCarId { get; set; }
    }
}
