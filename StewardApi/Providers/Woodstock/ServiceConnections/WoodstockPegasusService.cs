﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.Services.CMSRetrieval;
using WoodstockLiveOpsContent;
using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections
{
    /// <inheritdoc />
    public sealed class WoodstockPegasusService : IWoodstockPegasusService
    {
        private const string PegasusBaseCacheKey = "WoodstockPegasus_";
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.PegasusCmsEnvironment
        };

        private readonly string cmsEnvironment;
        private readonly CMSRetrievalHelper cmsRetrievalHelper;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockPegasusService"/> class.
        /// </summary>
        public WoodstockPegasusService(
            PegasusCmsProvider pegasusCmsProvider,
            IRefreshableCacheStore refreshableCacheStore,
            IMapper mapper,
            IConfiguration configuration)
        {
            pegasusCmsProvider.ShouldNotBeNull(nameof(pegasusCmsProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            mapper.ShouldNotBeNull(nameof(mapper));

            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);

            this.cmsRetrievalHelper = pegasusCmsProvider.WoodstockCmsRetrievalHelper;
            this.refreshableCacheStore = refreshableCacheStore;
            this.mapper = mapper;

            this.cmsEnvironment = configuration[ConfigurationKeyConstants.PegasusCmsEnvironment];
        }

        /// <inheritdoc />
        public async Task<IEnumerable<CarClass>> GetCarClassesAsync()
        {
            var carClassKey = $"{PegasusBaseCacheKey}CarClasses";

            async Task<IEnumerable<CarClass>> GetCarClasses()
            {
                var pegasusCarClasses = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<WoodstockLiveOpsContent.CarClass>>(CMSFileNames.CarClasses, this.cmsEnvironment).ConfigureAwait(false);
                var carClasses = this.mapper.Map<IEnumerable<CarClass>>(pegasusCarClasses);

                this.refreshableCacheStore.PutItem(carClassKey, TimeSpan.FromDays(7), carClasses);

                return carClasses;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<CarClass>>(carClassKey)
                   ?? await GetCarClasses().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync()
        {
            var leaderboardsKey = $"{PegasusBaseCacheKey}Leaderboards";

            async Task<IEnumerable<Leaderboard>> GetLeaderboards()
            {
                var pegasusLeaderboards = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<LeaderboardV2>>(CMSFileNames.LeaderboardsV2, this.cmsEnvironment).ConfigureAwait(false); ;
                var leaderboards = this.mapper.Map<IEnumerable<Leaderboard>>(pegasusLeaderboards);

                this.refreshableCacheStore.PutItem(leaderboardsKey, TimeSpan.FromHours(1), leaderboards);

                return leaderboards;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<Leaderboard>>(leaderboardsKey)
                   ?? await GetLeaderboards().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<DataCar>> GetCarsAsync()
        {
            var carsKey = $"{PegasusBaseCacheKey}Cars";

            async Task<IEnumerable<DataCar>> GetCars()
            {
                var cars = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<DataCar>>(CMSFileNames.DataCars, this.cmsEnvironment).ConfigureAwait(false);

                this.refreshableCacheStore.PutItem(carsKey, TimeSpan.FromDays(1), cars);

                return cars;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<DataCar>>(carsKey)
                   ?? await GetCars().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<ListCarMake>> GetCarMakesAsync()
        {
            var carMakesKey = $"{PegasusBaseCacheKey}CarMakes";

            async Task<IEnumerable<ListCarMake>> GetCarMakes()
            {
                var pegasusResults = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<ListCarMake>>(CMSFileNames.ListCarMake, this.cmsEnvironment).ConfigureAwait(false);
                this.refreshableCacheStore.PutItem(carMakesKey, TimeSpan.FromDays(1), pegasusResults);

                return pegasusResults;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<ListCarMake>>(carMakesKey)
                   ?? await GetCarMakes().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<CarHorn>> GetCarHornsAsync()
        {
            var carHornsKey = $"{PegasusBaseCacheKey}CarHorns";

            async Task<IEnumerable<CarHorn>> GetCarHorns()
            {
                var carHorns = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<CarHorn>>(CMSFileNames.CarHorns, this.cmsEnvironment).ConfigureAwait(false);

                this.refreshableCacheStore.PutItem(carHornsKey, TimeSpan.FromDays(1), carHorns);

                return carHorns;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<CarHorn>>(carHornsKey)
                   ?? await GetCarHorns().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<VanityItem>> GetVanityItemsAsync()
        {
            var vanityItemsKey = $"{PegasusBaseCacheKey}VanityItems";

            async Task<IEnumerable<VanityItem>> GetVanityItems()
            {
                var vanityItems = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<VanityItem>>(CMSFileNames.VanityItems, this.cmsEnvironment).ConfigureAwait(false);

                this.refreshableCacheStore.PutItem(vanityItemsKey, TimeSpan.FromDays(1), vanityItems);

                return vanityItems;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<VanityItem>>(vanityItemsKey)
                   ?? await GetVanityItems().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<EmoteData>> GetEmotesAsync()
        {
            var emotesKey = $"{PegasusBaseCacheKey}Emotes";

            async Task<IEnumerable<EmoteData>> GetEmotes()
            {
                var emotes = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<EmoteData>>(CMSFileNames.EmoteData, this.cmsEnvironment).ConfigureAwait(false);

                this.refreshableCacheStore.PutItem(emotesKey, TimeSpan.FromDays(1), emotes);

                return emotes;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<EmoteData>>(emotesKey)
                   ?? await GetEmotes().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<QuickChat>> GetQuickChatLinesAsync()
        {
            var quickChatLinesKey = $"{PegasusBaseCacheKey}QuickChatLines";

            async Task<IEnumerable<QuickChat>> GetQuickChatLines()
            {
                var quickChatLines = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<QuickChat>>(CMSFileNames.QuickChatData, this.cmsEnvironment).ConfigureAwait(false);

                this.refreshableCacheStore.PutItem(quickChatLinesKey, TimeSpan.FromDays(1), quickChatLines);

                return quickChatLines;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<QuickChat>>(quickChatLinesKey)
                   ?? await GetQuickChatLines().ConfigureAwait(false);
        }
    }
}
