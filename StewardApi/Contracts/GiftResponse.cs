namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    /// Represents a gift response.
    /// </summary>
    /// <typeparam name="T">Type of the player or lsp group the gift was sent to.</typeparam>
    public sealed class GiftResponse<T>
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
        ///     Gets or sets the gifting error.
        ///     NOTE: Cannot use Exception type due to serialization issue: https://github.com/JamesNK/Newtonsoft.Json/issues/1622.
        /// </summary>
        public object Error { get; set; }
    }
}
