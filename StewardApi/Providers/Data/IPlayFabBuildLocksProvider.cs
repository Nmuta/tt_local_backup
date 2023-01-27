using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
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
        Task<IList<PlayFabBuildLock>> GetMultipleAsync(WoodstockPlayFabEnvironment environment, bool? withActiveLocks = null);

        /// <summary>
        ///     Creates new build lock entry.
        /// </summary>
        Task CreateAsync(PlayFabBuildLock newbuildLock);

        /// <summary>
        ///     Updates build lock entry.
        /// </summary>
        Task UpdateAsync(Guid buildId, PlayFabBuildLockRequest updatedBuildLock);

        /// <summary>
        ///     Deletes build lock entry.
        /// </summary>
        Task DeleteAsync(Guid buildId);
    }
}
