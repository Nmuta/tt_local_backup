using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a response for the get user group users endpoint.
    /// </summary>
    public sealed class GetUserGroupUsersResponse
    {
        /// <summary>
        ///     Gets or sets the list of the player.
        /// </summary>
        public IList<BasicPlayer> PlayerList { get; set; }

        /// <summary>
        ///     Gets or sets the total amount of the player. Not equal to the length of the list because it is loaded dynamically.
        /// </summary>
        public int PlayerCount { get; set; }
    }
}
