using System;
using System.Collections;
using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.BuildersCup
{
    /// <summary>
    ///     Represents the series inside the Builder's Cup Tours.
    /// </summary>
    public sealed class BuildersCupChampionshipSeries
    {
        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets the description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        ///     Gets or sets the open time.
        /// </summary>
        public DateTime OpenTimeUtc { get; set; }

        /// <summary>
        ///     Gets or sets the close time.
        /// </summary>
        public DateTime CloseTimeUtc { get; set; }

        /// <summary>
        ///     Gets or sets the collection of allowed cars.
        /// </summary>
        /// <remarks>Mutually exclusive with AllowedCarClass.</remarks>
        public IEnumerable<SimpleCar> AllowedCars { get; set; }

        /// <summary>
        ///     Gets or sets the class of allowed cars.
        /// </summary>
        /// /// <remarks>Mutually exclusive with AllowedCars.</remarks>
        public CarRestrictions AllowedCarClass { get; set; }
    }
}
