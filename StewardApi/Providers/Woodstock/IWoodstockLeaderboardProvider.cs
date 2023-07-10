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
        Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync(string pegasusEnvironment);
    }
}