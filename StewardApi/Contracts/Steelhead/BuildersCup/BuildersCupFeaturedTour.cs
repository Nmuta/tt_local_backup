using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.BuildersCup
{
    /// <summary>
    ///     Represents the dynamic tours added and removed from Builder's Cup
    /// </summary>
    /// <remarks>In Pegasus these are called 'ladders' not 'tours'.</remarks>
    public sealed class BuildersCupFeaturedTour
    {
        /// <summary>
        ///     Gets or sets the tour name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets the tour description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether this tour is disabled.
        /// </summary>
        public bool IsDisabled { get; set; }

        /// <summary>
        ///     Gets or sets the time the tour opens.
        /// </summary>
        public DateTime OpenTimeUtc { get; set; }

        /// <summary>
        ///     Gets or sets the time the Tour closes.
        /// </summary>
        public DateTime CloseTimeUtc { get; set; }
    }
}
