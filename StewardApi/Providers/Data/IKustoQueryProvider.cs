using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes methods for retrieving and creating Kusto Queries.
    /// </summary>
    public interface IKustoQueryProvider
    {
        /// <summary>
        ///     Saves a Kusto query to table storage.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="title">The title.</param>
        /// <param name="query">The query.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SaveKustoQueryAsync(string name, string title, string query);

        /// <summary>
        ///     Saves a Kusto query to table storage.
        /// </summary>
        /// <param name="kustoQuery">The Kusto query.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task SaveKustoQueryAsync(KustoQuery kustoQuery);

        /// <summary>
        ///     Get the Kusto query by name.
        /// </summary>
        /// <returns>
        ///     A <see cref="KustoQuery"/>.
        /// </returns>
        Task<IList<KustoQuery>> GetKustoQueriesAsync();

        /// <summary>
        ///     Replaces a Kusto query.
        /// </summary>
        /// <param name="queryId">The query id.</param>
        /// <param name="query">The new query.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task ReplaceKustoQueryAsync(string queryId, KustoQuery query);

        /// <summary>
        ///     Deletes a Kusto query.
        /// </summary>
        /// <param name="queryId">The query id.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        Task DeleteKustoQueryAsync(string queryId);
    }
}
