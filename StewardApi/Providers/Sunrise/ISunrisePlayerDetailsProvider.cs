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
        /// <param name="query">The query.</param>
        /// <returns>
        ///     The <see cref="IdentityResultAlpha"/>.
        /// </returns>
        Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query);

        /// <summary>
        ///     Get player details.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerDetails"/>.
        /// </returns>
        Task<SunrisePlayerDetails> GetPlayerDetailsAsync(string gamertag);

        /// <summary>
        ///     Get player details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerDetails"/>.
        /// </returns>
        Task<SunrisePlayerDetails> GetPlayerDetailsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     A value indicating whether the player exists.
        /// </returns>
        Task<bool> EnsurePlayerExistsAsync(ulong xuid);

        /// <summary>
        ///     Ensure player exists.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     A value indicating whether the player exists.
        /// </returns>
        Task<bool> EnsurePlayerExistsAsync(string gamertag);

        /// <summary>
        ///     Get consoles.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="SunriseConsoleDetails"/>.
        /// </returns>
        Task<IList<SunriseConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults);

        /// <summary>
        ///     Set console ban status.
        /// </summary>
        /// <param name="consoleId">The console ID.</param>
        /// <param name="isBanned">A value indicating whether the console is banned.</param>
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
        ///     The list of <see cref="SunriseSharedConsoleUser"/>.
        /// </returns>
        Task<IList<SunriseSharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Get user flags.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunriseUserFlags"/>.
        /// </returns>
        Task<SunriseUserFlags> GetUserFlagsAsync(ulong xuid);

        /// <summary>
        ///     Set user flags.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="userFlags">The user flags.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SetUserFlagsAsync(ulong xuid, SunriseUserFlags userFlags);

        /// <summary>
        ///     Get profile summary.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunriseProfileSummary"/>.
        /// </returns>
        Task<SunriseProfileSummary> GetProfileSummaryAsync(ulong xuid);

        /// <summary>
        ///     Gets credit updates.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="SunriseCreditUpdate"/>.
        /// </returns>
        Task<IList<SunriseCreditUpdate>> GetCreditUpdatesAsync(ulong xuid, int startIndex, int maxResults);

        /// <summary>
        ///     Ban users.
        /// </summary>
        /// <param name="banParameters">The ban parameters.</param>
        /// <param name="requestingAgent">The requesting agent.</param>
        /// <returns>
        ///     The list of <see cref="SunriseBanResult"/>.
        /// </returns>
        Task<IList<SunriseBanResult>> BanUsersAsync(SunriseBanParameters banParameters, string requestingAgent);

        /// <summary>
        ///     Get ban summaries.
        /// </summary>
        /// <param name="xuids">The xuids.</param>
        /// <returns>
        ///     The list of <see cref="SunriseBanSummary"/>.
        /// </returns>
        Task<IList<SunriseBanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids);

        /// <summary>
        ///     Get user ban history.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The list of <see cref="LiveOpsBanHistory"/>.
        /// </returns>
        Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid);

        /// <summary>
        ///     Get user ban history.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The list of <see cref="SunriseBanDescription"/>.
        /// </returns>
        Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(string gamertag);

        /// <summary>
        ///     Get player notifications.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The  list of <see cref="SunriseNotification"/>.
        /// </returns>
        Task<IList<SunriseNotification>> GetPlayerNotificationsAsync(ulong xuid, int maxResults);
    }
}
