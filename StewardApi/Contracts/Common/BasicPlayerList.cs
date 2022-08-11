using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Errors;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a basic list of players.
    /// </summary>
    public sealed class BasicPlayerList
    {
        /// <summary>
        ///     Gets or sets the Xuid of the player.
        /// </summary>
        public ulong[] Xuids { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag of the player.
        /// </summary>
        public string[] Gamertags { get; set; }
    }
}
