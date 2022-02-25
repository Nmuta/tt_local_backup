using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using static Forza.LiveOps.FH5_main.Generated.AuctionManagementService;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <summary>
    ///     Exposes methods for interacting with the Woodstock Pegasus.
    /// </summary>
    public interface IWoodstockPegasusService
    {
        /// <summary>
        ///     Gets car classes.
        /// </summary>
        Task<IEnumerable<CarClass>> GetCarClassesAsync();

        /// <summary>
        ///     Gets leaderboards.
        /// </summary>
        Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync();
    }
}
