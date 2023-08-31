using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Forte;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes methods for CRUD operations on the PlayFabBuildLock Cosmos DB table.
    /// </summary>
    public interface IPlayFabBuildLocksProvider
    {
        /// <summary>
        ///     Gets build lock entry.
        /// </summary>
        Task<PlayFabBuildLock> GetAsync(Guid buildId);

        /// <summary>
        ///     Gets multiple build lock entries based on params.
        /// </summary>
        Task<IList<PlayFabBuildLock>> GetMultipleAsync(WoodstockPlayFabEnvironment environment);

        /// <summary>
        ///     Gets multiple build lock entries based on params.
        /// </summary>
        Task<IList<PlayFabBuildLock>> GetMultipleAsync(FortePlayFabEnvironment environment);

        /// <summary>
        ///     Creates new build lock entry.
        /// </summary>
        Task<PlayFabBuildLock> CreateAsync(PlayFabBuildLock newbuildLock);

        /// <summary>
        ///     Deletes build lock entry.
        /// </summary>
        Task<PlayFabBuildLock> DeleteAsync(WoodstockPlayFabEnvironment environment, Guid buildId);

        /// <summary>
        ///     Deletes build lock entry.
        /// </summary>
        Task<PlayFabBuildLock> DeleteAsync(FortePlayFabEnvironment environment, Guid buildId);
    }
}
