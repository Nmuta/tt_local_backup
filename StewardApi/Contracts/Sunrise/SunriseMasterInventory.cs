using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise master inventory.
    /// </summary>
    public sealed class SunriseMasterInventory
    {
        /// <summary>
        ///     Gets the credit reward options.
        /// </summary>
        public IList<MasterInventoryItem> CreditRewards { get; } = new List<MasterInventoryItem>()
        {
            new MasterInventoryItem() { Id = -1, Description = "Credits" },
            new MasterInventoryItem() { Id = -1, Description = "ForzathonPoints" },
            new MasterInventoryItem() { Id = -1, Description = "SkillPoints" },
            new MasterInventoryItem() { Id = -1, Description = "WheelSpins" },
            new MasterInventoryItem() { Id = -1, Description = "SuperWheelSpins" },
        };

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<MasterInventoryItem> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the car horns.
        /// </summary>
        public IList<MasterInventoryItem> CarHorns { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<MasterInventoryItem> VanityItems { get; set; }

        /// <summary>
        ///     Gets or sets the emotes.
        /// </summary>
        public IList<MasterInventoryItem> Emotes { get; set; }

        /// <summary>
        ///     Gets or sets the quick chat lines.
        /// </summary>
        public IList<MasterInventoryItem> QuickChatLines { get; set; }
    }
}
