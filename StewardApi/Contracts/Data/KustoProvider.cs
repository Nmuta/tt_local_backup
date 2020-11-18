using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Kusto.Data.Common;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.Kusto;

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
        public async Task<IList<CarHorn>> GetCarHornsAsync(KustoGameDbSupportedTitle supportedTitle)
        {
            var query = await this.BuildQuery(supportedTitle, KustoQueries.GetCarHorns).ConfigureAwait(false);

            async Task<IList<CarHorn>> CarHorns()
            {
                var horns = new List<CarHorn>();

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(GameDatabaseName, query, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        horns.Add(new CarHorn
                        {
                            Id = reader.GetInt64(0),
                            Category = reader.GetInt64(1),
                            DisplayName = reader.GetString(2),
                            Rarity = reader.GetString(2)
                        });
                    }

                    reader.Close();
                }

                this.refreshableCacheStore.PutItem(query, TimeSpan.FromHours(24), horns);

                return horns;
            }

            return this.refreshableCacheStore.GetItem<IList<CarHorn>>(query)
                   ?? await CarHorns().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IList<ForzaCar>> GetCarsAsync(KustoGameDbSupportedTitle supportedTitle)
        {
            var query = await this.BuildQuery(supportedTitle, KustoQueries.GetCars).ConfigureAwait(false);

            async Task<IList<ForzaCar>> ForzaCars()
            {
                var cars = new List<ForzaCar>();

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(GameDatabaseName, query, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        cars.Add(new ForzaCar
                        {
                            Id = reader.GetInt64(0),
                            DisplayName = reader.GetString(1),
                            MediaName = reader.GetString(2),
                            ModelShort = reader.GetString(3),
                            MakeDisplayName = reader.GetString(4)
                        });
                    }

                    reader.Close();
                }

                this.refreshableCacheStore.PutItem(query, TimeSpan.FromHours(24), cars);

                return cars;
            }

            return this.refreshableCacheStore.GetItem<IList<ForzaCar>>(query)
                   ?? await ForzaCars().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IList<CharacterCustomization>> GetCharacterCustomizationsAsync(KustoGameDbSupportedTitle supportedTitle)
        {
            var query = await this.BuildQuery(supportedTitle, KustoQueries.GetCharacterCustomizations).ConfigureAwait(false);

            async Task<IList<CharacterCustomization>> CharacterCustomizations()
            {
                var characterCustomizations = new List<CharacterCustomization>();

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(GameDatabaseName, query, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        characterCustomizations.Add(new CharacterCustomization
                        {
                            Id = reader.GetInt64(0),
                            ItemId = reader.GetString(1),
                            Rarity = reader.GetString(2),
                            SlotId = reader.GetString(3),
                            DisplayName = reader.GetString(4)
                        });
                    }

                    reader.Close();
                }

                this.refreshableCacheStore.PutItem(query, TimeSpan.FromHours(24), characterCustomizations);

                return characterCustomizations;
            }

            return this.refreshableCacheStore.GetItem<IList<CharacterCustomization>>(query)
                   ?? await CharacterCustomizations().ConfigureAwait(false);
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
        public async Task<IList<Emote>> GetEmotesAsync(KustoGameDbSupportedTitle supportedTitle)
        {
            var query = await this.BuildQuery(supportedTitle, KustoQueries.GetEmotes).ConfigureAwait(false);

            async Task<IList<Emote>> Emotes()
            {
                var emotes = new List<Emote>();

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(GameDatabaseName, query, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        emotes.Add(new Emote
                        {
                            Id = reader.GetInt64(0),
                            Name = reader.GetString(1),
                            Animation = reader.GetString(2),
                            Rarity = reader.GetString(3)
                        });
                    }

                    reader.Close();
                }

                this.refreshableCacheStore.PutItem(query, TimeSpan.FromHours(24), emotes);

                return emotes;
            }

            return this.refreshableCacheStore.GetItem<IList<Emote>>(query)
                   ?? await Emotes().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IList<QuickChat>> GetQuickChatsAsync(KustoGameDbSupportedTitle supportedTitle)
        {
            var query = await this.BuildQuery(supportedTitle, KustoQueries.GetQuickChats).ConfigureAwait(false);

            async Task<IList<QuickChat>> QuickChats()
            {
                var quickChats = new List<QuickChat>();

                using (var reader = await this.cslQueryProvider
                    .ExecuteQueryAsync(GameDatabaseName, query, new ClientRequestProperties())
                    .ConfigureAwait(false))
                {
                    while (reader.Read())
                    {
                        quickChats.Add(new QuickChat
                        {
                            Id = reader.GetInt64(0),
                            ChatMessage = reader.GetString(1),
                            RequiresUnlock = byte.Parse(reader.GetValue(2).ToString(), CultureInfo.InvariantCulture),
                            Hidden = byte.Parse(reader.GetValue(3).ToString(), CultureInfo.InvariantCulture)
                        });
                    }

                    reader.Close();
                }

                this.refreshableCacheStore.PutItem(query, TimeSpan.FromHours(24), quickChats);

                return quickChats;
            }

            return this.refreshableCacheStore.GetItem<IList<QuickChat>>(query)
                   ?? await QuickChats().ConfigureAwait(false);
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
