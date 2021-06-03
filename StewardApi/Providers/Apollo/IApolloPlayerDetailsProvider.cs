using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///      Exposes methods for interacting with the Apollo player details.
    /// </summary>
    public interface IApolloPlayerDetailsProvider
    {
        /// <summary>
        ///     Get player identity.
        /// </summary>
        Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query);

        /// <summary>
        ///     Get player details.
        /// </summary>
        Task<ApolloPlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Get player details.
        /// </summary>
        Task<ApolloPlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(string gamertag);

        /// <summary>
        ///     Ban users.
        /// </summary>
        Task<IList<BanResult>> BanUsersAsync(IList<ApolloBanParameters> banParameters, string requesterObjectId);

        /// <summary>
        ///     Get user ban history.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid);

        /// <summary>
        ///     Get user ban summaries.
        /// </summary>
        Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids);

        /// <summary>
        ///     Get consoles.
        /// </summary>
        Task<IList<ConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Set console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned);

        /// <summary>
        ///     Get shared console users.
        /// </summary>
        Task<IList<SharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Get LSP groups.
        /// </summary>
        Task<IList<LspGroup>> GetLspGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Get user flags.
        /// </summary>
        Task<ApolloUserFlags> GetUserFlagsAsync(ulong xuid);

        /// <summary>
        ///     Set user flags.
        /// </summary>
        Task SetUserFlagsAsync(ulong xuid, ApolloUserFlags userFlags);
    }
}
