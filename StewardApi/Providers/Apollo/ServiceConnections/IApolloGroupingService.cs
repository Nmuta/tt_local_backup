using System.Threading.Tasks;
using Xls.FM7.Generated;
using static Xls.WebServices.FM7.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///      Exposes methods for interacting with the Apollo Grouping Service.
    /// </summary>
    public interface IApolloGroupingService
    {
        /// <summary>
        ///     Accept club invites.
        /// </summary>
        Task AcceptClubInvitesAsync(bool acceptingClubInvites);

        /// <summary>
        ///     Add user to groups.
        /// </summary>
        Task AddToUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Get user data.
        /// </summary>
        Task<GetUserDataOutput> GetUserDataAsync();

        /// <summary>
        ///     Get user datas.
        /// </summary>
        Task<GetUserDatasOutput> GetUserDatasAsync(ulong[] xuids, int numberOfUsers);

        /// <summary>
        ///     Get user group membership.
        /// </summary>
        Task<GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupIdFilter, int maxResults);

        /// <summary>
        ///     Get user groups.
        /// </summary>
        Task<GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Remove from user groups.
        /// </summary>
        Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Report piracy check state.
        /// </summary>
        Task ReportPiracyCheckStateAsync(PiracyCheckState piracyCheckState);

        /// <summary>
        ///     Report piracy check state.
        /// </summary>
        Task<ReportPiracyCheckStateExOutput> ReportPiracyCheckStateExAsync(
                                                                           PiracyCheckState piracyCheckState,
                                                                           uint dwFailedReads,
                                                                           uint dwFailedHashes,
                                                                           uint dwBlocksChecked,
                                                                           uint dwTotalBlocks,
                                                                           bool fComplete);

        /// <summary>
        ///     Set friends.
        /// </summary>
        Task SetFriendsAsync(ulong[] friendXuids);
    }
}
