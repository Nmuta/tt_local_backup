using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents a heat node.
    /// </summary>
    public sealed class HeatNode
    {
        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        ///     Gets or sets the destinations.
        /// </summary>
        public IList<int> Destinations { get; set; }

        /// <summary>
        ///     Gets or sets the energy cost.
        /// </summary>
        public int EnergyCost { get; set; }

        /// <summary>
        ///     Gets or sets the type.
        /// </summary>
        public string Type { get; set; }
    }
}