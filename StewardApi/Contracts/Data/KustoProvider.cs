using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Kusto.Data.Common;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.Kusto;
using Turn10.LiveOps.StewardApi.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Data
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
        /// <param name="kustoFactory">The Kusto factory.</param>
        /// <param name="refreshableCacheStore">The refreshable cache store.</param>
        /// <param name="configuration">The configuration.</param>
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
        public async Task<IList<MasterInventoryItem>> GetMasterInventoryList(string kustoQuery)
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
                            Id = reader.GetInt32(0),
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

        /// <inheritdoc />
        public async Task<IList<CreditReward>> GetCreditRewardsAsync(KustoGameDbSupportedTitle supportedTitle)
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

        /// <inheritdoc />
        public async Task<IList<GiftHistory>> GetGiftHistoryAsync(string playerId, string title)
        {
            var query = string.Format(CultureInfo.InvariantCulture, KustoQueries.GetGiftHistory, playerId, title);

            async Task<IList<GiftHistory>> GiftHistories()
            {
                var giftHistories = new List<GiftHistory>();

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(this.telemetryDatabaseName, query, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        giftHistories.Add(new GiftHistory(
                            reader.GetString(0),
                            reader.GetString(1),
                            reader.GetString(2),
                            reader.GetDateTime(3),
                            reader.GetString(4)));
                    }

                    reader.Close();
                }

                return giftHistories;
            }

            return await GiftHistories().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid, string title)
        {
            title.ShouldNotBeNullEmptyOrWhiteSpace(nameof(title));

            var query = string.Format(CultureInfo.InvariantCulture, KustoQueries.GetBanHistory, xuid, title);

            async Task<IList<LiveOpsBanHistory>> BanHistories()
            {
                var banHistories = new List<LiveOpsBanHistory>();

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(this.telemetryDatabaseName, query, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        banHistories.Add(new LiveOpsBanHistory(
                            reader.GetInt64(0),
                            reader.GetString(1),
                            reader.GetString(2),
                            reader.GetDateTime(3),
                            reader.GetDateTime(4),
                            reader.GetString(5),
                            reader.GetString(6),
                            reader.GetString(7)));
                    }

                    reader.Close();
                }

                return banHistories;
            }

            return await BanHistories().ConfigureAwait(false);
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
