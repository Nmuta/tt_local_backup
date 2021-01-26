using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents a Gravity player details.
    /// </summary>
    public sealed class GravityPlayerDetails
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
        ///     Gets or sets the Turn 10 ID.
        /// </summary>
        public string T10Id { get; set; }

        /// <summary>
        ///     Gets or sets the Play Fab ID.
        /// </summary>
        public string PlayFabId { get; set; }

        /// <summary>
        ///     Gets or sets the user inventory ID.
        /// </summary>
        public string UserInventoryId { get; set; }

        /// <summary>
        ///     Gets or sets the LCID.
        /// </summary>
        public int Lcid { get; set; }

        /// <summary>
        ///     Gets or sets the country.
        /// </summary>
        public int Country { get; set; }

        /// <summary>
        ///     Gets or sets the region.
        /// </summary>
        public int Region { get; set; }

        /// <summary>
        ///     Gets or sets the IP Address.
        /// </summary>
        public string IpAddress { get; set; }

        /// <summary>
        ///     Gets or sets the subscription tier.
        /// </summary>
        public string SubscriptionTier { get; set; }

        /// <summary>
        ///     Gets or sets the last login.
        /// </summary>
        public DateTime LastLoginUtc { get; set; }

        /// <summary>
        ///     Gets or sets the first login.
        /// </summary>
        public DateTime FirstLoginUtc { get; set; }

        /// <summary>
        ///     Gets or sets the age group.
        /// </summary>
        public byte AgeGroup { get; set; }

        /// <summary>
        ///     Gets or sets the time offset in seconds.
        /// </summary>
        public int TimeOffsetInSeconds { get; set; }

        /// <summary>
        ///     Gets or sets the last game settings used.
        /// </summary>
        public Guid LastGameSettingsUsed { get; set; }

        /// <summary>
        ///     Gets or sets the profile details.
        /// </summary>
        public IList<GravitySaveState> SaveStates { get; set; }
    }
}
