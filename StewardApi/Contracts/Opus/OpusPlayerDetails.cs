using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Opus
{
    /// <summary>
    ///     Represents an Opus player details.
    /// </summary>
    public sealed class OpusPlayerDetails
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
        ///     Gets or sets the license plate.
        /// </summary>
        public string LicensePlate { get; set; }

        /// <summary>
        ///     Gets or sets the age group.
        /// </summary>
        public byte AgeGroup { get; set; }

        /// <summary>
        ///     Gets or sets the subscription tier.
        /// </summary>
        public string SubscriptionTier { get; set; }

        /// <summary>
        ///     Gets or sets the country.
        /// </summary>
        public int Country { get; set; }

        /// <summary>
        ///     Gets or sets the region.
        /// </summary>
        public int Region { get; set; }

        /// <summary>
        ///     Gets or sets the LCID.
        /// </summary>
        public int Lcid { get; set; }

        /// <summary>
        ///     Gets or sets the IP address.
        /// </summary>
        public string IpAddress { get; set; }

        /// <summary>
        ///     Gets or sets the last login.
        /// </summary>
        public DateTime LastLoginUtc { get; set; }

        /// <summary>
        ///     Gets or sets the first login.
        /// </summary>
        public DateTime FirstLoginUtc { get; set; }

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
        ///     Gets or sets the current career level.
        /// </summary>
        public uint CurrentCareerLevel { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player accepts club invites.
        /// </summary>
        public bool AcceptsClubInvites { get; set; }

        /// <summary>
        ///     Gets or sets the club tag.
        /// </summary>
        public string ClubTag { get; set; }

        /// <summary>
        ///     Gets or sets the club top tier count.
        /// </summary>
        public int ClubTopTierCount { get; set; }

        /// <summary>
        ///     Gets or sets the role in club.
        /// </summary>
        public string RoleInClub { get; set; }

        /// <summary>
        ///     Gets or sets the flags.
        /// </summary>
        public byte Flags { get; set; }

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
        ///     Gets or sets a value indicating whether player is flagged for suspicious activity.
        /// </summary>
        public bool IsFlaggedForSuspiciousActivity { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is under review.
        /// </summary>
        public bool IsUnderReview { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is on white list.
        /// </summary>
        public bool IsOnWhiteList { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is Turn 10 employee.
        /// </summary>
        public bool IsTurn10Employee { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether player is VIP.
        /// </summary>
        public bool IsVip { get; set; }
    }
}
