using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.Entitlements;
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
        ///     Gets player purchased entitlements.
        /// </summary>
        Task<IEnumerable<PurchasedEntitlement>> GetPlayerPurchasedEntitlements(ulong xuid);

        /// <summary>
        ///     Gets player cancelled entitlements.
        /// </summary>
        Task<IEnumerable<CancelledEntitlement>> GetPlayerCancelledEntitlements(ulong xuid);

        /// <summary>
        ///     Gets player refunded entitlements.
        /// </summary>
        Task<IEnumerable<RefundedEntitlement>> GetPlayerRefundedEntitlements(ulong xuid);

        /// <summary>
        ///     Gets master inventory item list.
        /// </summary>
        Task<IList<MasterInventoryItem>> GetMasterInventoryList(string kustoQuery);

        /// <summary>
        ///     Gets detailed Kusto car list.
        /// </summary>
        Task<IList<KustoCar>> GetDetailedKustoCars(string kustoQuery);

        /// <summary>
        ///     Gets the credit rewards.
        /// </summary>
        Task<IList<CreditReward>> GetCreditRewardsAsync(KustoGameDbSupportedTitle supportedTitle);

        /// <summary>
        ///     Gets gift history.
        /// </summary>
        Task<IList<GiftHistory>> GetGiftHistoryAsync(string playerId, string title, string endpoint);

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid, string title, string endpoint);

        /// <summary>
        ///     Gets a user's auction log.
        /// </summary>
        Task<IList<AuctionHistoryEntry>> GetAuctionLogAsync(KustoGameDbSupportedTitle title, ulong xuid, DateTime? skipToken = null);
    }
}