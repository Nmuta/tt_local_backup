using System;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.Services.LiveOps.FH5_main.Generated.ScoreboardManagementService;

#pragma warning disable VSTHRD200 // Use Async Suffix

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services
{
    /// <summary>
    ///     Proxy interface for <see cref="ScoreboardManagementService"/>.
    /// </summary>
    public interface IScoreboardManagementService
    {
        /// <summary>
        ///     Search leaderboard scores.
        /// </summary>
        Task<SearchLeaderboardsV2Output> SearchLeaderboardsV2(ForzaSearchLeaderboardsParametersV2 parameters, int startAt, int maxResults);

        /// <summary>
        ///     Deletes leaderboard scores.
        /// </summary>
        Task<DeleteScoresOutput> DeleteScores(Guid[] scoreIds);
    }
}
