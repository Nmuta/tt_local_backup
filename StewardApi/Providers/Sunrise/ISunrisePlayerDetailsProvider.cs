using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts;
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
        ///     Get player identity.
        /// </summary>
        Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query);

        /// <summary>
        ///     Get player details.
        /// </summary>
        Task<SunrisePlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Get player details.
        /// </summary>
        Task<SunrisePlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        Task<bool> EnsurePlayerExistsAsync(string gamertag);

        /// <summary>
        ///     Get consoles.
        /// </summary>
        Task<IList<ConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Get profile rollbacks.
        /// </summary>
        Task<IList<SunriseProfileRollback>> GetProfileRollbacksAsync(ulong xuid);

        /// <summary>
        ///     Set console ban status.
        /// </summary>
        Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned);

        /// <summary>
        ///     Get shared console users.
        /// </summary>
        Task<IList<SharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Get user flags.
        /// </summary>
        Task<SunriseUserFlags> GetUserFlagsAsync(ulong xuid);

        /// <summary>
        ///     Set user flags.
        /// </summary>
        Task SetUserFlagsAsync(ulong xuid, SunriseUserFlags userFlags);

        /// <summary>
        ///     Get profile summary.
        /// </summary>
        Task<SunriseProfileSummary> GetProfileSummaryAsync(ulong xuid);

        /// <summary>
        ///     Gets credit updates.
        /// </summary>
        Task<IList<SunriseCreditUpdate>> GetCreditUpdatesAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Ban users.
        /// </summary>
        Task<IList<BanResult>> BanUsersAsync(SunriseBanParameters banParameters, string requesterObjectId);

        /// <summary>
        ///     Get ban summaries.
        /// </summary>
        Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids);

        /// <summary>
        ///     Get user ban history.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid);

        /// <summary>
        ///     Get player notifications.
        /// </summary>
        Task<IList<SunriseNotification>> GetPlayerNotificationsAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Send community message.
        /// </summary>
        Task<IList<MessageSendResult<ulong>>> SendCommunityMessageAsync(IList<ulong> xuids, string message, DateTime expireTimeUtc);

        /// <summary>
        ///     Send community message.
        /// </summary>
        Task<MessageSendResult<int>> SendCommunityMessageAsync(int groupId, string message, DateTime expireTimeUtc);
    }
}
