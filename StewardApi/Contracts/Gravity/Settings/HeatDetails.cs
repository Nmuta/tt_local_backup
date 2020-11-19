using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents heat details.
    /// </summary>
    public sealed class HeatDetails
    {
        /// <summary>
        ///     Gets or sets a value indicating whether always unlocked.
        /// </summary>
        public bool AlwaysUnlocked { get; set; }

        /// <summary>
        ///     Gets or sets the default energy cost.
        /// </summary>
        public int DefaultEnergyCost { get; set; }

        /// <summary>
        ///     Gets or sets the event type.
        /// </summary>
        public string EventType { get; set; }

        /// <summary>
        ///     Gets or sets the heat ID.
        /// </summary>
        public int HeatId { get; set; }

        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public Guid Id { get; set; }
    }
}