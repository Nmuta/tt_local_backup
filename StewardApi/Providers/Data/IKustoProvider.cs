using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Common;
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
        Task<IList<JObject>> RunKustoQuery(string query, string dbName);

        /// <summary>
        ///     Gets master inventory item list.
        /// </summary>
        Task<IList<MasterInventoryItem>> GetMasterInventoryList(string kustoQuery);

        /// <summary>
        ///     Gets the credit rewards.
        /// </summary>
        Task<IList<CreditReward>> GetCreditRewardsAsync(KustoGameDbSupportedTitle supportedTitle);

        /// <summary>
        ///     Gets gift history.
        /// </summary>
        Task<IList<GiftHistory>> GetGiftHistoryAsync(string playerId, string title);

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid, string title);
    }
}