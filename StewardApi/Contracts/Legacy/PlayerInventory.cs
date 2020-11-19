using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Legacy
{
    /// <summary>
    ///     Represents the player inventory.
    /// </summary>
    public sealed class PlayerInventory : Response
    {
        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<Car> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the mastery kits.
        /// </summary>
        public IList<MasteryKit> MasteryKits { get; set; }

        /// <summary>
        ///     Gets or sets the upgrade kits.
        /// </summary>
        public IList<UpgradeKit> UpgradeKits { get; set; }

        /// <summary>
        ///     Gets or sets the repair kits.
        /// </summary>
        public IList<RepairKit> RepairKits { get; set; }

        /// <summary>
        ///     Gets or sets the heat progressions.
        /// </summary>
        public IList<HeatProgression> HeatProgressions { get; set; }

        /// <summary>
        ///     Gets or sets the packs.
        /// </summary>
        public IList<Pack> Packs { get; set; }

        /// <summary>
        ///     Gets or sets the currencies.
        /// </summary>
        public IList<Currency> Currencies { get; set; }

        /// <summary>
        ///     Gets or sets the current heats.
        /// </summary>
        public IList<CurrentHeat> CurrentHeats { get; set; }

        /// <summary>
        ///     Gets or sets the energy refills.
        /// </summary>
        public IList<EnergyRefill> EnergyRefills { get; set; }

        /// <summary>
        ///     Gets or sets the FTUE state.
        /// </summary>
        public string FtueState { get; set; }

        /// <summary>
        ///     Gets or sets the previous game settings info.
        /// </summary>
        public PreviousGameSettingsVersion PreviousGameSettingsInfo { get; set; }

        /// <summary>
        ///     Gets or sets the previous game settings GUID.
        /// </summary>
        public Guid PreviousGameSettingsGuid { get; set; }

        /// <summary>
        ///     Gets or sets the current external profile ID.
        /// </summary>
        public Guid CurrentExternalProfileId { get; set; }

        /// <summary>
        ///     Gets or sets the XUID.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the Turn 10 Id.
        /// </summary>
        public string T10Id { get; set; }

        /// <summary>
        ///     Gets or sets the rebuilds.
        /// </summary>
        public IList<InventoryItem> Rebuilds { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<InventoryItem> VanityItems { get; set; }

        /// <summary>
        ///     Gets or sets the car horns.
        /// </summary>
        public IList<InventoryItem> CarHorns { get; set; }

        /// <summary>
        ///     Gets or sets the quick chat lines.
        /// </summary>
        public IList<InventoryItem> QuickChatLines { get; set; }

        /// <summary>
        ///     Gets or sets the credit rewards.
        /// </summary>
        public IList<InventoryItem> CreditRewards { get; set; }

        /// <summary>
        ///     Gets or sets the emotes.
        /// </summary>
        public IList<InventoryItem> Emotes { get; set; }

        /// <summary>
        ///     Gets or sets the barn find rumors.
        /// </summary>
        public IList<InventoryItem> BarnFindRumors { get; set; }

        /// <summary>
        ///     Gets or sets the perks.
        /// </summary>
        public IList<InventoryItem> Perks { get; set; }

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
        ///    Gets or sets the mods.
        /// </summary>
        public IList<InventoryItem> Mods { get; set; }

        /// <summary>
        ///    Gets or sets the badges.
        /// </summary>
        public IList<InventoryItem> Badges { get; set; }

        /// <summary>
        ///     Gets or sets the gift reason.
        /// </summary>
        public string GiftReason { get; set; }
    }
}