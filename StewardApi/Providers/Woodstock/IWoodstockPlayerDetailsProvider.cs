using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Forza.LiveOps.FH5.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <summary>
    ///     Exposes methods for interacting with the Woodstock player details.
    /// </summary>
    public interface IWoodstockPlayerDetailsProvider
    {
        /// <summary>
        ///     Gets player identities.
        /// </summary>
        Task<IList<IdentityResultAlpha>> GetPlayerIdentitiesAsync(
            IList<IdentityQueryAlpha> queries,
            string endpoint);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<WoodstockPlayerDetails> GetPlayerDetailsAsync(string gamertag, string endpoint);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<WoodstockPlayerDetails> GetPlayerDetailsAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Ensures player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Ensures player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(string gamertag, string endpoint);

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
        Task<WoodstockUserFlags> GetUserFlagsAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Sets user flags.
        /// </summary>
        Task SetUserFlagsAsync(ulong xuid, WoodstockUserFlags userFlags, string endpoint);

        /// <summary>
        ///     Gets profile summary.
        /// </summary>
        Task<ProfileSummary> GetProfileSummaryAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Gets credit updates.
        /// </summary>
        Task<IList<CreditUpdate>> GetCreditUpdatesAsync(ulong xuid, int startIndex, int maxResults, string endpoint);

        /// <summary>
        ///     Gets backstage pass updates.
        /// </summary>
        Task<IList<BackstagePassUpdate>> GetBackstagePassUpdatesAsync(ulong xuid, string endpoint);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<IList<BanResult>> BanUsersAsync(
            IList<WoodstockBanParameters> banParameters,
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

        /// <summary>
        ///     Gets player notifications.
        /// </summary>
        Task<IList<Notification>> GetPlayerNotificationsAsync(ulong xuid, int maxResults, string endpoint);

        /// <summary>
        ///     Gets user group notifications.
        /// </summary>
        public Task<IList<UserGroupNotification>> GetGroupNotificationsAsync(
            int groupId,
            int maxResults,
            string endpoint);

        /// <summary>
        ///     Sends community message.
        /// </summary>
        Task<IList<MessageSendResult<ulong>>> SendCommunityMessageAsync(
            IList<ulong> xuids,
            string message,
            DateTime expireTimeUtc,
            string endpoint);

        /// <summary>
        ///     Sends community message.
        /// </summary>
        Task<MessageSendResult<int>> SendCommunityMessageAsync(
            int groupId,
            string message,
            DateTime expireTimeUtc,
            DeviceType deviceType,
            string endpoint);
    }
}
