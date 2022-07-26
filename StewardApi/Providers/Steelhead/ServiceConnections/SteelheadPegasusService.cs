using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Azure.Documents.SystemFunctions;
using Microsoft.Extensions.Configuration;
using SteelheadContent;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.Pegasus;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.Services.CMSRetrieval;
using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;
using SupportedLocale = Turn10.LiveOps.StewardApi.Contracts.Steelhead.Pegasus.SupportedLocale;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections
{
    /// <inheritdoc />
    public sealed class SteelheadPegasusService : ISteelheadPegasusService
    {
        private const string PegasusBaseCacheKey = "SteelheadPegasus_";
        private const string LocalizationFileAntecedent = "LiveOps_LocalizationStrings-";
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.PegasusCmsDefaultSteelhead
        };

        private readonly string cmsEnvironment;
        private readonly CMSRetrievalHelper cmsRetrievalHelper;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadPegasusService"/> class.
        /// </summary>
        public SteelheadPegasusService(
            PegasusCmsProvider pegasusCmsProvider,
            IRefreshableCacheStore refreshableCacheStore,
            IMapper mapper,
            IConfiguration configuration,
            ILoggingService loggingService)
        {
            pegasusCmsProvider.ShouldNotBeNull(nameof(pegasusCmsProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));

            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);

            if (!pegasusCmsProvider.Helpers.TryGetValue(TitleConstants.SteelheadCodeName, out var cmsRetrievalHelper))
            {
                var message = $"No Pegasus provider for {TitleConstants.SteelheadCodeName}.";
                loggingService.LogException(new PegasusAppInsightsException(message));
                throw new PegasusStewardException(message);
            }

            this.cmsRetrievalHelper = cmsRetrievalHelper;
            this.refreshableCacheStore = refreshableCacheStore;
            this.mapper = mapper;

            this.cmsEnvironment = configuration[ConfigurationKeyConstants.PegasusCmsDefaultSteelhead];
        }

        /// <inheritdoc />
        public async Task<IEnumerable<SupportedLocale>> GetSupportedLocalesAsync()
        {
            var locales =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<SteelheadContent.SupportedLocale>>(
                    SteelheadContent.CMSFileNames.SupportedLocales,
                    this.cmsEnvironment,
                    slot: "daily").ConfigureAwait(false);

            return this.mapper.Map<IEnumerable<SupportedLocale>>(locales);
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, List<string>>> GetLocalizedStringsAsync()
        {
            var results = new Dictionary<Guid, List<string>>();

            var supportedLocales = await this.GetSupportedLocalesAsync().ConfigureAwait(false);
            foreach (var supportedLocale in supportedLocales)
            {
                var filename = $"{LocalizationFileAntecedent}{supportedLocale.Locale}";

                var localizedStrings = await this.cmsRetrievalHelper
                    .GetCMSObjectAsync<Dictionary<Guid, SteelheadContent.LocalizedString>>(
                        filename,
                        this.cmsEnvironment,
                        slot: "daily").ConfigureAwait(false);

                // No translations found for this language code.
                if (localizedStrings == null)
                {
                    continue;
                }

                foreach (var locStringKey in localizedStrings.Keys)
                {
                    // Untranslated values start with antecedent "[Not Translated]".
                    if (localizedStrings[locStringKey].LocString.Contains("[Not Translated]", StringComparison.InvariantCulture))
                    {
                        continue;
                    }

                    if (!results.ContainsKey(locStringKey))
                    {
                        // Create if not exists in dictionary
                        results[locStringKey] = new List<string>();
                    }

                    results[locStringKey].Add(supportedLocale.Locale);
                }
            }

            return results;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<CarClass>> GetCarClassesAsync()
        {
            var carClassKey = $"{PegasusBaseCacheKey}CarClasses";

            async Task<IEnumerable<CarClass>> GetCarClasses()
            {
                var pegasusCarClasses = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<SteelheadContent.CarClass>>(
                    CMSFileNames.CarClasses,
                    this.cmsEnvironment).ConfigureAwait(false);
                var carClasses = this.mapper.Map<IEnumerable<CarClass>>(pegasusCarClasses);

                this.refreshableCacheStore.PutItem(carClassKey, TimeSpan.FromDays(7), carClasses);

                return carClasses;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<CarClass>>(carClassKey)
                   ?? await GetCarClasses().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<DataCar>> GetCarsAsync(string slotId = SteelheadPegasusSlot.Live)
        {
            // Temporary return value until Pegasus contains actual data.
            return Enumerable.Empty<DataCar>();

            //var slotStatus = await this.cmsRetrievalHelper.GetSlotStatusAsync(this.cmsEnvironment, slotId).ConfigureAwait(false);

            //if (slotStatus == null)
            //{
            //    throw new PegasusStewardException(
            //        $"The environment and slot provided are not supported in {TitleConstants.SteelheadCodeName} Pegasus. Environment: {this.cmsEnvironment}, Slot: {slotId}");
            //}

            //var carsKey = $"{PegasusBaseCacheKey}{slotId}_Cars";

            //async Task<IEnumerable<DataCar>> GetCars()
            //{
            //    var cars = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<DataCar>>(CMSFileNames.DataCars, this.cmsEnvironment, slot: slotId).ConfigureAwait(false);

            //    this.refreshableCacheStore.PutItem(carsKey, TimeSpan.FromDays(1), cars);

            //    return cars;
            //}

            //return this.refreshableCacheStore.GetItem<IEnumerable<DataCar>>(carsKey)
            //       ?? await GetCars().ConfigureAwait(false);
        }

        /// <inheritdoc />
        //public async Task<IEnumerable<ListCarMake>> GetCarMakesAsync()
        //{
        //    var carMakesKey = $"{PegasusBaseCacheKey}CarMakes";

        //    async Task<IEnumerable<ListCarMake>> GetCarMakes()
        //    {
        //        var pegasusResults = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<ListCarMake>>(CMSFileNames.ListCarMake, this.cmsEnvironment).ConfigureAwait(false);
        //        this.refreshableCacheStore.PutItem(carMakesKey, TimeSpan.FromDays(1), pegasusResults);

        //        return pegasusResults;
        //    }

        //    return this.refreshableCacheStore.GetItem<IEnumerable<ListCarMake>>(carMakesKey)
        //           ?? await GetCarMakes().ConfigureAwait(false);
        //}

        /// <inheritdoc />
        //public async Task<IEnumerable<CarHorn>> GetCarHornsAsync()
        //{
        //    var carHornsKey = $"{PegasusBaseCacheKey}CarHorns";

        //    async Task<IEnumerable<CarHorn>> GetCarHorns()
        //    {
        //        var carHorns = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<CarHorn>>(CMSFileNames.CarHorns, this.cmsEnvironment).ConfigureAwait(false);

        //        this.refreshableCacheStore.PutItem(carHornsKey, TimeSpan.FromDays(1), carHorns);

        //        return carHorns;
        //    }

        //    return this.refreshableCacheStore.GetItem<IEnumerable<CarHorn>>(carHornsKey)
        //           ?? await GetCarHorns().ConfigureAwait(false);
        //}

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
        //public async Task<IEnumerable<EmoteData>> GetEmotesAsync()
        //{
        //    var emotesKey = $"{PegasusBaseCacheKey}Emotes";

        //    async Task<IEnumerable<EmoteData>> GetEmotes()
        //    {
        //        var emotes = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<EmoteData>>(CMSFileNames.EmoteData, this.cmsEnvironment).ConfigureAwait(false);

        //        this.refreshableCacheStore.PutItem(emotesKey, TimeSpan.FromDays(1), emotes);

        //        return emotes;
        //    }

        //    return this.refreshableCacheStore.GetItem<IEnumerable<EmoteData>>(emotesKey)
        //           ?? await GetEmotes().ConfigureAwait(false);
        //}

        /// <inheritdoc />
        //public async Task<IEnumerable<QuickChat>> GetQuickChatLinesAsync()
        //{
        //    var quickChatLinesKey = $"{PegasusBaseCacheKey}QuickChatLines";

        //    async Task<IEnumerable<QuickChat>> GetQuickChatLines()
        //    {
        //        var quickChatLines = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<QuickChat>>(CMSFileNames.QuickChatData, this.cmsEnvironment).ConfigureAwait(false);

        //        this.refreshableCacheStore.PutItem(quickChatLinesKey, TimeSpan.FromDays(1), quickChatLines);

        //        return quickChatLines;
        //    }

        //    return this.refreshableCacheStore.GetItem<IEnumerable<QuickChat>>(quickChatLinesKey)
        //           ?? await GetQuickChatLines().ConfigureAwait(false);
        //}
    }
}
