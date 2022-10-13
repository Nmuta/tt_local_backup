using System.Collections.Generic;
using System.Linq;

namespace Turn10.LiveOps.StewardApi.Authorization
{
    /// <summary>
    ///     Represents the current attributes a user can have.
    /// </summary>
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
#pragma warning disable SA1600 // Elements should be documented
    public static class UserAttribute
    {
        public const string AddLocalizedString = "AddLocalizedString";
        public const string AddProfileNote = "AddProfileNote";
        public const string AdminFeature = "AdminFeature";
        public const string BanConsole = "BanConsole";
        public const string BanPlayer = "BanPlayer";
        public const string CreateUserGroup = "CreateUserGroup";
        public const string DeleteAuction = "DeleteAuction";
        public const string DeleteBan = "DeleteBan";
        public const string DeleteLeaderboardScores = "DeleteLeaderboardScores";
        public const string FeatureUGC = "FeatureUGC";
        public const string GroupGifting = "GroupGifting";
        public const string GroupLiveryGifting = "GroupLiveryGifting";
        public const string GroupMessaging = "GroupMessaging";
        public const string HideUGC = "HideUGC";
        public const string OverrideCMS = "OverrideCMS";
        public const string PlayerGifitng = "PlayerGifitng";
        public const string PlayerGifting = "PlayerGifting";
        public const string PlayerLiveryGifting = "PlayerLiveryGifting";
        public const string PlayerMessaging = "PlayerMessaging";
        public const string SendLoyaltyRewards = "SendLoyaltyRewards";
        public const string ServicesFeature = "ServicesFeature";
        public const string SetReportWeight = "SetReportWeight";
        public const string SetUGCGeoFlag = "SetUGCGeoFlag";
        public const string UpdateAuctionBlocklist = "UpdateAuctionBlocklist";
        public const string UpdateObligationPipeline = "UpdateObligationPipeline";
        public const string UpdateProfile = "UpdateProfile";
        public const string UpdateUserGroup = "UpdateUserGroup";

        public static IEnumerable<string> AllAttributes()
        {
            return typeof(UserAttribute).GetFields().Select(field => field.Name);
        }
    }
}