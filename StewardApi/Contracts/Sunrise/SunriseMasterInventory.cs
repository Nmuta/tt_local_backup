using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents a Sunrise player details.
    /// </summary>
    public sealed class SunriseMasterInventory
    {
        /// <summary>
        ///     Gets the credit reward options.
        /// </summary>
        public IList<string> CreditRewards { get; } = new List<string>()
        {
            "Credits",
            "ForzathonPoints",
            "SkillPoints",
            "WheelSpins",
            "SuperWheelSpins"
        };

        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<ForzaCar> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the car horns.
        /// </summary>
        public IList<CarHorn> CarHorns { get; set; }

        /// <summary>
        ///     Gets or sets the vanity items.
        /// </summary>
        public IList<CharacterCustomization> VanityItems { get; set; }

        /// <summary>
        ///     Gets or sets the emotes.
        /// </summary>
        public IList<Emote> Emotes { get; set; }

        /// <summary>
        ///     Gets or sets the quick chat lines.
        /// </summary>
        public IList<QuickChat> QuickChatLines { get; set; }
    }
}
