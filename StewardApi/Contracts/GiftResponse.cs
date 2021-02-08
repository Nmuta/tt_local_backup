using System.Collections;

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
        public GiftHistoryAntecedent IdentityAntecedent { get; set; }

        /// <summary>
        ///     Gets or sets the gifting error.
        /// </summary>
        public object Error { get; set; }
    }
}
