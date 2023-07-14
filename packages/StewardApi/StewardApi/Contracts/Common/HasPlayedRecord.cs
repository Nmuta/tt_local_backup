namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a record that determines if a player played
    ///     a past title and recieved a loyalty reward for doing so.
    /// </summary>
    public sealed class HasPlayedRecord
    {
        /// <summary>
        ///     Gets or sets the game title.
        /// </summary>
        public string GameTitle { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the user has played the title.
        /// </summary>
        public bool HasPlayed { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether user has been sent the Loyalty Rewards for the title.
        /// </summary>
        public bool SentProfileNotification { get; set; }
    }
}
