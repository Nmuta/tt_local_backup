using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents a Woodstock player details.
    /// </summary>
    public sealed class WoodstockPlayerDetails
    {
        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets the region.
        /// </summary>
        public short Region { get; set; }

        /// <summary>
        ///     Gets or sets the license plate.
        /// </summary>
        public string LicensePlate { get; set; }

        /// <summary>
        ///     Gets or sets the customization slots.
        /// </summary>
        public IList<short> CustomizationSlots { get; set; }

        /// <summary>
        ///     Gets or sets the current driver model ID.
        /// </summary>
        public int CurrentDriverModelId { get; set; }

        /// <summary>
        ///     Gets or sets the current player title ID.
        /// </summary>
        public ushort CurrentPlayerTitleId { get; set; }

        /// <summary>
        ///     Gets or sets the current player badge ID.
        /// </summary>
        public ushort CurrentPlayerBadgeId { get; set; }

        /// <summary>
        ///     Gets or sets the current career level.
        /// </summary>
        public uint CurrentCareerLevel { get; set; }

        /// <summary>
        ///     Gets or sets the flags.
        /// </summary>
        public byte Flags { get; set; }

        /// <summary>
        ///     Gets or sets the blueprint thread level.
        /// </summary>
        public ushort BlueprintThreadLevel { get; set; }

        /// <summary>
        ///     Gets or sets the photo thread level.
        /// </summary>
        public ushort PhotoThreadLevel { get; set; }

        /// <summary>
        ///     Gets or sets the tuner thread level.
        /// </summary>
        public ushort TunerThreadLevel { get; set; }

        /// <summary>
        ///     Gets or sets the painter thread level.
        /// </summary>
        public ushort PainterThreadLevel { get; set; }

        /// <summary>
        ///     Gets or sets the club id.
        /// </summary>
        public string ClubId { get; set; }

        /// <summary>
        ///     Gets or sets the club tag.
        /// </summary>
        public string ClubTag { get; set; }

        /// <summary>
        ///     Gets or sets the role in club.
        /// </summary>
        public string RoleInClub { get; set; }
    }
}
