using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes methods for CRUD operations on the PlayFabBuildLock Cosmos DB table.
    /// </summary>
    public interface IPlayFabBuildLocksProvider
    {
        /// <summary>
        ///     Gets all build lock entries.
        /// </summary>
        Task<IList<object>> GetAsync();

        /// <summary>
        ///     Creates new build lock entry.
        /// </summary>
        Task CreateAsync(object newbuildLock);

        /// <summary>
        ///     Updates build lock entry.
        /// </summary>
        Task UpdateAsync(string buildId, object updatedBuildLock);


        /// <summary>
        ///     Deletes build lock entry.
        /// </summary>
        Task DeleteAsync(string buildId);
    }
}
