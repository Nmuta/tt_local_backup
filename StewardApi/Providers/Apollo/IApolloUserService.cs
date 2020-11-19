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
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="LiveOpsGetUserDataByGamertagOutput"/>.
        /// </returns>
        Task<LiveOpsGetUserDataByGamertagOutput> LiveOpsGetUserDataByGamertagAsync(string gamertag);

        /// <summary>
        ///      Gets user data by xuid.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="LiveOpsGetUserDataByXuidOutput"/>.
        /// </returns>
        Task<LiveOpsGetUserDataByXuidOutput> LiveOpsGetUserDataByXuidAsync(ulong xuid);

        /// <summary>
        ///     Ban users.
        /// </summary>
        /// <param name="banParameters">The ban parameters.</param>
        /// <returns>
        ///     The <see cref="BanUsersOutput"/>.
        /// </returns>
        Task<BanUsersOutput> BanUsersAsync(ForzaUserBanParameters[] banParameters);

        /// <summary>
        ///     Get user ban history.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetUserBanSummariesOutput"/>.
        /// </returns>
        Task<GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Get user ban summaries.
        /// </summary>
        /// <param name="xuids">The xuids.</param>
        /// <param name="xuidCount">The xuid count.</param>
        /// <returns>
        ///     The <see cref="GetUserBanSummariesOutput"/>.
        /// </returns>
        Task<GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids, int xuidCount);

        /// <summary>
        ///     Get consoles.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetConsolesOutput"/>.
        /// </returns>
        Task<GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Set console ban status.
        /// </summary>
        /// <param name="consoleId">The console ID.</param>
        /// <param name="isBanned">A value that indicates whether the console is banned.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned);

        /// <summary>
        ///     Get shared console users.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The <see cref="GetSharedConsoleUsersAsync"/>.
        /// </returns>
        Task<GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Get the under review flag.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GetIsUnderReviewOutput"/>.
        /// </returns>
        Task<GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid);

        /// <summary>
        ///     Set is under review flag.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="isUnderReview">A value that indicates whether a user is under review.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview);
    }
}
