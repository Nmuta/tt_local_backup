using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <summary>
    ///     Exposes methods for interacting with the Sunrise player details.
    /// </summary>
    public interface ISunrisePlayerDetailsProvider
    {
        /// <summary>
        ///     Gets player identities.
        /// </summary>
        Task<IList<IdentityResultAlpha>> GetPlayerIdentitiesAsync(IList<IdentityQueryAlpha> queries);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<SunrisePlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        Task<SunrisePlayerDetails> GetPlayerDetailsAsync(ulong xuid);

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
        Task<SunriseUserFlags> GetUserFlagsAsync(ulong xuid);

        /// <summary>
        ///     Sets user flags.
        /// </summary>
        Task SetUserFlagsAsync(ulong xuid, SunriseUserFlags userFlags);

        /// <summary>
        ///     Gets profile summary.
        /// </summary>
        Task<ProfileSummary> GetProfileSummaryAsync(ulong xuid);

        /// <summary>
        ///     Gets credit updates.
        /// </summary>
        Task<IList<CreditUpdate>> GetCreditUpdatesAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Gets backstage pass updates.
        /// </summary>
        Task<IList<BackstagePassUpdate>> GetBackstagePassUpdatesAsync(ulong xuid);

        /// <summary>
        ///     Gets profile notes.
        /// </summary>
        Task<IList<SunriseProfileNote>> GetProfileNotesAsync(ulong xuid);

        /// <summary>
        ///     Adds a profile note.
        /// </summary>
        Task AddProfileNoteAsync(ulong xuid, SunriseProfileNote note);

        /// <summary>
        ///     Bans users.
        /// </summary>
        Task<IList<BanResult>> BanUsersAsync(IList<SunriseBanParameters> banParameters, string requesterObjectId);

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids);

        /// <summary>
        ///     Gets user ban history.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid);

        /// <summary>
        ///     Gets player notifications.
        /// </summary>
        Task<IList<Notification>> GetPlayerNotificationsAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Sends community message.
        /// </summary>
        Task<IList<MessageSendResult<ulong>>> SendCommunityMessageAsync(IList<ulong> xuids, string message, DateTime expireTimeUtc);

        /// <summary>
        ///     Sends community message.
        /// </summary>
        Task<MessageSendResult<int>> SendCommunityMessageAsync(int groupId, string message, DateTime expireTimeUtc);

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        Task<IList<PlayerAuction>> GetPlayerAuctionsAsync(ulong xuid, AuctionFilters filters);
    }
}
