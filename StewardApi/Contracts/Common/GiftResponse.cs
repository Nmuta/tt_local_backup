using Turn10.LiveOps.StewardApi.Contracts.Errors;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a gift response.
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
        /// </summary>
        public StewardError Error { get; set; }
    }
}
