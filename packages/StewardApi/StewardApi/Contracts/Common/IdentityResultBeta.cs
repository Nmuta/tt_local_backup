using Forza.WebServices.FMG.Generated;
using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Errors;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents results of an identity query.
    /// </summary>
    public sealed class IdentityResultBeta
    {
        /// <summary>
        ///     Gets or sets the query.
        /// </summary>
        public IdentityQueryBeta Query { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong? Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the Turn 10 ID.
        /// </summary>
        public string T10Id { get; set; }

        /// <summary>
        ///     Gets or sets the Turn 10 ID.
        /// </summary>
        public IList<LiveOpsUserDetails> T10Ids { get; set; }

        /// <summary>
        ///     Gets or sets the error.
        /// </summary>
        public StewardError Error { get; set; }
    }
}
