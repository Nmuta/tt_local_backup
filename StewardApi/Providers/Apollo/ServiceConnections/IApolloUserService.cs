using System.Threading.Tasks;
using Forza.WebServices.FM7.Generated;
using static Forza.WebServices.FM7.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///      Exposes methods for interacting with the Apollo User Service.
    /// </summary>
    public interface IApolloUserService
    {
        /// <summary>
        ///      Gets user data by gamertag.
        /// </summary>
        Task<LiveOpsGetUserDataByGamertagOutput> LiveOpsGetUserDataByGamertagAsync(string gamertag);

        /// <summary>
        ///      Gets user data by xuid.
        /// </summary>
        Task<LiveOpsGetUserDataByXuidOutput> LiveOpsGetUserDataByXuidAsync(ulong xuid);

        /// <summary>
        ///     Ban users.
        /// </summary>
        Task<BanUsersOutput> BanUsersAsync(ForzaUserBanParameters[] banParameters);

        /// <summary>
        ///     Get user ban history.
        /// </summary>
        Task<GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Get user ban summaries.
        /// </summary>
        Task<GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids, int xuidCount);

        /// <summary>
        ///     Get consoles.
        /// </summary>
        Task<GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Set console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned);

        /// <summary>
        ///     Get shared console users.
        /// </summary>
        Task<GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Get the under review flag.
        /// </summary>
        Task<GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid);

        /// <summary>
        ///     Set is under review flag.
        /// </summary>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview);
    }
}
