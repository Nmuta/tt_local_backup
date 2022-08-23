using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Allows for bulk gifting of liveries to various targets.
    /// </summary>
    /// <typeparam name="TTarget">The target type.</typeparam>
    public class BulkLiveryGift<TTarget>
    {
        /// <summary>
        ///     Gets or sets the livery IDs to gift.
        /// </summary>
        public IEnumerable<string> LiveryIds { get; set; }

        /// <summary>
        ///     Gets or sets the target of the gift.
        /// </summary>
        public TTarget Target { get; set; }
    }
}
