using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.Entitlements;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using CreditUpdate = Turn10.LiveOps.StewardApi.Contracts.Data.CreditUpdate;

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
        Task<IList<JObject>> RunKustoQueryAsync(string query, string dbName);

        /// <summary>
        ///     Gets player purchased entitlements.
        /// </summary>
        Task<IEnumerable<PurchasedEntitlement>> GetPlayerPurchasedEntitlementsAsync(ulong xuid);

        /// <summary>
        ///     Gets player cancelled entitlements.
        /// </summary>
        Task<IEnumerable<CancelledEntitlement>> GetPlayerCancelledEntitlementsAsync(ulong xuid);

        /// <summary>
        ///     Gets player refunded entitlements.
        /// </summary>
        Task<IEnumerable<RefundedEntitlement>> GetPlayerRefundedEntitlementsAsync(ulong xuid);

        /// <summary>
        ///     Gets master inventory item list.
        /// </summary>
        Task<IList<MasterInventoryItem>> GetMasterInventoryListAsync(string kustoQuery);

        /// <summary>
        ///     Gets detailed Kusto car list.
        /// </summary>
        Task<IList<KustoCar>> GetDetailedKustoCarsAsync(string kustoQuery);

        /// <summary>
        ///     Gets the credit rewards.
        /// </summary>
        Task<IList<CreditReward>> GetCreditRewardsAsync(KustoGameDbSupportedTitle supportedTitle);

        /// <summary>
        ///     Gets gift history.
        /// </summary>
        Task<IList<GiftHistory>> GetGiftHistoryAsync(
            string playerId,
            string title,
            string endpoint,
            DateTimeOffset? startDate,
            DateTimeOffset? endDate);

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid, string title, string endpoint);

        /// <summary>
        ///     Gets notification history.
        /// </summary>
        Task<IList<NotificationHistory>> GetNotificationHistoryAsync(string notificationId, string title, string endpoint);

        /// <summary>
        ///     Gets a user's auction log.
        /// </summary>
        Task<IList<AuctionHistoryEntry>> GetAuctionLogAsync(KustoGameDbSupportedTitle title, ulong xuid, DateTime? skipToken = null);

        /// <summary>
        ///     Gets a user's save rollback history.
        /// </summary>
        Task<IList<SaveRollbackHistory>> GetSaveRollbackHistoryAsync(ulong xuid);

        /// <summary>
        ///     Gets a user's credit update history.
        /// </summary>
        Task<IList<CreditUpdate>> GetCreditUpdatesAsync(
            ulong xuid,
            TitleCodeName title,
            SortDirection sortDirection,
            CreditUpdateColumn column,
            int startAt,
            int maxResults);
    }
}