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
        public const string TitleAccess = nameof(TitleAccess);
        public const string AddLocalizedString = nameof(AddLocalizedString);
        public const string AddProfileNote = nameof(AddProfileNote);
        public const string AdminFeature = nameof(AdminFeature);
        public const string BanConsole = nameof(BanConsole);
        public const string BanPlayer = nameof(BanPlayer);
        public const string CreateUserGroup = nameof(CreateUserGroup);
        public const string DeleteAuction = nameof(DeleteAuction);
        public const string DeleteBan = nameof(DeleteBan);
        public const string DeleteLeaderboardScores = nameof(DeleteLeaderboardScores);
        public const string FeatureUgc = nameof(FeatureUgc);
        public const string GiftGroup = nameof(GiftGroup);
        public const string GiftPlayer = nameof(GiftPlayer);
        public const string HideUgc = nameof(HideUgc);
        public const string MessageGroup = nameof(MessageGroup);
        public const string MessagePlayer = nameof(MessagePlayer);
        public const string OverrideCms = nameof(OverrideCms);
        public const string ReportUgc = nameof(ReportUgc);
        public const string RemoveAllUsersFromGroup = nameof(RemoveAllUsersFromGroup);
        public const string SendLoyaltyRewards = nameof(SendLoyaltyRewards);
        public const string ServicesFeature = nameof(ServicesFeature);
        public const string SetReportWeight = nameof(SetReportWeight);
        public const string SetUgcGeoFlag = nameof(SetUgcGeoFlag);
        public const string UnhideUgc = nameof(UnhideUgc);
        public const string PersistUgc = nameof(PersistUgc);
        public const string CloneUgc = nameof(CloneUgc);
        public const string UpdateAuctionBlocklist = nameof(UpdateAuctionBlocklist);
        public const string UpdateObligationPipeline = nameof(UpdateObligationPipeline);
        public const string UpdateProfile = nameof(UpdateProfile);
        public const string UpdateUserGroup = nameof(UpdateUserGroup);
        public const string UpdateUserFlags = nameof(UpdateUserFlags);
        public const string UpdateMessageOfTheDay = nameof(UpdateMessageOfTheDay);
        public const string UpdateWelcomeCenterTiles = nameof(UpdateWelcomeCenterTiles);
        public const string CreateAuctions = nameof(CreateAuctions);
        public const string ManagePlayFabBuildLocks = nameof(ManagePlayFabBuildLocks);
        public const string ManagePlayFabSettings = nameof(ManagePlayFabSettings);
        public const string ManageStewardTeam = nameof(ManagePlayFabSettings);

        public static IEnumerable<string> AllAttributes()
        {
            return typeof(UserAttribute).GetFields().Select(field => field.Name);
        }
    }
}