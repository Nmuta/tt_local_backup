using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo player details.
    /// </summary>
    public sealed class ApolloPlayerDetails
    {
        /// <summary>
        ///     Gets or sets the Xuid.
        /// </summary>
        public ulong Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets the current profile ID.
        /// </summary>
        public int CurrentProfileId { get; set; }

        /// <summary>
        ///     Gets or sets the subscription tier.
        /// </summary>
        public string SubscriptionTier { get; set; }

        /// <summary>
        ///     Gets or sets the age group.
        /// </summary>
        public byte AgeGroup { get; set; }

        /// <summary>
        ///     Gets or sets the region.
        /// </summary>
        public string Region { get; set; }

        /// <summary>
        ///     Gets or sets the country.
        /// </summary>
        public int Country { get; set; }

        /// <summary>
        ///     Gets or sets the LCID.
        /// </summary>
        public int LCID { get; set; }

        /// <summary>
        ///     Gets or sets the IP address.
        /// </summary>
        public string IPAddress { get; set; }

        /// <summary>
        ///     Gets or sets the last login.
        /// </summary>
        public DateTime LastLoginUtc { get; set; }

        /// <summary>
        ///     Gets or sets the first login.
        /// </summary>
        public DateTime FirstLoginUtc { get; set; }

        /// <summary>
        ///     Gets or sets the equipped vanity item ID.
        /// </summary>
        public int EquippedVanityItemId { get; set; }

        /// <summary>
        ///     Gets or sets the current driver model ID.
        /// </summary>
        public int CurrentDriverModelId { get; set; }

        /// <summary>
        ///     Gets or sets the current player title ID.
        /// </summary>
        public ushort CurrentPlayerTitleId { get; set; }

        /// <summary>
        ///     Gets or sets the current badge ID.
        /// </summary>
        public ushort CurrentBadgeId { get; set; }

        /// <summary>
        ///     Gets or sets the current car collection tier.
        /// </summary>
        public ushort CurrentCarCollectionTier { get; set; }

        /// <summary>
        ///     Gets or sets the current car collection score.
        /// </summary>
        public uint CurrentCarCollectionScore { get; set; }

        /// <summary>
        ///     Gets or sets the current career level.
        /// </summary>
        public uint CurrentCareerLevel { get; set; }

        /// <summary>
        ///     Gets or sets the club ID.
        /// </summary>
        public Guid ClubId { get; set; }

        /// <summary>
        ///     Gets or sets the club tag.
        /// </summary>
        public string ClubTag { get; set; }

        /// <summary>
        ///     Gets or sets the role in club.
        /// </summary>
        public string RoleInClub { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is featured commentator.
        /// </summary>
        public bool IsFeaturedCommentator { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is featured drivatar.
        /// </summary>
        public bool IsFeaturedDrivatar { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is featured photographer.
        /// </summary>
        public bool IsFeaturedPhotographer { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is featured tuner.
        /// </summary>
        public bool IsFeaturedTuner { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is featured painter.
        /// </summary>
        public bool IsFeaturedPainter { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is under review.
        /// </summary>
        public bool IsUnderReview { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is community manager.
        /// </summary>
        public bool IsCommunityManager { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is on white list.
        /// </summary>
        public bool IsOnWhiteList { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is VIP.
        /// </summary>
        public bool IsVip { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is Turn 10 employee.
        /// </summary>
        public bool IsTurn10Employee { get; set; }
    }
}
