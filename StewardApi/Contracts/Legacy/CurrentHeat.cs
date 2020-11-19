using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents the current heat.
    /// </summary>
    public sealed class CurrentHeat : InventoryItem
    {
        /// <summary>
        ///     Gets or sets the event type.
        /// </summary>
        public string EventType { get; set; }

        /// <summary>
        ///     Gets or sets the settings ID.
        /// </summary>
        public Guid SettingsId { get; set; }

        /// <summary>
        ///     Gets or sets the current car.
        /// </summary>
        public Guid CurrentCar { get; set; }

        /// <summary>
        ///     Gets or sets the current opponent slot index.
        /// </summary>
        public uint CurrentOpponentSlotIndex { get; set; }

        /// <summary>
        ///     Gets or sets the current node ID.
        /// </summary>
        public uint CurrentNodeId { get; set; }

        /// <summary>
        ///     Gets or sets the previous node ID.
        /// </summary>
        public uint PreviousNodeId { get; set; }

        /// <summary>
        ///     Gets or sets the expiry time.
        /// </summary>
        public DateTime ExpiryTime { get; set; }

        /// <summary>
        ///     Gets or sets the completed nodes.
        /// </summary>
        public IList<HeatNode> CompletedNodes { get; set; }

        /// <summary>
        ///     Gets or sets the car team members.
        /// </summary>
        public IList<CarTeamMember> CarTeamMembers { get; set; }

        /// <summary>
        ///     Gets or sets the career nodes.
        /// </summary>
        public IList<CareerNode> CareerNodes { get; set; }

        /// <summary>
        ///     Gets or sets the pending rewards packages.
        /// </summary>
        public IList<PendingRewardsPackage> PendingRewardsPackages { get; set; }

        /// <summary>
        ///     Gets or sets the quantity.
        /// </summary>
        public new long Quantity { get; set; }
    }
}