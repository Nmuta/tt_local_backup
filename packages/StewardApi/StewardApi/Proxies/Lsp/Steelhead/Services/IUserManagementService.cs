using System;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.Services.LiveOps.FM8.Generated.UserManagementService;
using UserManagementService = Turn10.Services.LiveOps.FM8.Generated.UserManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
        /// <summary>
        ///     Look up specified liveries.
        /// </summary>
    public interface IUserManagementService
    {
        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<BanUsersV2Output> BanUsersV2(ForzaUserBanParametersV2[] banParameters);

        /// <summary>
        ///     Gets the next ban period for a player based on a ban configuration.
        /// </summary>
        Task<GetNextBanPeriodOutput> GetNextBanPeriod(ulong xuid, Guid pegasusBanConfigurationId);

        /// <summary>
        ///     Gets ban history from a player.
        /// </summary>
        Task<UserManagementService.GetUserBanHistoryOutput> GetUserBanHistory(
            ulong xuid,
            int startIndex,
            int maxResults);

        /// <summary>
        ///     Gets ban history summaries from a player.
        /// </summary>
        Task<UserManagementService.GetUserBanSummariesOutput> GetUserBanSummaries(
            ulong[] xuids,
            int xuidCount);

        /// <summary>
        ///     Expires ban entires.
        /// </summary>
        Task<UserManagementService.ExpireBanEntriesOutput> ExpireBanEntries(
            ForzaUserExpireBanParameters[] parameters,
            int entryCount);

        /// <summary>
        ///     Deletes ban entires.
        /// </summary>
        Task<UserManagementService.DeleteBanEntriesOutput> DeleteBanEntries(
            int[] banEntryIds);

        /// <summary>
        ///     Gets all LSP user groups.
        /// </summary>
        Task<UserManagementService.GetUserGroupsOutput> GetUserGroups(
            int startIndex,
            int maxResults);

        /// <summary>
        ///     Gets player group memberships from a player.
        /// </summary>
        Task<UserManagementService.GetUserGroupMembershipsOutput> GetUserGroupMemberships(
            ulong xuid,
            int[] groupIdFilter,
            int maxResults);

        /// <summary>
        ///     Adds player to specified user groups.
        /// </summary>
        Task AddToUserGroups(
            ulong xuid,
            int[] groupIds);

        /// <summary>
        ///     Removes player from specified user groups.
        /// </summary>
        Task RemoveFromUserGroups(
            ulong xuid,
            int[] groupIds);

        /// <summary>
        ///     Gets "is under review" status of a player.
        /// </summary>
        Task<UserManagementService.GetIsUnderReviewOutput> GetIsUnderReview(
            ulong xuid);

        /// <summary>
        ///     Sets "is under review" status of a player.
        /// </summary>
        Task SetIsUnderReview(
            ulong xuid,
            bool isUnderReview);

        /// <summary>
        ///     Gets consoles associated to a player.
        /// </summary>
        Task<UserManagementService.GetConsolesOutput> GetConsoles(
            ulong xuid,
            int maxResults);

        /// <summary>
        ///     Sets console ban status.
        /// </summary>
        Task SetConsoleBanStatus(
            ulong consoleId,
            bool isBanned);

        /// <summary>
        ///     Gets associated players from a player's consoles.
        /// </summary>
        Task<UserManagementService.GetSharedConsoleUsersOutput> GetSharedConsoleUsers(
            ulong xuid,
            int startAt,
            int maxResults);

        /// <summary>
        ///     Gets meta-level comments on a player.
        /// </summary>
        Task<UserManagementService.GetAdminCommentsOutput> GetAdminComments(
            ulong xuid,
            int maxResults);

        /// <summary>
        ///     Add meta-level comment to a player.
        /// </summary>
        Task AddAdminComment(
            ulong xuid,
            string text,
            string author);

        /// <summary>
        ///     Looks up players to verify they exist.
        /// </summary>
        Task<UserManagementService.GetUserIdsOutput> GetUserIds(
            int paramCount,
            ForzaPlayerLookupParameters[] playerLookupParameters);

        /// <summary>
        ///     Gets report weight of a player.
        /// </summary>
        Task<UserManagementService.GetUserReportWeightOutput> GetUserReportWeight(
            ulong xuid);

        /// <summary>
        ///     Sets report weight of a player.
        /// </summary>
        Task SetUserReportWeight(
            ulong xuid,
            int reportWeight);

        /// <summary>
        ///     Sets report weight type of a player.
        /// </summary>
        Task SetUserReportWeightType(
            ulong xuid,
            ForzaUserReportWeightType reportWeightType);

        /// <summary>
        ///     Gets has played record of a player.
        /// </summary>
        Task<UserManagementService.GetHasPlayedRecordOutput> GetHasPlayedRecord(
            ulong xuid,
            Guid externalProfileId);

        /// <summary>
        ///     Resends has played rewards to a player.
        /// </summary>
        Task ResendProfileHasPlayedNotification(
            ulong xuid,
            Guid externalProfileId,
            int[] titles);

        /// <summary>
        ///     Sets player CMS override.
        /// </summary>
        Task SetCMSOverride(ulong xuid, string snapshot, string environment, string slot);

        /// <summary>
        ///     Gets player CMS override.
        /// </summary>
        Task<UserManagementService.GetCMSOverrideOutput> GetCMSOverride(ulong xuid);

        /// <summary>
        ///     Gets users for a user group.
        /// </summary>
        Task<GetUserGroupUsersOutput> GetUserGroupUsers(int userGroupId, int startAt, int maxResults);

        /// <summary>
        ///     Removes every users from a user group.
        /// </summary>
        Task ClearUserGroup(int groupId);

        /// <summary>
        ///     Removes user from user groups by gamertag.
        /// </summary>
        Task RemoveFromUserGroupsByGamertag(string gamertag, int[] groupIds);

        /// <summary>
        ///     Adds user to user groups by gamertag.
        /// </summary>
        Task AddToUserGroupsByGamertag(string gamertag, int[] groupIds);

        /// <summary>
        ///     Creates a LSP user group.
        /// </summary>
        Task<CreateUserGroupOutput> CreateUserGroup(string groupName);

        /// <summary>
        ///     Gets user details.
        /// </summary>
        Task<GetUserDetailsOutput> GetUserDetails(ulong xuid);

        /// <summary>
        ///     Get the status of a user group bulk operation.
        /// </summary>
        Task<GetUserGroupBulkOperationStatusOutput> GetUserGroupBulkOperationStatus(ForzaBulkOperationType operation, int userGroupId, Guid blobId);

        /// <summary>
        ///     Create a add/remove bulk operation on a user group.
        /// </summary>
        Task<CreateUserGroupBulkOperationV2Output> CreateUserGroupBulkOperationV2(ForzaBulkOperationType operation, int userGroupId, ForzaUserGroupOperationPage[] pages);

        /// <summary>
        ///     Removes the CMS Override on a player by xuid.
        /// </summary>
        Task DeleteCMSOverride(ulong xuid);
    }
}
