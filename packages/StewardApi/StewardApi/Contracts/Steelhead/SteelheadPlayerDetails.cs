namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead player details.
    /// </summary>
    public sealed class SteelheadPlayerDetails
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
        ///     Gets or sets the flags.
        /// </summary>
        public byte Flags { get; set; }

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
        ///     Gets or sets the equipped vanity item ID.
        /// </summary>
        public int EquippedVanityItemId { get; set; }

        /// <summary>
        ///     Gets or sets the current career level.
        /// </summary>
        public uint CurrentCareerLevel { get; set; }

        /// <summary>
        ///     Gets or sets the current car collection score.
        /// </summary>
        public uint CurrentCarCollectionScore { get; set; }

        /// <summary>
        ///     Gets or sets the current car collection tier.
        /// </summary>
        public ushort CurrentCarCollectionTier { get; set; }

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
