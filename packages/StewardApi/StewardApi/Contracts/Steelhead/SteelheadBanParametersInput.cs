using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Steelhead ban parameters as sent to the API.
    /// </summary>
    public sealed class SteelheadBanParametersInput
    {
        /// <summary>
        ///     Gets or sets the reason group.
        /// </summary>
        public string ReasonGroupName { get; set; }

        /// <summary>
        ///     Gets or sets the reason.
        /// </summary>
        public string Reason { get; set; }

        /// <summary>
        ///     Gets or sets the xuid.
        /// </summary>
        public ulong? Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to delete leader board entries.
        /// </summary>
        public bool? DeleteLeaderboardEntries { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to override properties of a ban.
        /// </summary>
        public bool Override { get; set; }

        /// <summary>
        ///     Gets or sets the override ban duration.
        /// </summary>
        public TimeSpan? OverrideDuration { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to make a ban permanent.
        /// </summary>
        public bool? OverrideDurationPermanent { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether to ban all user's devices.
        /// </summary>
        public bool? OverrideBanConsoles { get; set; }
    }
}
