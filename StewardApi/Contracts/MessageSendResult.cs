namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Represents a message send result.
    /// </summary>
    /// /// <typeparam name="T">Type of the player or lsp group the message was sent to.</typeparam>
    public sealed class MessageSendResult<T>
    {
        /// <summary>
        ///     Gets or sets the player or LspGroup the gift was sent to.
        /// </summary>
        public T PlayerOrLspGroup { get; set; }

        /// <summary>
        ///     Gets or sets the gift identifier antecedent.
        /// </summary>
        public GiftIdentityAntecedent IdentityAntecedent { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the message send was a success.
        /// </summary>
        public bool Success { get; set; }
    }
}
