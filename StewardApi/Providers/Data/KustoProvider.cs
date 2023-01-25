using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kusto.Data.Common;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.Entitlements;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using CreditUpdate = Turn10.LiveOps.StewardApi.Contracts.Data.CreditUpdate;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <inheritdoc />
    public sealed class KustoProvider : IKustoProvider
    {
        private const string GameDatabaseName = "T10Analytics";
        private const string LiveOpsDatabaseName = "Live Ops Tools Prod";

        private readonly ICslQueryProvider cslQueryProvider;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly string telemetryDatabaseName;

        /// <summary>
        ///     Initializes a new instance of the <see cref="KustoProvider"/> class.
        /// </summary>
        public KustoProvider(IKustoFactory kustoFactory, IRefreshableCacheStore refreshableCacheStore, IConfiguration configuration)
        {
            kustoFactory.ShouldNotBeNull(nameof(kustoFactory));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.GetSection("KustoLoggerConfiguration").ShouldNotBeNull("KustoLoggerConfiguration");

            this.telemetryDatabaseName = configuration[ConfigurationKeyConstants.KustoLoggerDatabase];
            this.cslQueryProvider = kustoFactory.CreateCslQueryProvider();
            this.refreshableCacheStore = refreshableCacheStore;
        }

        /// <inheritdoc />
        public async Task<IList<JObject>> RunKustoQueryAsync(string query, string dbName)
        {
            var items = new List<JObject>();
            var columns = new List<KustoColumn>();

            try
            {
                using (var schemaReader = await this.cslQueryProvider
                    .ExecuteQueryAsync(dbName, query + "| getschema", new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (schemaReader.Read())
                    {
                        columns.Add(KustoColumn.FromQueryResult(schemaReader));
                    }
                }

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(dbName, query, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        var item = new JObject();
                        foreach (var column in columns)
                        {
                            column.ReadValue(item, reader);
                        }

                        items.Add(item);
                    }

                    reader.Close();
                }

                return items;
            }
            catch (Exception ex)
            {
                if (ex is StewardBaseException)
                {
                    throw;
                }

                throw new QueryFailedStewardException("Kusto Query failed.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<PurchasedEntitlement>> GetPlayerPurchasedEntitlementsAsync(ulong xuid)
        {
            try
            {
                var query = PurchasedEntitlement.MakeQuery(xuid);

                async Task<IList<PurchasedEntitlement>> Entitlements()
                {
                    var entitlements = new List<PurchasedEntitlement>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(LiveOpsDatabaseName, query, new ClientRequestProperties())
                        .ConfigureAwait(false))
                    {
                        while (reader.Read())
                        {
                            entitlements.Add(PurchasedEntitlement.FromQueryResult(reader));
                        }

                        reader.Close();
                    }

                    this.refreshableCacheStore.PutItem(query, TimeSpan.FromMinutes(5), entitlements);

                    return entitlements;
                }

                return this.refreshableCacheStore.GetItem<IList<PurchasedEntitlement>>(query)
                       ?? await Entitlements().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new QueryFailedStewardException($"Get purchased entitlements query failed for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<CancelledEntitlement>> GetPlayerCancelledEntitlementsAsync(ulong xuid)
        {
            try
            {
                var query = CancelledEntitlement.MakeQuery(xuid);

                async Task<IList<CancelledEntitlement>> Entitlements()
                {
                    var entitlements = new List<CancelledEntitlement>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(LiveOpsDatabaseName, query, new ClientRequestProperties())
                        .ConfigureAwait(false))
                    {
                        while (reader.Read())
                        {
                            entitlements.Add(CancelledEntitlement.FromQueryResult(reader));
                        }

                        reader.Close();
                    }

                    this.refreshableCacheStore.PutItem(query, TimeSpan.FromMinutes(5), entitlements);

                    return entitlements;
                }

                return this.refreshableCacheStore.GetItem<IList<CancelledEntitlement>>(query)
                       ?? await Entitlements().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new QueryFailedStewardException($"Get cancelled entitlements query failed for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<RefundedEntitlement>> GetPlayerRefundedEntitlementsAsync(ulong xuid)
        {
            try
            {
                var query = RefundedEntitlement.MakeQuery(xuid);

                async Task<IList<RefundedEntitlement>> Entitlements()
                {
                    var entitlements = new List<RefundedEntitlement>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(LiveOpsDatabaseName, query, new ClientRequestProperties())
                        .ConfigureAwait(false))
                    {
                        while (reader.Read())
                        {
                            entitlements.Add(RefundedEntitlement.FromQueryResult(reader));
                        }

                        reader.Close();
                    }

                    this.refreshableCacheStore.PutItem(query, TimeSpan.FromMinutes(5), entitlements);

                    return entitlements;
                }

                return this.refreshableCacheStore.GetItem<IList<RefundedEntitlement>>(query)
                       ?? await Entitlements().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new QueryFailedStewardException($"Get refunded entitlements query failed for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<MasterInventoryItem>> GetMasterInventoryListAsync(string kustoQuery)
        {
            try
            {
                async Task<IList<MasterInventoryItem>> MasterInventoryItems()
                {
                    var items = new List<MasterInventoryItem>();

                    using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(GameDatabaseName, kustoQuery, new ClientRequestProperties())
                    .ConfigureAwait(false))
                    {
                        while (reader.Read())
                        {
                            items.Add(MasterInventoryItem.FromQueryResult(reader));
                        }

                        reader.Close();
                    }

                    this.refreshableCacheStore.PutItem(kustoQuery, TimeSpan.FromHours(24), items);

                    return items;
                }

                return this.refreshableCacheStore.GetItem<IList<MasterInventoryItem>>(kustoQuery)
                       ?? await MasterInventoryItems().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException("Failed to find Master Inventory List.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<KustoCar>> GetDetailedKustoCarsAsync(string kustoQuery)
        {
            if (!KustoQueries.AllowedDetailedKustoCarQueries.Contains(kustoQuery))
            {
                throw new InvalidArgumentsStewardException("Provided query is an invalid GetDetailedKustoCars query.");
            }

            async Task<IList<KustoCar>> KustoCars()
            {
                var items = new List<KustoCar>();

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(GameDatabaseName, kustoQuery, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        items.Add(KustoCar.FromQueryResult(reader));
                    }

                    reader.Close();
                }

                this.refreshableCacheStore.PutItem(kustoQuery, TimeSpan.FromHours(24), items);

                return items;
            }

            return this.refreshableCacheStore.GetItem<IList<KustoCar>>(kustoQuery)
                   ?? await KustoCars().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IList<CreditReward>> GetCreditRewardsAsync(KustoGameDbSupportedTitle supportedTitle)
        {
            try
            {
                var gameDbName = await this.GetGameDbNameAsync(supportedTitle).ConfigureAwait(false);
                var query = CreditReward.MakeQuery(gameDbName);

                async Task<IList<CreditReward>> CreditRewards()
                {
                    var creditRewards = new List<CreditReward>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(GameDatabaseName, query, new ClientRequestProperties())
                        .ConfigureAwait(false))
                    {
                        while (reader.Read())
                        {
                            creditRewards.Add(CreditReward.FromQueryResult(reader));
                        }

                        reader.Close();
                    }

                    this.refreshableCacheStore.PutItem(query, TimeSpan.FromHours(24), creditRewards);

                    return creditRewards;
                }

                return this.refreshableCacheStore.GetItem<IList<CreditReward>>(query)
                       ?? await CreditRewards().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No credit rewards found for Title: {supportedTitle}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<GiftHistory>> GetGiftHistoryAsync(
            string playerId,
            string title,
            string endpoint,
            DateTimeOffset? startDate,
            DateTimeOffset? endDate)
        {
            playerId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(playerId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                string query;
                if (endpoint == WoodstockEndpoint.GetEndpoint(nameof(WoodstockEndpoint.Retail)))
                {
                    const string oldEndpoint = "https://gameservices.fh5.forzamotorsport.net/Services/o.xtsw";
                    query = GiftHistory.MakeQuery(playerId, title, endpoint, oldEndpoint, startDate, endDate);
                }
                else
                {
                    query = GiftHistory.MakeQuery(playerId, title, endpoint, null, startDate, endDate);
                }

                async Task<IList<GiftHistory>> GiftHistories()
                {
                    var giftHistories = new List<GiftHistory>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(this.telemetryDatabaseName, query, new ClientRequestProperties())
                        .ConfigureAwait(false))
                    {
                        while (reader.Read())
                        {
                            giftHistories.Add(GiftHistory.FromQueryResult(reader));
                        }

                        reader.Close();
                    }

                    return giftHistories;
                }

                return await GiftHistories().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new QueryFailedStewardException($"Gift history query on ID: {playerId} in Title: {title}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid, string title, string endpoint)
        {
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var query = LiveOpsBanHistory.MakeQuery(xuid, title, endpoint);

                async Task<IList<LiveOpsBanHistory>> BanHistories()
                {
                    var banHistories = new List<LiveOpsBanHistory>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(this.telemetryDatabaseName, query, new ClientRequestProperties())
                        .ConfigureAwait(false))
                    {
                        while (reader.Read())
                        {
                            banHistories.Add(LiveOpsBanHistory.FromQueryResult(reader));
                        }

                        reader.Close();
                    }

                    return banHistories;
                }

                return await BanHistories().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No ban history found for XUID: {xuid} with Title: {title} and Endpoint: {endpoint}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<NotificationHistory>> GetNotificationHistoryAsync(string notificationId, string title, string endpoint)
        {
            notificationId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(notificationId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var query = NotificationHistory.MakeQuery(notificationId, title, endpoint);

                async Task<IList<NotificationHistory>> NotificationHistories()
                {
                    var notificationHistories = new List<NotificationHistory>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(this.telemetryDatabaseName, query, new ClientRequestProperties())
                        .ConfigureAwait(false))
                    {
                        while (reader.Read())
                        {
                            notificationHistories.Add(NotificationHistory.FromQueryResult(reader));
                        }

                        reader.Close();
                    }

                    return notificationHistories;
                }

                return await NotificationHistories().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new QueryFailedStewardException($"No notification history found for notificationID: {notificationId} with Title: {title} and Endpoint: {endpoint}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<AuctionHistoryEntry>> GetAuctionLogAsync(KustoGameDbSupportedTitle title, ulong xuid, DateTime? skipToken = null)
        {
            var query = AuctionHistoryEntry.MakeQuery(title, xuid, skipToken);
            try
            {
                var auctionHistory = new List<AuctionHistoryEntry>();

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(this.telemetryDatabaseName, query, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        auctionHistory.Add(AuctionHistoryEntry.FromQueryResult(reader));
                    }

                    reader.Close();
                }

                return auctionHistory;
            }
            catch (Exception ex)
            {
                throw new QueryFailedStewardException($"Auction history lookup failed on xuid: {xuid}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SaveRollbackHistory>> GetSaveRollbackHistoryAsync(ulong xuid)
        {
            try
            {
                var query = SaveRollbackHistory.MakeQuery(xuid);

                async Task<IList<SaveRollbackHistory>> SaveRollbackHistories()
                {
                    var saveRollbackHistories = new List<SaveRollbackHistory>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(this.telemetryDatabaseName, query, new ClientRequestProperties())
                        .ConfigureAwait(false))
                    {
                        while (reader.Read())
                        {
                            var saveRollback = SaveRollbackHistory.FromQueryResult(reader);
                            // Only add the successful save rollback
                            if (saveRollback.ResultCode == 1)
                            {
                                saveRollbackHistories.Add(saveRollback);
                            }
                        }

                        reader.Close();
                    }

                    return saveRollbackHistories;
                }

                return await SaveRollbackHistories().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new QueryFailedStewardException($"Failed to query rollback history for XUID: {xuid}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<CreditUpdate>> GetCreditUpdatesAsync(
            ulong xuid,
            TitleCodeName title,
            SortDirection sortDirection,
            CreditUpdateColumn column,
            int startAt,
            int maxResults)
        {
            var databaseName = $"Prod {title} Telemetry";

            try
            {
                var query = CreditUpdate.MakeQuery(xuid, title, column, sortDirection);

                async Task<IList<CreditUpdate>> GetCreditUpdates()
                {
                    var creditUpdates = new List<CreditUpdate>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(databaseName, query, new ClientRequestProperties())
                        .ConfigureAwait(false))
                    {
                        while (startAt > 0 && reader.Read())
                        {
                            startAt--;
                        }

                        while (creditUpdates.Count != maxResults && reader.Read())
                        {
                            var creditUpdate = CreditUpdate.FromQueryResult(reader);
                            creditUpdates.Add(creditUpdate);
                        }

                        reader.Close();
                    }

                    return creditUpdates;
                }

                return await GetCreditUpdates().ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new QueryFailedStewardException($"Failed to query credit updates. (XUID: {xuid}) (Title: {title})", ex);
            }
        }

        private async Task<string> GetGameDbNameAsync(KustoGameDbSupportedTitle supportedTitle)
        {
            var titleMap = await this.GetTitleMapAsync().ConfigureAwait(false);
            var gameDb = titleMap.First(title => title.NameInternal == supportedTitle.ToString());

            return gameDb.NameExternal;
        }

        private async Task<IList<TitleMap>> GetTitleMapAsync()
        {
            async Task<IList<TitleMap>> TitleMaps()
            {
                var titleMap = new List<TitleMap>();

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(GameDatabaseName, TitleMap.Query, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        titleMap.Add(TitleMap.FromQueryResult(reader));
                    }

                    reader.Close();
                }

                this.refreshableCacheStore.PutItem(TitleMap.Query, TimeSpan.FromHours(24), titleMap);

                return titleMap;
            }

            return this.refreshableCacheStore.GetItem<IList<TitleMap>>(TitleMap.Query)
                   ?? await TitleMaps().ConfigureAwait(false);
        }
    }
}
