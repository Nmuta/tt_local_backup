using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Woodstock ban parameters as sent to the API.
    /// </summary>
    public sealed class WoodstockBanParametersInput
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
    }
}
