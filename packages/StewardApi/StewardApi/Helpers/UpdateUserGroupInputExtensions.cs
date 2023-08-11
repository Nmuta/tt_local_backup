using System.Collections.Generic;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for <see cref="UpdateUserGroupInputExtensions"/>.
    /// </summary>
    public static class UpdateUserGroupInputExtensions
    {
        /// <summary>
        ///     Validate that at least one list or either Xuids or Gamertags was provided and that the lists are valid.
        /// </summary>
        public static void ValidateUserList(this UpdateUserGroupInput userList)
        {
            if ((userList.Xuids == null || userList.Xuids.Length == 0) &&
                (userList.Gamertags == null || userList.Gamertags.Length == 0))
            {
                throw new InvalidArgumentsStewardException($"No player gamertags or xuids provided.");
            }

            if (userList.Xuids != null && userList.Xuids.Length > 0)
            {
                userList.Xuids.EnsureValidXuids();
            }

            if (userList.Gamertags != null && userList.Gamertags.Length > 0)
            {
                foreach (var gamertag in userList.Gamertags)
                {
                    gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));
                }
            }
        }

        /// <summary>
        ///     Create a BasicPlayer list based on the UpdateUserGroupInput received in add/remove request body.
        /// </summary>
        public static IList<BasicPlayer> CreateBasicPlayerList(this UpdateUserGroupInput userList)
        {
            var response = new List<BasicPlayer>();

            if (userList.Xuids != null)
            {
                foreach (var xuid in userList.Xuids)
                {
                    var basicPlayer = new BasicPlayer() { Xuid = xuid };
                    response.Add(basicPlayer);
                }
            }

            if (userList.Gamertags != null)
            {
                foreach (var gamertag in userList.Gamertags)
                {
                    var basicPlayer = new BasicPlayer() { Gamertag = gamertag };
                    response.Add(basicPlayer);
                }
            }

            return response;
        }
    }
}
