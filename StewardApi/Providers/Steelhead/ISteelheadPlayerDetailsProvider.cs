using System;
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
        Task<IList<IdentityResultAlpha>> GetPlayerIdentitiesAsync(IList<IdentityQueryAlpha> queries);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<SteelheadPlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<SteelheadPlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Ensures player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(ulong xuid);

        /// <summary>
        ///     Ensures player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(string gamertag);

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
        ///     Gets user flags.
        /// </summary>
        Task<SteelheadUserFlags> GetUserFlagsAsync(ulong xuid);

        /// <summary>
        ///     Sets user flags.
        /// </summary>
        Task SetUserFlagsAsync(ulong xuid, SteelheadUserFlags userFlags);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<IList<BanResult>> BanUsersAsync(IList<SteelheadBanParameters> banParameters, string requesterObjectId);

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids);

        /// <summary>
        ///     Gets user ban history.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid);

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        Task<IList<PlayerAuction>> GetPlayerAuctionsAsync(ulong xuid, AuctionFilters filters);

        /// <summary>
        ///     Gets player notifications.
        /// </summary>
        Task<IList<Notification>> GetPlayerNotificationsAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Sends a community message.
        /// </summary>
        Task<IList<MessageSendResult<ulong>>> SendCommunityMessageAsync(IList<ulong> xuids, string message, DateTime expireTimeUtc);

        /// <summary>
        ///     Sends a community message.
        /// </summary>
        Task<MessageSendResult<int>> SendCommunityMessageAsync(int groupId, string message, DateTime expireTimeUtc);
    }
}
