﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Graph;
using PlayFab.MultiplayerModels;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab
{
    /// <summary>
    ///     Exposes methods for interacting with the PlayFab API.
    /// </summary>
    public interface IWoodstockPlayFabService
    {
        /// <summary>
        ///     Gets all available PlayFab builds.
        /// </summary>
        Task<IList<BuildSummary>> GetBuildsAsync(WoodstockPlayFabEnvironment environment);

        /// <summary>
        ///     Gets PlayFab build. Else null if it doesn't exist.
        /// </summary>
        Task<BuildSummary> GetBuildAsync(Guid buildId, WoodstockPlayFabEnvironment environment);
    }
}
