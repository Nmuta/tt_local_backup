using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <summary>
    ///     Exposes methods for interacting with the Steelhead player details.
    /// </summary>
    public interface ISteelheadPlayerDetailsProvider
    {
        /// <summary>
        ///     Gets player identities.
        /// </summary>
        Task<IList<IdentityResultAlpha>> GetPlayerIdentitiesAsync(IList<IdentityQueryAlpha> queries, string endpoint);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<SteelheadPlayerDetails> GetPlayerDetailsAsync(string gamertag, string endpoint);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<SteelheadPlayerDetails> GetPlayerDetailsAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Ensures player exists.
        /// </summary>
        Task<bool> DoesPlayerExistAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Ensures player exists.
        /// </summary>
        Task<bool> DoesPlayerExistAsync(string gamertag, string endpoint);

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
        ///     Bans users.
        /// </summary>
        Task<IList<BanResult>> BanUsersAsync(
            IList<SteelheadBanParameters> banParameters,
            string requesterObjectId,
            string endpoint);

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids, string endpoint);

        /// <summary>
        ///     Gets user ban history.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        Task<IList<PlayerAuction>> GetPlayerAuctionsAsync(ulong xuid, AuctionFilters filters, string endpoint);
    }
}
