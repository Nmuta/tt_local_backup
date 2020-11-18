﻿using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Represents an Apollo ban summary.
    /// </summary>
    public sealed class ApolloBanSummary
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
        ///     Gets or sets the number of bans.
        /// </summary>
        public int BanCount { get; set; }

        /// <summary>
        ///     Gets or sets the banned areas.
        /// </summary>
        public IList<string> BannedAreas { get; set; }

        /// <summary>
        ///     Gets or sets the last ban's description.
        /// </summary>
        public ApolloBanDescription LastBanDescription { get; set; }

        /// <summary>
        ///     Gets or sets a value indicating whether the user exists.
        /// </summary>
        public bool UserExists { get; set; }
    }
}
