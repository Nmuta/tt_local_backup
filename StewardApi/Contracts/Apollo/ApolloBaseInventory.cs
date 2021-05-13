using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo base inventory.
    /// </summary>
    public class ApolloBaseInventory<T>
        where T : MasterInventoryItem
    {
        /// <summary>
        ///     Gets or sets the credit reward options.
        /// </summary>
        public IList<T> CreditRewards { get; set; }

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<T> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<T> VanityItems { get; set; }
    }
}
