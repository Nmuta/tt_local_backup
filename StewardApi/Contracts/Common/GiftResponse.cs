using System;
using System.Collections.Generic;
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
        [Obsolete("TODO: This should be split out into separate XUID + LSP Group columns in a V2 Object, to aid the UI")]
        public T PlayerOrLspGroup { get; set; }

        /// <summary>
        ///     Gets or sets the XUID of the player the gift was sent to.
        /// </summary>
        public ulong? TargetXuid { get; set; }

        /// <summary>
        ///     Gets or sets the LSP Group the gift was sent to.
        /// </summary>
        public int? TargetLspGroupId { get; set; }

        /// <summary>
        ///     Gets or sets the gift identifier antecedent.
        /// </summary>
        public GiftIdentityAntecedent IdentityAntecedent { get; set; }

        /// <summary>
        ///     Gets or sets the errors.
        /// </summary>
        public IList<StewardError> Errors { get; set; }
    }
}
