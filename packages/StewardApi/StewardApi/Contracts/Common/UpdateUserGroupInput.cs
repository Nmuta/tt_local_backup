namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a list of xuids and a list of gamertags to add/remove from a User Group.
    /// </summary>
    public sealed class UpdateUserGroupInput
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
