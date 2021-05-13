using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise base inventory.
    /// </summary>
    public class SunriseBaseInventory<T>
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
        ///     Gets or sets the car horns.
        /// </summary>
        public IList<T> CarHorns { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<T> VanityItems { get; set; }

        /// <summary>
        ///     Gets or sets the emotes.
        /// </summary>
        public IList<T> Emotes { get; set; }

        /// <summary>
        ///     Gets or sets the quick chat lines.
        /// </summary>
        public IList<T> QuickChatLines { get; set; }
    }
}
