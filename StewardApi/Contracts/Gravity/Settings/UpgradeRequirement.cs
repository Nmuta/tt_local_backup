using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents the upgrade requirement.
    /// </summary>
    public sealed class UpgradeRequirement
    {
        /// <summary>
        ///     Gets or sets the item type.
        /// </summary>
        public string ItemType { get; set; }

        /// <summary>
        ///     Gets or sets the item quantity.
        /// </summary>
        public long ItemQuantity { get; set; }

        /// <summary>
        ///     Gets or sets the item ID.
        /// </summary>
        public int ItemId { get; set; }

        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        ///     Gets or sets the last updated by.
        /// </summary>
        public string LastUpdatedBy { get; set; }

        /// <summary>
        ///     Gets or sets the created by.
        /// </summary>
        public string CreatedBy { get; set; }
    }
}
