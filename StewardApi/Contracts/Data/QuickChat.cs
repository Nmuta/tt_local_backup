namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     Represents a quick chat.
    /// </summary>
    public sealed class QuickChat
    {
        /// <summary>
        ///     Gets or sets the ID.
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        ///     Gets or sets the chat message.
        /// </summary>
        public string ChatMessage { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether requires unlock.
        /// </summary>
        public byte RequiresUnlock { get; set; }

        /// <summary>
        ///     Gets or sets value indicating whether hidden.
        /// </summary>
        public byte Hidden { get; set; }
    }
}
