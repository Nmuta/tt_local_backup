using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts
{
    /// <summary>
    ///     Represents a bulk user lookup.
    /// </summary>
    public sealed class BulkUserLookup
    {
        /// <summary>
        ///     Gets or sets the Azure object IDs.
        /// </summary>
        public IList<string> UserObjectIds { get; set; }
    }
}
