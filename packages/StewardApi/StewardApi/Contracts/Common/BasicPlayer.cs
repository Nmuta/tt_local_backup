using Turn10.LiveOps.StewardApi.Contracts.Errors;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a basic player. Expect at least one Gamertag or Xuid, but not necessarily both.
    /// </summary>
    public sealed class BasicPlayer
    {
        /// <summary>
        ///     Gets or sets the Xuid of the player. Optional if a Gamertag is set.
        /// </summary>
        public ulong? Xuid { get; set; }

        /// <summary>
        ///     Gets or sets the gamertag of the player. Optional if a Xuid is set.
        /// </summary>
        public string Gamertag { get; set; }

        /// <summary>
        ///     Gets or sets the error related to the player.
        /// </summary>
        public StewardError Error { get; set; }
    }
}
