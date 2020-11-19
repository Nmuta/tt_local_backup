using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise player inventory.
    /// </summary>
    public sealed class SunrisePlayerInventory
    {
        /// <summary>
        ///     Gets or sets the Xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the credits.
        /// </summary>
        public int Credits { get; set; }

        /// <summary>
        ///     Gets or sets the wheel spins.
        /// </summary>
        public int WheelSpins { get; set; }

        /// <summary>
        ///     Gets or sets the super wheel spins.
        /// </summary>
        public int SuperWheelSpins { get; set; }

        /// <summary>
        ///     Gets or sets the skill points.
        /// </summary>
        public int SkillPoints { get; set; }

        /// <summary>
        ///     Gets or sets the Forzathon points.
        /// </summary>
        public int ForzathonPoints { get; set; }

        /// <summary>
        ///     Gets or sets the rebuilds.
        /// </summary>
        public IList<SunriseInventoryItem> Rebuilds { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<SunriseInventoryItem> VanityItems { get; set; }

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<SunriseCar> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the car horns.
        /// </summary>
        public IList<SunriseInventoryItem> CarHorns { get; set; }

        /// <summary>
        ///     Gets or sets the quick chat lines.
        /// </summary>
        public IList<SunriseInventoryItem> QuickChatLines { get; set; }

        /// <summary>
        ///     Gets or sets the credit rewards.
        /// </summary>
        public IList<SunriseInventoryItem> CreditRewards { get; set; }

        /// <summary>
        ///     Gets or sets the emotes.
        /// </summary>
        public IList<SunriseInventoryItem> Emotes { get; set; }

        /// <summary>
        ///     Gets or sets the barn find rumors.
        /// </summary>
        public IList<SunriseInventoryItem> BarnFindRumors { get; set; }

        /// <summary>
        ///     Gets or sets the perks.
        /// </summary>
        public IList<SunriseInventoryItem> Perks { get; set; }

        /// <summary>
        ///     Gets or sets the gift reason.
        /// </summary>
        public string GiftReason { get; set; }
    }
}
