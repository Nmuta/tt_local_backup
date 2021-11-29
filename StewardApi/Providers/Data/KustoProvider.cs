using System;
using System.Collections.Generic;
using System.Globalization;
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
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <inheritdoc />
    public sealed class KustoProvider : IKustoProvider
    {
        private const string GameDatabaseName = "T10Analytics";

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
        public async Task<IList<JObject>> RunKustoQuery(string query, string dbName)
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
                        columns.Add(new KustoColumn
                        {
                            ColumnName = schemaReader.GetString(0),
                            Ordinal = schemaReader.GetInt32(1),
                            DataType = schemaReader.GetString(2)
                        });
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
        public async Task<IEnumerable<PurchasedEntitlement>> GetPlayerPurchasedEntitlements(ulong xuid)
        {
            try
            {
                var query = PurchasedEntitlement.MakeQuery(xuid);

                async Task<IList<PurchasedEntitlement>> Entitlements()
                {
                    var entitlements = new List<PurchasedEntitlement>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(GameDatabaseName, query, new ClientRequestProperties())
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
        public async Task<IEnumerable<CancelledEntitlement>> GetPlayerCancelledEntitlements(ulong xuid)
        {
            try
            {
                var query = CancelledEntitlement.MakeQuery(xuid);

                async Task<IList<CancelledEntitlement>> Entitlements()
                {
                    var entitlements = new List<CancelledEntitlement>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(GameDatabaseName, query, new ClientRequestProperties())
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
        public async Task<IEnumerable<RefundedEntitlement>> GetPlayerRefundedEntitlements(ulong xuid)
        {
            try
            {
                var query = RefundedEntitlement.MakeQuery(xuid);

                async Task<IList<RefundedEntitlement>> Entitlements()
                {
                    var entitlements = new List<RefundedEntitlement>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(GameDatabaseName, query, new ClientRequestProperties())
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
        public async Task<IList<MasterInventoryItem>> GetMasterInventoryList(string kustoQuery)
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
                            items.Add(new MasterInventoryItem
                            {
                                Id = (int)reader.GetInt64(0),
                                Description = reader.GetString(1),
                            });
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
        public async Task<IList<KustoCar>> GetDetailedKustoCars(string kustoQuery)
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
                        items.Add(new KustoCar
                        {
                            Id = (int)reader.GetInt64(0),
                            MakeId = (int)reader.GetInt64(1),
                            Make = reader.GetString(2),
                            Model = reader.GetString(3),
                        });
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
                var query = await this.BuildQuery(supportedTitle, KustoQueries.GetCreditRewards).ConfigureAwait(false);

                async Task<IList<CreditReward>> CreditRewards()
                {
                    var creditRewards = new List<CreditReward>();

                    using (var reader = await this.cslQueryProvider
                        .ExecuteQueryAsync(GameDatabaseName, query, new ClientRequestProperties())
                        .ConfigureAwait(false))
                    {
                        while (reader.Read())
                        {
                            creditRewards.Add(new CreditReward
                            {
                                Id = reader.GetInt64(0),
                                Rarity = reader.GetString(1),
                                Amount = reader.GetInt64(2)
                            });
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
        public async Task<IList<GiftHistory>> GetGiftHistoryAsync(string playerId, string title, string endpoint)
        {
            playerId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(playerId));
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var query = GiftHistory.MakeQuery(playerId, title, endpoint);

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

        private async Task<string> BuildQuery(KustoGameDbSupportedTitle supportedTitle, string partialQuery)
        {
            var titleMap = await this.GetTitleMapAsync().ConfigureAwait(false);

            var gameDbName = titleMap.First(title => title.NameInternal == supportedTitle.ToString());

            var query = string.Format(CultureInfo.InvariantCulture, partialQuery, gameDbName.NameExternal);

            return query;
        }

        private async Task<IList<TitleMap>> GetTitleMapAsync()
        {
            async Task<IList<TitleMap>> TitleMaps()
            {
                var titleMap = new List<TitleMap>();

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(GameDatabaseName, KustoQueries.GetTitleMapping, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        titleMap.Add(new TitleMap
                        {
                            TitleId = reader.GetString(0),
                            NameInternal = reader.GetString(1),
                            NameExternal = reader.GetString(2),
                            NameExternalFull = reader.GetString(3)
                        });
                    }

                    reader.Close();
                }

                this.refreshableCacheStore.PutItem(KustoQueries.GetTitleMapping, TimeSpan.FromHours(24), titleMap);

                return titleMap;
            }

            return this.refreshableCacheStore.GetItem<IList<TitleMap>>(KustoQueries.GetTitleMapping)
                   ?? await TitleMaps().ConfigureAwait(false);
        }
    }
}
