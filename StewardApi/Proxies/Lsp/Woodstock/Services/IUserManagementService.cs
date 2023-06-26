using System;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.Services.LiveOps.FH5_main.Generated.UserManagementService;

#pragma warning disable VSTHRD200 // Use Async Suffix

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services
{
    /// <summary>
    ///     Proxy interface for <see cref="UserManagementService"/>.
    /// </summary>
    public interface IUserManagementService
    {
        /// <summary>
        ///     Gets users for a user group.
        /// </summary>
        Task<GetUserGroupUsersOutput> GetUserGroupUsers(int userGroupId, int startAt, int maxResults);

        /// <summary>
        ///     Gets user group user count.
        /// </summary>
        Task<GetUserGroupMemberCountOutput> GetUserGroupMemberCount(int groupId);

        /// <summary>
        ///     Gets user IDs.
        /// </summary>
        Task<GetUserIdsOutput> GetUserIds(int paramCount, ForzaPlayerLookupParameters[] playerLookupParameters);

        /// <summary>
        ///     Removes every users from a user group.
        /// </summary>
        Task ClearUserGroup(int groupId);

        /// <summary>
        ///     Removes user from user groups.
        /// </summary>
        Task RemoveFromUserGroups(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Removes user from user groups by gamertag.
        /// </summary>
        Task RemoveFromUserGroupsByGamertag(string gamertag, int[] groupIds);

        /// <summary>
        ///     Adds user to user groups.
        /// </summary>
        Task AddToUserGroups(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Adds user to user groups by gamertag.
        /// </summary>
        Task AddToUserGroupsByGamertag(string gamertag, int[] groupIds);

        /// <summary>
        ///     Creates a LSP user group.
        /// </summary>
        Task<CreateUserGroupOutput> CreateUserGroup(string groupName);

        /// <summary>
        ///     Gets record of what user has played.
        /// </summary>
        Task<GetHasPlayedRecordOutput> GetHasPlayedRecord(ulong xuid, Guid externalProfileId);

        /// <summary>
        ///     Resends Loyalty Reward gifts for given titles.
        /// </summary>
        Task ResendProfileHasPlayedNotification(ulong xuid, Guid externalProfileId, int[] titles);

        /// <summary>
        ///     Sets player CMS override.
        /// </summary>
        Task SetCMSOverride(ulong xuid, string snapshot, string environment, string slot);

        /// <summary>
        ///     Gets player CMS override.
        /// </summary>
        Task<UserManagementService.GetCMSOverrideOutput> GetCMSOverride(ulong xuid);

        /// <summary>
        ///     Gets user details.
        /// </summary>
        Task<GetUserDetailsOutput> GetUserDetails(ulong xuid);

        /// <summary>
        ///     Create a add/remove bulk operation on a user group.
        /// </summary>
        Task<CreateUserGroupBulkOperationOutput> CreateUserGroupBulkOperation(ForzaBulkOperationType operation, int userGroupId, ForzaUserIds[] users);

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

        /// <summary>
        ///     Bans a list of players.
        /// </summary>
        Task<BanUsersV2Output> BanUsersV2(ForzaUserBanParametersV2[] banParameters);

        /// <summary>
        ///     Gets the next ban period for a player based on a ban configuration.
        /// </summary>
        Task<GetNextBanPeriodOutput> GetNextBanPeriod(ulong xuid, Guid pegasusBanConfigurationId);

        /// <summary>
        ///     Gets ban history summaries by xuids.
        /// </summary>
        Task<GetUserBanSummariesOutput> GetUserBanSummaries(ulong[] xuids, int xuidCount);
    }
}
