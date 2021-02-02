using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo master inventory.
    /// </summary>
    public sealed class ApolloMasterInventory
    {
        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<MasterInventoryItem> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<MasterInventoryItem> VanityItems { get; set; }
    }
}
