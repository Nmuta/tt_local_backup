using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Forza.Scoreboard.FH5_main.Generated;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <summary>
    ///     Exposes methods for interacting with the Woodstock leaderboards.
    /// </summary>
    public interface IWoodstockLeaderboardProvider
    {
        /// <summary>
        ///     Gets leaderboard metadata.
        /// </summary>
        Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync();

        /// <summary>
        ///     Gets leaderboard scores.
        /// </summary>
        Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(ScoreboardType scoreboardType, ScoreType scoreType, int trackId, string pivotId, int startAt, int maxResults, string endpoint);

        /// <summary>
        ///     Gets leaderboard scores around a player Xuid.
        /// </summary>
        Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(ulong xuid, ScoreboardType scoreboardType, ScoreType scoreType, int trackId, string pivotId, int maxResults, string endpoint);

        /// <summary>
        ///     Deletes the provided score ids;
        /// </summary>
        Task DeleteLeaderboardScoresAsync(Guid[] scoreIds, string endpoint);
    }
}
