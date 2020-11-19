using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings
{
    /// <summary>
    ///     Represents the game data item.
    /// </summary>
    /// <typeparam name="TItem">The type of the item.</typeparam>
    public sealed class GameDataItem<TItem>
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
        ///     Gets or sets the image URL.
        /// </summary>
        public string ImageUrl { get; set; }

        /// <summary>
        ///     Gets or sets the item ID.
        /// </summary>
        public int ItemId { get; set; }

        /// <summary>
        ///     Gets or sets the settings ID.
        /// </summary>
        public Guid SettingsId { get; set; }

        /// <summary>
        ///     Gets or sets the last updated.
        /// </summary>
        public DateTime LastUpdated { get; set; }

        /// <summary>
        ///     Gets or sets the last updated by.
        /// </summary>
        public string LastUpdatedBy { get; set; }

        /// <summary>
        ///     Gets or sets the created.
        /// </summary>
        public DateTime Created { get; set; }

        /// <summary>
        ///     Gets or sets the created by.
        /// </summary>
        public string CreatedBy { get; set; }

        /// <summary>
        ///     Gets or sets the details.
        /// </summary>
        public TItem Details { get; set; }
    }
}
