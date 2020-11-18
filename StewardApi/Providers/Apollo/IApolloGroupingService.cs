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
        /// <param name="acceptingClubInvites">A value that determines whether to accept club invites.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task AcceptClubInvitesAsync(bool acceptingClubInvites);

        /// <summary>
        ///     Add user to groups.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="groupIds">The group IDs.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task AddToUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Get user data.
        /// </summary>
        /// <returns>
        ///     The <see cref="GetUserDataOutput"/>.
        /// </returns>
        Task<GetUserDataOutput> GetUserDataAsync();

        /// <summary>
        ///     Get user datas.
        /// </summary>
        /// <param name="xuids">The xuids.</param>
        /// <param name="numberOfUsers">The number of users.</param>
        /// <returns>
        ///     The <see cref="GetUserDatasOutput"/>.
        /// </returns>
        Task<GetUserDatasOutput> GetUserDatasAsync(ulong[] xuids, int numberOfUsers);

        /// <summary>
        ///     Get user group membership.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="groupIdFilter">The group ID filter.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetUserGroupMembershipsOutput"/>.
        /// </returns>
        Task<GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupIdFilter, int maxResults);

        /// <summary>
        ///     Get user groups.
        /// </summary>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetUserGroupsOutput"/>.
        /// </returns>
        Task<GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Remove from user groups.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="groupIds">The group IDs.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///     Report piracy check state.
        /// </summary>
        /// <param name="piracyCheckState">The piracy check state.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task ReportPiracyCheckStateAsync(PiracyCheckState piracyCheckState);

        /// <summary>
        ///     Report piracy check state.
        /// </summary>
        /// <param name="piracyCheckState">The piracy check state.</param>
        /// <param name="dwFailedReads">The failed reads.</param>
        /// <param name="dwFailedHashes">The failed hashes.</param>
        /// <param name="dwBlocksChecked">The blocks checked.</param>
        /// <param name="dwTotalBlocks">The total blocks.</param>
        /// <param name="fComplete">The complete.</param>
        /// <returns>
        ///     The <see cref="ReportPiracyCheckStateExOutput"/>.
        /// </returns>
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
        /// <param name="friendXuids">The friend xuids.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetFriendsAsync(ulong[] friendXuids);
    }
}
