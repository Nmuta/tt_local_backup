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
        Task SaveKustoQueryAsync(string name, string title, string query);

        /// <summary>
        ///     Saves a Kusto query to table storage.
        /// </summary>
        Task SaveKustoQueryAsync(KustoQuery kustoQuery);

        /// <summary>
        ///     Get the Kusto query by name.
        /// </summary>
        Task<IList<KustoQuery>> GetKustoQueriesAsync();

        /// <summary>
        ///     Replaces a Kusto query.
        /// </summary>
        Task ReplaceKustoQueryAsync(string queryId, KustoQuery query);

        /// <summary>
        ///     Deletes a Kusto query.
        /// </summary>
        Task DeleteKustoQueryAsync(string queryId);
    }
}
