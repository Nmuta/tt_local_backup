using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Forza.Scoreboard.FM8.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using ScoreType = Forza.Scoreboard.FM8.Generated.ScoreType;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.V2
{
    /// <summary>
    ///     Exposes methods for interacting with the Steelhead leaderboards.
    /// </summary>
    public interface ISteelheadLeaderboardProvider
    {
        /// <summary>
        ///     Gets leaderboard metadata.
        /// </summary>
        [SuppressMessage("Usage", "VSTHRD103:GetResult synchronously blocks", Justification = "Used in conjunction with Task.WhenAll")]
        public Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync(string pegasusEnvironment);

        /// <summary>
        ///     Gets leaderboard metadata.
        /// </summary>
        public Task<Leaderboard> GetLeaderboardMetadataAsync(
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            string pegasusEnvironment);

        /// <summary>
        ///     Gets leaderboard scores.
        /// </summary>
        public Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            SteelheadProxyBundle service,
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            IEnumerable<DeviceType> deviceTypes,
            int startAt,
            int maxResults);

        /// <summary>
        ///     Gets leaderboard scores.
        /// </summary>
        /// <remarks>Takes a ScoreboardManagementService, making it safe for use in background jobs.</remarks>
        public Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            IScoreboardManagementService scoreboardManagementService,
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            IEnumerable<DeviceType> deviceTypes,
            int startAt,
            int maxResults);

        /// <summary>
        ///     Gets leaderboard scores near user.
        /// </summary>
        public Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            SteelheadProxyBundle service,
            ulong xuid,
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            IEnumerable<DeviceType> deviceTypes,
            int maxResults);

        /// <summary>
        ///     Delete leaderboard scores.
        /// </summary>
        public Task DeleteLeaderboardScoresAsync(SteelheadProxyBundle service, Guid[] scoreIds);
    }
}
