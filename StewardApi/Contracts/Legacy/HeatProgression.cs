using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents the heat progression.
    /// </summary>
    public sealed class HeatProgression : InventoryItem
    {
        /// <summary>
        ///     Gets or sets the heat key.
        /// </summary>
        public string HeatKey { get; set; }

        /// <summary>
        ///     Gets or sets the heat ID.
        /// </summary>
        public uint HeatId { get; set; }

        /// <summary>
        ///     Gets or sets the settings ID.
        /// </summary>
        public Guid SettingsId { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether it is completed.
        /// </summary>
        public bool Completed { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether it is unlocked.
        /// </summary>
        public bool IsUnlocked { get; set; }

        /// <summary>
        ///     Gets or sets the career modes.
        /// </summary>
        public IList<CareerNode> CareerNodes { get; set; }

        /// <summary>
        ///     Gets or sets the completed nodes.
        /// </summary>
        public IList<HeatNode> CompletedNodes { get; set; }

        /// <summary>
        ///     Gets or sets the nodes traversed before quitting.
        /// </summary>
        public IList<HeatNode> NodesTraversedBeforeQuitting { get; set; }
    }
}