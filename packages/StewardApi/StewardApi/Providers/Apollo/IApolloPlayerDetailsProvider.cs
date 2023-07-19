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
        Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query, string endpoint);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<ApolloPlayerDetails> GetPlayerDetailsAsync(string gamertag, string endpoint);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<ApolloPlayerDetails> GetPlayerDetailsAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Ensures player exists.
        /// </summary>
        Task<bool> DoesPlayerExistAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Ensures player exists.
        /// </summary>
        Task<bool> DoesPlayerExistAsync(string gamertag, string endpoint);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<IList<BanResult>> BanUsersAsync(
            IList<ApolloBanParameters> banParameters,
            string requesterObjectId,
            string endpoint);

        /// <summary>
        ///     Expire bans.
        /// </summary>
        Task<UnbanResult> ExpireBanAsync(
            int banEntryId,
            string endpoint);

        /// <summary>
        ///     Delete bans.
        /// </summary>
        Task<UnbanResult> DeleteBanAsync(
            int banEntryId,
            string endpoint);

        /// <summary>
        ///     Gets user ban history.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Gets user ban summaries.
        /// </summary>
        Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids, string endpoint);

        /// <summary>
        ///     Gets consoles.
        /// </summary>
        Task<IList<ConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults, string endpoint);

        /// <summary>
        ///     Sets console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned, string endpoint);

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        Task<IList<SharedConsoleUser>> GetSharedConsoleUsersAsync(
            ulong xuid,
            int startIndex,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Gets user flags.
        /// </summary>
        Task<ApolloUserFlags> GetUserFlagsAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     SetsS user flags.
        /// </summary>
        Task SetUserFlagsAsync(ulong xuid, ApolloUserFlags userFlags, string endpoint);
    }
}
