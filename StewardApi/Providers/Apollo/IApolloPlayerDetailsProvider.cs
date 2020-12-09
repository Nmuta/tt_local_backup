using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///      Exposes methods for interacting with the Apollo player details.
    /// </summary>
    public interface IApolloPlayerDetailsProvider
    {
        /// <summary>
        ///     Get player details.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="ApolloPlayerDetails"/>.
        /// </returns>
        Task<ApolloPlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Get player details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="ApolloPlayerDetails"/>.
        /// </returns>
        Task<ApolloPlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     A value indicating if the player exists.
        /// </returns>
        Task<bool> EnsurePlayerExistsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     A value indicating if the player exists.
        /// </returns>
        Task<bool> EnsurePlayerExistsAsync(string gamertag);

        /// <summary>
        ///     Ban users.
        /// </summary>
        /// <param name="banParameters">The ban parameters.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     The list of <see cref="ApolloBanResult"/>.
        /// </returns>
        Task<IList<ApolloBanResult>> BanUsersAsync(IList<ApolloBanParameters> banParameters, string requestingAgent);

        /// <summary>
        ///     Get user ban history.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The list of <see cref="ApolloBanDescription"/>.
        /// </returns>
        Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid);

        /// <summary>
        ///     Get user ban summaries.
        /// </summary>
        /// <param name="xuids">The xuids.</param>
        /// <returns>
        ///     The list of <see cref="ApolloBanSummary"/>.
        /// </returns>
        Task<IList<ApolloBanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids);

        /// <summary>
        ///     Get consoles.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="ApolloConsoleDetails"/>.
        /// </returns>
        Task<IList<ApolloConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults);

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
        ///     The list of <see cref="ApolloSharedConsoleUser"/>.
        /// </returns>
        Task<IList<ApolloSharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Get LSP groups.
        /// </summary>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="ApolloLspGroup"/>.
        /// </returns>
        Task<IList<ApolloLspGroup>> GetLspGroupsAsync(int startIndex, int maxResults);

        /// <summary>
        ///     Get user flags.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="ApolloUserFlags"/>.
        /// </returns>
        Task<ApolloUserFlags> GetUserFlagsAsync(ulong xuid);

        /// <summary>
        ///     Set user flags.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="userFlags">The user flags.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetUserFlagsAsync(ulong xuid, ApolloUserFlags userFlags);
    }
}
