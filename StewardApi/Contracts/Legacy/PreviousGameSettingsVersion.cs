namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents previous game settings version.
    /// </summary>
    public sealed class PreviousGameSettingsVersion : InventoryItem
    {
        /// <summary>
        ///     Gets or sets the version number.
        /// </summary>
        public string VersionNumber { get; set; }

        /// <summary>
        ///     Gets or sets the save game version.
        /// </summary>
        public int SaveGameVersion { get; set; }
    }
}