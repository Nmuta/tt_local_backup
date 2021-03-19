using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes methods for interacting with Kusto.
    /// </summary>
    public interface IKustoProvider
    {
        /// <summary>
        ///     Runs a Kusto query.
        /// </summary>
        /// <param name="query">The query.</param>
        /// <param name="dbName">The database name.</param>
        /// <returns>
        ///     A list of <see cref="JObject"/>.
        /// </returns>
        Task<IList<JObject>> RunKustoQuery(string query, string dbName);

        /// <summary>
        ///     Gets master inventory item list.
        /// </summary>
        /// <param name="kustoQuery">The Kusto query.</param>
        /// <returns>The master inventory items.</returns>
        Task<IList<MasterInventoryItem>> GetMasterInventoryList(string kustoQuery);

        /// <summary>
        ///     Gets the credit rewards.
        /// </summary>
        /// <param name="supportedTitle">The supported title.</param>
        /// <returns>The credit rewards.</returns>
        Task<IList<CreditReward>> GetCreditRewardsAsync(KustoGameDbSupportedTitle supportedTitle);

        /// <summary>
        ///     Gets gift history.
        /// </summary>
        /// <param name="playerId">The player ID.</param>
        /// <param name="title">The title.</param>
        /// <returns>The gift history.</returns>
        Task<IList<GiftHistory>> GetGiftHistoryAsync(string playerId, string title);

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="title">The title.</param>
        /// <returns>The ban history.</returns>
        Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid, string title);
    }
}