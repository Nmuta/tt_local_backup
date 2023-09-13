using System;
using System.Threading.Tasks;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.Services.LiveOps.FM8.Generated.ScoreboardManagementService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services
{
    /// <summary>
    ///     Service used to search and manage leaderboard scores.
    /// </summary>
    public interface IScoreboardManagementService
    {
        /// <summary>
        ///     Search leaderboards.
        /// </summary>
        Task<SearchLeaderboardsV2Output> SearchLeaderboardsV2(ForzaSearchLeaderboardsParametersV2 parameters, int startAt, int maxResults);

        /// <summary>
        ///     Delete scores.
        /// </summary>
        Task<DeleteScoresOutput> DeleteScores(Guid[] scoreIds);

        /// <summary>
        ///     Get scores by rank.
        /// </summary>
        Task<GetScoresByRankV2Output> GetScoresByRankV2(string scoreboardType, string scoreType, int trackId, int pivotId, int[] ranks);
    }
}
