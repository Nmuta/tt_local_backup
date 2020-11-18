using System.Threading.Tasks;
using Xls.FH4.master.Generated;
using static Xls.WebServices.FH4.master.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for interacting with the Sunrise User Service.
    /// </summary>
    public interface ISunriseUserService
    {
        /// <summary>
        ///    Sets friends.
        /// </summary>
        /// <param name="friendXuids">The friend xuid.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetFriendsAsync(ulong[] friendXuids);

        /// <summary>
        ///      Gets the user data.
        /// </summary>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task<GetUserDataOutput> GetUserDataAsync();

        /// <summary>
        ///      Gets the user datas.
        /// </summary>
        /// <param name="xuids">The xuid.</param>
        /// <param name="numberOfUsers">The number of users.</param>
        /// <returns>
        ///     The <see cref="GetUserDatasOutput"/>.
        /// </returns>
        Task<GetUserDatasOutput> GetUserDatasAsync(ulong[] xuids, int numberOfUsers);

        /// <summary>
        ///      Reports the piracy check state.
        /// </summary>
        /// <param name="piracyCheckState">The piracy check state.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task ReportPiracyCheckStateAsync(PiracyCheckState piracyCheckState);

        /// <summary>
        ///     Reports the piracy check state Ex.
        /// </summary>
        /// <param name="piracyCheckState">The piracy check state.</param>
        /// <param name="dwFailedReads">The dw failed reads.</param>
        /// <param name="dwFailedHashes">The dw failed hashes.</param>
        /// <param name="dwBlocksChecked">The dw blocks checked.</param>
        /// <param name="dwTotalBlocks">The dw total blocks.</param>
        /// <param name="fComplete">the f complete.</param>
        /// <returns>
        ///     The <see cref="ReportPiracyCheckStateExOutput"/>.
        /// </returns>
        Task<ReportPiracyCheckStateExOutput> ReportPiracyCheckStateExAsync(PiracyCheckState piracyCheckState, uint dwFailedReads, uint dwFailedHashes, uint dwBlocksChecked, uint dwTotalBlocks, bool fComplete);

        /// <summary>
        ///      Gets live ops user data by xuid.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GetLiveOpsUserDataByXuidOutput"/>.
        /// </returns>
        Task<GetLiveOpsUserDataByXuidOutput> GetLiveOpsUserDataByXuidAsync(ulong xuid);

        /// <summary>
        ///     Gets the live ops user data by gamerTag.
        /// </summary>
        /// <param name="gamertag">The gamerTag.</param>
        /// <returns>
        ///     The <see cref="GetLiveOpsUserDataByGamerTagOutput"/>.
        /// </returns>
        Task<GetLiveOpsUserDataByGamerTagOutput> GetLiveOpsUserDataByGamerTagAsync(string gamertag);

        /// <summary>
        ///     Gets the LSP user groups.
        /// </summary>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetUserGroupsOutput"/>.
        /// </returns>
        Task<GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Gets the consoles.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetConsolesOutput"/>.
        /// </returns>
        Task<GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetSharedConsoleUsersOutput"/>.
        /// </returns>
        Task<GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Sets the console ban status.
        /// </summary>
        /// <param name="consoleId">The console id.</param>
        /// <param name="isBanned">A value indicating whether the console is banned.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned);

        /// <summary>
        ///     Gets credit update entries.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetCreditUpdateEntriesOutput"/>.
        /// </returns>
        Task<GetCreditUpdateEntriesOutput> GetCreditUpdateEntriesAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Gets profile summary.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GetProfileSummaryOutput"/>.
        /// </returns>
        Task<GetProfileSummaryOutput> GetProfileSummaryAsync(ulong xuid);

        /// <summary>
        ///    Set is under review flag.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="isUnderReview">A value indicating whether the user is under review.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview);

        /// <summary>
        ///    Get the under review flag.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GetIsUnderReviewOutput"/>.
        /// </returns>
        Task<GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid);

        /// <summary>
        ///    Get the user group memberships.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="groupIdFilter">The group ID filter.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetUserGroupMembershipsOutput"/>.
        /// </returns>
        Task<GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupIdFilter, int maxResults);

        /// <summary>
        ///    Add to user groups.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="groupIds">The group IDs.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task AddToUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///    Remove from user groups.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="groupIds">The group IDs.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds);
    }
}
