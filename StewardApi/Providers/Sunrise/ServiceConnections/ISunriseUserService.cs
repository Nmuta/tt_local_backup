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
        Task SetFriendsAsync(ulong[] friendXuids);

        /// <summary>
        ///      Gets the user data.
        /// </summary>
        Task<GetUserDataOutput> GetUserDataAsync();

        /// <summary>
        ///      Gets the user datas.
        /// </summary>
        Task<GetUserDatasOutput> GetUserDatasAsync(ulong[] xuids, int numberOfUsers);

        /// <summary>
        ///      Reports the piracy check state.
        /// </summary>
        Task ReportPiracyCheckStateAsync(PiracyCheckState piracyCheckState);

        /// <summary>
        ///     Reports the piracy check state Ex.
        /// </summary>
        Task<ReportPiracyCheckStateExOutput> ReportPiracyCheckStateExAsync(PiracyCheckState piracyCheckState, uint dwFailedReads, uint dwFailedHashes, uint dwBlocksChecked, uint dwTotalBlocks, bool fComplete);

        /// <summary>
        ///      Gets live ops user data by xuid.
        /// </summary>
        Task<GetLiveOpsUserDataByXuidOutput> GetLiveOpsUserDataByXuidAsync(ulong xuid);

        /// <summary>
        ///     Gets the live ops user data by gamerTag.
        /// </summary>
        Task<GetLiveOpsUserDataByGamerTagOutput> GetLiveOpsUserDataByGamerTagAsync(string gamertag);

        /// <summary>
        ///     Gets the LSP user groups.
        /// </summary>
        Task<GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Gets the consoles.
        /// </summary>
        Task<GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        Task<GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Sets the console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned);

        /// <summary>
        ///     Gets credit update entries.
        /// </summary>
        Task<GetCreditUpdateEntriesOutput> GetCreditUpdateEntriesAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Gets profile summary.
        /// </summary>
        Task<GetProfileSummaryOutput> GetProfileSummaryAsync(ulong xuid);

        /// <summary>
        ///    Set is under review flag.
        /// </summary>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview);

        /// <summary>
        ///    Get the under review flag.
        /// </summary>
        Task<GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid);

        /// <summary>
        ///    Get the user group memberships.
        /// </summary>
        Task<GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupIdFilter, int maxResults);

        /// <summary>
        ///    Add to user groups.
        /// </summary>
        Task AddToUserGroupsAsync(ulong xuid, int[] groupIds);

        /// <summary>
        ///    Remove from user groups.
        /// </summary>
        Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds);
    }
}
