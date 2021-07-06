using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///     Exposes methods for interacting with the Apollo player details.
    /// </summary>
    public interface IApolloPlayerDetailsProvider
    {
        /// <summary>
        ///     Gets player identity.
        /// </summary>
        Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<ApolloPlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<ApolloPlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Ensures player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(ulong xuid);

        /// <summary>
        ///     Ensures player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(string gamertag);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<IList<BanResult>> BanUsersAsync(IList<ApolloBanParameters> banParameters, string requesterObjectId);

        /// <summary>
        ///     Gets user ban history.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid);

        /// <summary>
        ///     Gets user ban summaries.
        /// </summary>
        Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids);

        /// <summary>
        ///     Gets consoles.
        /// </summary>
        Task<IList<ConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Sets console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned);

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        Task<IList<SharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Gets LSP groups.
        /// </summary>
        Task<IList<LspGroup>> GetLspGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Gets user flags.
        /// </summary>
        Task<ApolloUserFlags> GetUserFlagsAsync(ulong xuid);

        /// <summary>
        ///     SetsS user flags.
        /// </summary>
        Task SetUserFlagsAsync(ulong xuid, ApolloUserFlags userFlags);
    }
}
