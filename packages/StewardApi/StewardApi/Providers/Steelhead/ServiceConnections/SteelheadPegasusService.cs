using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.TeamFoundation.Build.WebApi;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using SteelheadLiveOpsContent;
using StewardGitApi;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.MessageOfTheDay;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.Services.CMSRetrieval;
using BanConfiguration = SteelheadLiveOpsContent.BanConfiguration;
using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;
using LiveOpsContracts = Turn10.LiveOps.StewardApi.Contracts.Common;
using PullRequest = Turn10.LiveOps.StewardApi.Contracts.Git.PullRequest;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections
{
    /// <inheritdoc />
    public sealed class SteelheadPegasusService : ISteelheadPegasusService
    {
        private const string PegasusBaseCacheKey = "SteelheadPegasus_";
        private const string LocalizationFileAntecedent = "LiveOps_LocalizationStrings-";
        private const string LocalizationStringIdsMappings = "LiveOps_LocalizationStringMappings";
        private readonly string defaultCmsSlot = SteelheadPegasusSlot.Live;

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.PegasusCmsDefaultSteelhead,
            ConfigurationKeyConstants.KeyVaultUrl,
            ConfigurationKeyConstants.SteelheadContentAccessToken,
            ConfigurationKeyConstants.SteelheadContentOrganizationUrl,
            ConfigurationKeyConstants.SteelheadContentProjectId,
            ConfigurationKeyConstants.SteelheadContentRepoId,
        };

        private readonly string defaultCmsEnvironment;
        private readonly string formatPipelineBuildDefinition;
        private readonly CMSRetrievalHelper cmsRetrievalHelper;
        private readonly IRefreshableCacheStore refreshableCacheStore;
        private readonly IMapper mapper;
        private readonly IAzureDevOpsManager azureDevOpsManager;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadPegasusService"/> class.
        /// </summary>
        public SteelheadPegasusService(
            PegasusCmsProvider pegasusCmsProvider,
            IAzureDevOpsFactory azureDevOpsFactory,
            IRefreshableCacheStore refreshableCacheStore,
            IMapper mapper,
            IConfiguration configuration,
            ILoggingService loggingService,
            KeyVaultConfig keyVaultConfig)
        {
            pegasusCmsProvider.ShouldNotBeNull(nameof(pegasusCmsProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            azureDevOpsFactory.ShouldNotBeNull(nameof(azureDevOpsFactory));
            keyVaultConfig.ShouldNotBeNull(nameof(keyVaultConfig));

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

            this.defaultCmsEnvironment = configuration[ConfigurationKeyConstants.PegasusCmsDefaultSteelhead];
            this.formatPipelineBuildDefinition = configuration[ConfigurationKeyConstants.SteelheadFormatPipelineBuildDefinition];

            var steelheadContentPAT = keyVaultConfig.SteelheadContentAccessToken;
            try
            {
                this.azureDevOpsManager = azureDevOpsFactory.Create(
                    configuration[ConfigurationKeyConstants.SteelheadContentOrganizationUrl],
                    steelheadContentPAT,
                    Guid.Parse(configuration[ConfigurationKeyConstants.SteelheadContentProjectId]),
                    Guid.Parse(configuration[ConfigurationKeyConstants.SteelheadContentRepoId]));
            }
            catch (Exception ex)
            {
                loggingService.LogException(new AppInsightsException($"Unable to initialize ADO connection", ex));
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<SupportedLocale>> GetSupportedLocalesAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var locales =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<SupportedLocale>>(
                    CMSFileNames.SupportedLocales,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            return locales;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, UGCReportingCategory>> GetUgcReportingReasonsAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var ugcReportingCategoryKey = this.BuildCacheKey(environment, slot, snapshot, "UGCReportingCategory");

            async Task<Dictionary<Guid, UGCReportingCategory>> GetUGCReportingCategory()
            {
                var ugcReportingReasons = await this.cmsRetrievalHelper.GetCMSObjectAsync<Dictionary<Guid, UGCReportingCategory>>(
                    "UGCReportingCategories",
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

                if (!string.IsNullOrEmpty(snapshot))
                {
                    this.refreshableCacheStore.PutItem(ugcReportingCategoryKey, TimeSpan.FromDays(1), ugcReportingReasons);
                }

                return ugcReportingReasons;
            }

            return this.refreshableCacheStore.GetItem<Dictionary<Guid, UGCReportingCategory>>(ugcReportingCategoryKey)
                   ?? await GetUGCReportingCategory().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<LiveOpsContracts.CarFeaturedShowcase>> GetCarFeaturedShowcasesAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            IEnumerable<LiveOpsContracts.CarFeaturedShowcase> carFeaturedShowcases = new List<LiveOpsContracts.CarFeaturedShowcase>();

            var carListings =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<SteelheadLiveOpsContent.CarListingV2[]>(
                    CMSFileNames.CarListings.Replace("{:loc}", "en-US", StringComparison.Ordinal),
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            foreach (var carListing in carListings)
            {
                foreach (var pegasusShowcase in carListing.FeaturedShowcase)
                {
                    if (pegasusShowcase is not SteelheadLiveOpsContent.CarFeaturedShowcase)
                    {
                        continue;
                    }

                    var liveOpsShowcase = new LiveOpsContracts.CarFeaturedShowcase()
                    {
                        Title = pegasusShowcase.Title,
                        Description = pegasusShowcase.Description,
                        StartTimeUtc = pegasusShowcase.StartEndDate.From,
                        EndTimeUtc = pegasusShowcase.StartEndDate.To,
                        BaseCost = carListing.FullCarInfo.Car.BaseCost.Value,
                        CarId = carListing.FullCarInfo.Car.CarId,
                        MediaName = carListing.FullCarInfo.Car.MediaName,
                        ModelShort = carListing.FullCarInfo.Car.ModelShort,
                    };
                    carFeaturedShowcases = carFeaturedShowcases.Append(liveOpsShowcase);

                    var saleInfo = carListing.SaleInformation.FirstOrDefault(x => x.StartTime >= liveOpsShowcase.StartTimeUtc && x.StartTime <= liveOpsShowcase.EndTimeUtc);
                    if (saleInfo == null)
                    {
                        continue;
                    }

                    liveOpsShowcase.SalePercentOff = saleInfo.SalePercentOff;
                    liveOpsShowcase.SalePrice = saleInfo.SalePrice;
                    liveOpsShowcase.VipSalePercentOff = saleInfo.VipSalePercentOff;
                    liveOpsShowcase.VipSalePrice = saleInfo.VipSalePrice;
                }
            }

            return carFeaturedShowcases;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<LiveOpsContracts.DivisionFeaturedShowcase>> GetDivisionFeaturedShowcasesAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            IEnumerable<LiveOpsContracts.DivisionFeaturedShowcase> divisionFeaturedShowcases = new List<LiveOpsContracts.DivisionFeaturedShowcase>();

            var carListings =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<SteelheadLiveOpsContent.CarListingV2[]>(
                    CMSFileNames.CarListings.Replace("{:loc}", "en-US", StringComparison.Ordinal),
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            foreach (var carListing in carListings)
            {
                foreach (var pegasusShowcase in carListing.FeaturedShowcase)
                {
                    if (pegasusShowcase is not SteelheadLiveOpsContent.DivisionFeaturedShowcase)
                    {
                        continue;
                    }

                    var liveOpsShowcase = new LiveOpsContracts.DivisionFeaturedShowcase()
                    {
                        Title = pegasusShowcase.Title,
                        Description = pegasusShowcase.Description,
                        StartTimeUtc = pegasusShowcase.StartEndDate.From,
                        EndTimeUtc = pegasusShowcase.StartEndDate.To,
                        DivisionId = carListing.FullCarInfo.CarDivision.CarDivisionId,
                        DivisionName = carListing.FullCarInfo.CarDivision.Name,
                    };
                    divisionFeaturedShowcases = divisionFeaturedShowcases.Append(liveOpsShowcase);
                }
            }

            var uniqueDivisionFeaturedShowcases = divisionFeaturedShowcases
                                                    .GroupBy(x => new { x.DivisionId, x.StartTimeUtc, x.EndTimeUtc })
                                                    .Select(x => x.First())
                                                    .ToList();

            return uniqueDivisionFeaturedShowcases;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<LiveOpsContracts.ManufacturerFeaturedShowcase>> GetManufacturerFeaturedShowcasesAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            IEnumerable<LiveOpsContracts.ManufacturerFeaturedShowcase> manufacturerFeaturedShowcases = new List<LiveOpsContracts.ManufacturerFeaturedShowcase>();

            var carListings =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<SteelheadLiveOpsContent.CarListingV2[]>(
                    CMSFileNames.CarListings.Replace("{:loc}", "en-US", StringComparison.Ordinal),
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            foreach (var carListing in carListings)
            {
                foreach (var pegasusShowcase in carListing.FeaturedShowcase)
                {
                    if (pegasusShowcase is not SteelheadLiveOpsContent.ManufacturerFeaturedShowcase)
                    {
                        continue;
                    }

                    var liveOpsShowcase = new LiveOpsContracts.ManufacturerFeaturedShowcase()
                    {
                        Title = pegasusShowcase.Title,
                        Description = pegasusShowcase.Description,
                        StartTimeUtc = pegasusShowcase.StartEndDate.From,
                        EndTimeUtc = pegasusShowcase.StartEndDate.To,
                        ManufacturerId = carListing.FullCarInfo.Car.MakeID.Value,
                        ManufacturerName = carListing.FullCarInfo.Car.MakeDisplayName,
                    };
                    manufacturerFeaturedShowcases = manufacturerFeaturedShowcases.Append(liveOpsShowcase);
                }
            }

            var uniqueManufacturerFeaturedShowcases = manufacturerFeaturedShowcases
                                                        .GroupBy(x => new { x.ManufacturerId, x.StartTimeUtc, x.EndTimeUtc })
                                                        .Select(x => x.First())
                                                        .ToList();

            return uniqueManufacturerFeaturedShowcases;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<CarSale>> GetCarSalesAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            IEnumerable<CarSale> carSales = new List<CarSale>();

            var carListings =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<CarListingV2[]>(
                    CMSFileNames.CarListings.Replace("{:loc}", "en-US", StringComparison.Ordinal),
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            foreach (var carListing in carListings)
            {
                foreach (var pegasusCarSale in carListing.SaleInformation)
                {
                    var liveOpsCarSale = carSales.FirstOrDefault(x => x.CarSaleId == pegasusCarSale.ShowcaseListingId);
                    if (liveOpsCarSale == null)
                    {
                        liveOpsCarSale = new CarSale()
                        {
                            CarSaleId = pegasusCarSale.ShowcaseListingId,
                            Name = pegasusCarSale.ShowcaseListingName,
                            StartTimeUtc = pegasusCarSale.StartEndDate.From,
                            EndTimeUtc = pegasusCarSale.StartEndDate.To,
                            Cars = new List<CarSaleInformation>(),
                        };
                        carSales = carSales.Append(liveOpsCarSale);
                    }

                    var carSaleInfo = new CarSaleInformation()
                    {
                        BaseCost = carListing.FullCarInfo.Car.BaseCost.Value,
                        MediaName = carListing.FullCarInfo.Car.MediaName,
                        ModelShort = carListing.FullCarInfo.Car.ModelShort,
                        CarId = carListing.FullCarInfo.Car.CarId,
                        SalePercentOff = pegasusCarSale.SalePercentOff,
                        SalePrice = pegasusCarSale.SalePrice,
                        VipSalePercentOff = pegasusCarSale.VipSalePercentOff,
                        VipSalePrice = pegasusCarSale.VipSalePrice,
                    };
                    liveOpsCarSale.Cars = liveOpsCarSale.Cars.Append(carSaleInfo);
                }
            }

            return carSales;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<LiveOpsContracts.RivalsEvent>> GetRivalsEventsAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var filename = CMSFileNames.RivalEvents.Replace("{:loc}", "en-US", StringComparison.Ordinal);
            var pegasusRivalEvents =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<SteelheadLiveOpsContent.RivalEvent[]>(
                    filename,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            var rivalsEvents = this.mapper.SafeMap<IEnumerable<LiveOpsContracts.RivalsEvent>>(pegasusRivalEvents);

            var tracks = await this.GetTracksAsync(environment).ConfigureAwait(false);

            foreach (var rivalsEvent in rivalsEvents)
            {
                var trackData = tracks.FirstOrDefault(track => track.id == rivalsEvent.TrackId);
                rivalsEvent.TrackName = trackData != null ? $"{trackData.MediaName} - {trackData.DisplayName}" : string.Empty;
            }

            return rivalsEvents;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, string>> GetRivalsEventsReferenceAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            // No caching due to small data size
            var filename = CMSFileNames.RivalEvents.Replace("{:loc}", "en-US", StringComparison.Ordinal);
            var pegasusRivalEvents =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<SteelheadLiveOpsContent.RivalEvent[]>(
                    filename,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            var outputDictionary = pegasusRivalEvents.ToDictionary(x => x.ProjectedContentId, x => x.Name);

            return outputDictionary;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, string>> GetRivalsEventCategoriesAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            // No caching due to small data size
            var filename = CMSFileNames.RivalCategories.Replace("{:loc}", "en-US", StringComparison.Ordinal);
            var pegasusRivalsCategories =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<Dictionary<Guid, SteelheadLiveOpsContent.RivalCategory>>(
                    filename,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            var outputDictionary = pegasusRivalsCategories.ToDictionary(kv => kv.Key, kv => kv.Value.Title);

            return outputDictionary;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, string>> GetStoreEntitlementsAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            // No caching due to small data size
            var filename = CMSFileNames.StoreEntitlements;
            var pegasusEntitlements =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<Dictionary<Guid, SteelheadLiveOpsContent.Entitlement>>(
                    filename,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            var outputDictionary = pegasusEntitlements.ToDictionary(kv => kv.Key, kv => kv.Value.Description);

            return outputDictionary;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, string>> GetRacersCupSeriesAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            // No caching due to small data size
            var filename = CMSFileNames.RacersCupSeries.Replace("{:loc}", "en-US", StringComparison.Ordinal);
            var pegasusRacersCupSeries =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<Dictionary<Guid, SteelheadLiveOpsContent.ChampionshipSeriesDataV3>>(
                    filename,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            var outputDictionary = pegasusRacersCupSeries.ToDictionary(kv => kv.Key, kv => kv.Value.Name);

            return outputDictionary;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, string>> GetBuildersCupChampionshipsAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            // No caching due to small data size
            var filename = CMSFileNames.BuildersCupChampionships.Replace("{:loc}", "en-US", StringComparison.Ordinal);
            var pegasusBuildersCupSeries =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<Dictionary<Guid, SteelheadLiveOpsContent.BuildersCupDataV3>>(
                    filename,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            var outputDictionary = pegasusBuildersCupSeries.ToDictionary(kv => kv.Key, kv => kv.Value.Name);

            return outputDictionary;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, string>> GetBuildersCupLaddersAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            // No caching due to small data size
            var filename = CMSFileNames.BuildersCupLadders.Replace("{:loc}", "en-US", StringComparison.Ordinal);
            var pegasusBuildersCupLadder =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<Dictionary<Guid, SteelheadLiveOpsContent.BuildersCupLadderDataV3>>(
                    filename,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            var outputDictionary = pegasusBuildersCupLadder.ToDictionary(kv => kv.Key, kv => kv.Value.Name);

            return outputDictionary;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, string>> GetBuildersCupSeriesAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            // No caching due to small data size
            var filename = CMSFileNames.BuildersCupSeries.Replace("{:loc}", "en-US", StringComparison.Ordinal);
            var pegasusBuildersCupSeries =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<Dictionary<Guid, SteelheadLiveOpsContent.BuildersCupSeriesDataV3>>(
                    filename,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            var outputDictionary = pegasusBuildersCupSeries.ToDictionary(kv => kv.Key, kv => kv.Value.Name);

            return outputDictionary;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, DisplayCondition>> GetDisplayConditionsAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var displayConditions =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<Dictionary<Guid, DisplayCondition>>(
                    CMSFileNames.TileDisplayConditions,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            return displayConditions;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>> GetLocalizedStringsAsync(bool useInternalIds = true, string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var localizedStringCacheKey = this.BuildCacheKey(environment, slot, snapshot, "LocalizedStrings");

            if (useInternalIds)
            {
                localizedStringCacheKey += "_useInternalIds";
            }

            async Task<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>> GetLocalizedStrings(bool useInternalIds)
            {
                var results = new Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>();

                var localizationIdsMapping = await this.cmsRetrievalHelper
                    .GetCMSObjectAsync<Dictionary<Guid, Guid>>(
                        LocalizationStringIdsMappings,
                        environment: environment,
                        slot: slot,
                        snapshot: snapshot).ConfigureAwait(false);

                var supportedLocales = await this.GetSupportedLocalesAsync().ConfigureAwait(false);
                foreach (var supportedLocale in supportedLocales)
                {
                    var filename = $"{LocalizationFileAntecedent}{supportedLocale.Locale}";

                    var localizedStrings = await this.cmsRetrievalHelper
                        .GetCMSObjectAsync<Dictionary<Guid, SteelheadLiveOpsContent.LocalizedString>>(
                            filename,
                            environment: environment,
                            slot: slot,
                            snapshot: snapshot).ConfigureAwait(false);

                    foreach (var locStringKey in localizedStrings.Keys)
                    {
                        var isTranslated = !localizedStrings[locStringKey].LocString.Contains("[Not Translated]", StringComparison.InvariantCulture);

                        var localizedResult = new LiveOpsContracts.LocalizedString()
                        {
                            Message = localizedStrings[locStringKey].LocString,
                            Category = localizedStrings[locStringKey].Category,
                            LanguageCode = supportedLocale.Locale,
                            IsTranslated = isTranslated,
                        };

                        if (!results.ContainsKey(locStringKey))
                        {
                            // Create if not exists in dictionary
                            results[locStringKey] = new List<LiveOpsContracts.LocalizedString>();
                        }

                        results[locStringKey].Add(localizedResult);
                    }
                }

                // Remap the ids to the right ids from the mapping file
                if (useInternalIds)
                {
                    return results
                        .Where(p => localizationIdsMapping.ContainsKey(p.Key))
                        .ToDictionary(p => localizationIdsMapping[p.Key], p => p.Value);
                }

                if (!string.IsNullOrEmpty(snapshot))
                {
                    this.refreshableCacheStore.PutItem(localizedStringCacheKey, TimeSpan.FromMinutes(1), results);
                }

                return results;
            }

            return this.refreshableCacheStore.GetItem<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>>(localizedStringCacheKey)
                   ?? await GetLocalizedStrings(useInternalIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<CarClass>> GetCarClassesAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var carClassKey = this.BuildCacheKey(environment, slot, snapshot, "CarClasses");

            async Task<IEnumerable<CarClass>> GetCarClasses(string environment, string slot, string snapshot)
            {
                await this.VerifySlotStatus(environment, slot).ConfigureAwait(false);

                var pegasusCarClasses = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<SteelheadLiveOpsContent.CarClass>>(
                    CMSFileNames.CarClasses,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);
                var carClasses = this.mapper.SafeMap<IEnumerable<CarClass>>(pegasusCarClasses);

                if (!string.IsNullOrEmpty(snapshot))
                {
                    this.refreshableCacheStore.PutItem(carClassKey, TimeSpan.FromDays(7), carClasses);
                }

                return carClasses;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<CarClass>>(carClassKey)
                   ?? await GetCarClasses(environment, slot, snapshot).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            await this.VerifySlotStatus(environment, slot).ConfigureAwait(false);

            var leaderboardsKey = this.BuildCacheKey(environment, slot, snapshot, "Leaderboards");

            async Task<IEnumerable<Leaderboard>> GetLeaderboards()
            {
                var filename = CMSFileNames.RivalEvents.Replace("{:loc}", "en-US", StringComparison.Ordinal);
                var pegasusLeaderboards = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<RivalEvent>>(
                    filename,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);
                var leaderboards = this.mapper.SafeMap<IEnumerable<Leaderboard>>(pegasusLeaderboards);

                if (!string.IsNullOrEmpty(snapshot))
                {
                    this.refreshableCacheStore.PutItem(leaderboardsKey, TimeSpan.FromHours(1), leaderboards);
                }

                return leaderboards;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<Leaderboard>>(leaderboardsKey)
                   ?? await GetLeaderboards().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<DataCar>> GetCarsAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            await this.VerifySlotStatus(environment, slot).ConfigureAwait(false);

            var carsKey = this.BuildCacheKey(environment, slot, snapshot, "Cars");

            async Task<IEnumerable<DataCar>> GetCars()
            {
                var cars = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<DataCar>>(
                    CMSFileNames.DataCars,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

                if (!string.IsNullOrEmpty(snapshot))
                {
                    this.refreshableCacheStore.PutItem(carsKey, TimeSpan.FromDays(1), cars);
                }

                return cars;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<DataCar>>(carsKey)
                   ?? await GetCars().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, string>> GetCarsReferenceAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            // No caching due to small data size
            var filename = CMSFileNames.DataCars.Replace("{:loc}", "en-US", StringComparison.Ordinal);
            var pegasusCars =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<DataCar>>(
                    filename,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            var outputDictionary = pegasusCars.ToDictionary(x => x.ProjectedContentId, x => x.DisplayName);

            return outputDictionary;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, string>> GetCarMakesAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            // No caching due to small data size
            var pegasusCarMakes =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<ListCarMake>>(
                    CMSFileNames.ListCarMake,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

            var outputDictionary = pegasusCarMakes.ToDictionary(x => x.ProjectedContentId, x => x.DisplayName);

            return outputDictionary;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<VanityItem>> GetVanityItemsAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            await this.VerifySlotStatus(environment, slot).ConfigureAwait(false);

            var vanityItemsKey = this.BuildCacheKey(environment, slot, snapshot, "VanityItems");

            async Task<IEnumerable<VanityItem>> GetVanityItems()
            {
                var vanityItems = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<VanityItem>>(
                    CMSFileNames.VanityItems,
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

                if (!string.IsNullOrEmpty(snapshot))
                {
                    this.refreshableCacheStore.PutItem(vanityItemsKey, TimeSpan.FromDays(1), vanityItems);
                }

                return vanityItems;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<VanityItem>>(vanityItemsKey)
                   ?? await GetVanityItems().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<SafetyRatingConfiguration> GetSafetyRatingConfig(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            await this.VerifySlotStatus(environment, slot).ConfigureAwait(false);

            var safetyRatingConfig = await this.cmsRetrievalHelper.GetCMSObjectAsync<SafetyRatingConfiguration>(
                CMSFileNames.SafetyRatingConfiguration,
                environment: environment,
                slot: slot,
                snapshot: snapshot).ConfigureAwait(false);

            return safetyRatingConfig;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<Track>> GetTracksAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            await this.VerifySlotStatus(environment, slot).ConfigureAwait(false);

            var tracksKey = this.BuildCacheKey(environment, slot, snapshot, "Tracks");

            async Task<IEnumerable<Track>> GetTracks()
            {
                var tracks = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<Track>>(
                    "LiveOps_Tracks",
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

                if (string.IsNullOrEmpty(snapshot))
                {
                    this.refreshableCacheStore.PutItem(tracksKey, TimeSpan.FromDays(1), tracks);
                }

                return tracks;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<Track>>(tracksKey)
                   ?? await GetTracks().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, ChampionshipPlaylistDataV3>> GetRacersCupPlaylistDataV3Async(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var playlists = await this.cmsRetrievalHelper.GetCMSObjectAsync<Dictionary<Guid, ChampionshipPlaylistDataV3>>(
                CMSFileNames.PlaylistData,
                environment: environment,
                slot: slot,
                snapshot: snapshot).ConfigureAwait(false);

            return playlists;
        }

        /// <inheritdoc />
        public async Task<RacersCupChampionships> GetRacersCupChampionshipScheduleV4Async(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var scheduleData = await this.cmsRetrievalHelper.GetCMSObjectAsync<RacersCupChampionships>(
                CMSFileNames.RacersCupV4,
                environment: environment,
                slot: slot,
                snapshot: snapshot).ConfigureAwait(false);

            return scheduleData;
        }

        /// <inheritdoc />
        public async Task<BuildersCupCupDataV3> GetBuildersCupFeaturedCupLadderAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var fileName = CMSFileNames.BuildersCup.Replace("{:loc}", "en-US", StringComparison.Ordinal);

            var featuredCupData = await this.cmsRetrievalHelper.GetCMSObjectAsync<BuildersCupCupDataV3[]>(
                fileName,
                environment: environment,
                slot: slot,
                snapshot: snapshot).ConfigureAwait(false);

            return featuredCupData.Single();
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, SteelheadLiveOpsContent.BanConfiguration>> GetBanConfigurationsAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var banConfigurationKey = this.BuildCacheKey(environment, slot, snapshot, "BanConfiguration");

            async Task<Dictionary<Guid, SteelheadLiveOpsContent.BanConfiguration>> GetBanConfigurations()
            {
                var banConfigurations = await this.cmsRetrievalHelper.GetCMSObjectAsync<Dictionary<Guid, SteelheadLiveOpsContent.BanConfiguration>>(
                    "BanConfigurations",
                    environment: environment,
                    slot: slot,
                    snapshot: snapshot).ConfigureAwait(false);

                this.refreshableCacheStore.PutItem(banConfigurationKey, TimeSpan.FromDays(1), banConfigurations);

                return banConfigurations;
            }

            return this.refreshableCacheStore.GetItem<Dictionary<Guid, SteelheadLiveOpsContent.BanConfiguration>>(banConfigurationKey)
                   ?? await GetBanConfigurations().ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<WorldOfForzaConfigV3> GetWelcomeCenterDataAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var filename = CMSFileNames.WorldOfForzaConfig;
            var wofConfig = await this.cmsRetrievalHelper.GetCMSObjectAsync<WorldOfForzaConfigV3>(
                filename,
                environment: environment,
                slot: slot,
                snapshot: snapshot).ConfigureAwait(false);

            return wofConfig;
        }

        /// <inheritdoc/>
        public async Task<WorldOfForzaTileCMSCollection> GetWelcomeCenterTileDataAsync(string environment = null, string slot = null, string snapshot = null)
        {
            environment ??= this.defaultCmsEnvironment;
            slot ??= this.defaultCmsSlot;

            var filename = CMSFileNames.WorldOfForzaTileCMSData.Replace("{:loc}", "en-US", StringComparison.Ordinal);
            var wofTileCollection = await this.cmsRetrievalHelper.GetCMSObjectAsync<WorldOfForzaTileCMSCollection>(
                filename,
                environment: environment,
                slot: slot,
                snapshot: snapshot).ConfigureAwait(false);

            return wofTileCollection;
        }

        /// <inheritdoc/>
        public async Task<XElement> GetMessageOfTheDayElementAsync(Guid id)
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.MessageOfTheDayPath, GitObjectType.Blob).ConfigureAwait(false);

            var doc = XDocument.Parse(item.Content);
            var selectedElement = doc.Root.Elements(WelcomeCenterHelpers.NamespaceRoot + "UserMessages.MessageOfTheDay")
                .Where(e => e.Attribute(WelcomeCenterHelpers.NamespaceElement + "id")?.Value == id.ToString())
                .FirstOrDefault();

            selectedElement.ShouldNotBeNull(nameof(selectedElement));

            return selectedElement;
        }

        /// <inheritdoc/>
        public async Task<MotdBridge> GetMessageOfTheDayCurrentValuesAsync(Guid id)
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.MessageOfTheDayPath, GitObjectType.Blob).ConfigureAwait(false);

            var root = await item.Content.DeserializeAsync<MotdRoot>().ConfigureAwait(false);
            var entry = root.Entries.Where(motd => motd.idAttribute == id).First();

            var subset = this.mapper.SafeMap<MotdBridge>(entry);

            return subset;
        }

        /// <inheritdoc/>
        public async Task<Dictionary<Guid, string>> GetMessageOfTheDaySelectionsAsync()
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.MessageOfTheDayPath, GitObjectType.Blob).ConfigureAwait(false);
            var root = await item.Content.DeserializeAsync<MotdRoot>().ConfigureAwait(false);

            var choices = new Dictionary<Guid, string>();
            foreach (var entry in root.Entries)
            {
                choices.Add(entry.idAttribute, entry.FriendlyMessageName);
            }

            return choices;
        }

        /// <inheritdoc/>
        public async Task<CommitRefProxy> EditMessageOfTheDayAsync(MotdBridge messageOfTheDayBridge, Guid id)
        {
            var entry = this.mapper.SafeMap<MotdEntry>(messageOfTheDayBridge);
            var locstrings = await this.GetLocalizedStringsAsync().ConfigureAwait(false);
            var tree = WelcomeCenterHelpers.BuildMetaData(entry, new Node(), locstrings, null);

            var element = await this.GetMessageOfTheDayElementAsync(id).ConfigureAwait(false);

            WelcomeCenterHelpers.FillXml(element, tree);

            var newXml = element.Document.ToXmlString();

            var change = new CommitRefProxy()
            {
                NewFileContent = newXml,
                PathToFile = PegasusConstants.MessageOfTheDayPath,
                VersionControlChangeType = VersionControlChangeType.Edit,
                CommitMessage = string.Format(CultureInfo.InvariantCulture, WelcomeCenterHelpers.StandardCommitMessage, PegasusConstants.MessageOfTheDay),
            };

            return change;
        }

        /// <inheritdoc/>
        public async Task<WofImageTextBridge> GetWorldOfForzaImageTextTileAsync(Guid id)
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.ImageTextTilePath, GitObjectType.Blob).ConfigureAwait(false);

            var root = await item.Content.DeserializeAsync<WofImageTextRoot>().ConfigureAwait(false);
            var entry = root.Entries.Where(wof => wof.id == id).First();

            var subset = this.mapper.SafeMap<WofImageTextBridge>(entry);

            return subset;
        }

        /// <inheritdoc/>
        public async Task<WofGenericPopupBridge> GetWorldOfForzaGenericPopupTileAsync(Guid id)
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.GenericPopupTilePath, GitObjectType.Blob).ConfigureAwait(false);

            var root = await item.Content.DeserializeAsync<WofGenericPopupRoot>().ConfigureAwait(false);
            var entry = root.Entries.Where(wof => wof.id == id).First();

            var subset = this.mapper.SafeMap<WofGenericPopupBridge>(entry);

            return subset;
        }

        /// <inheritdoc/>
        public async Task<WofDeeplinkBridge> GetWorldOfForzaDeeplinkTileAsync(Guid id)
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.DeeplinkTilePath, GitObjectType.Blob).ConfigureAwait(false);

            var root = await item.Content.DeserializeAsync<WofDeeplinkRoot>().ConfigureAwait(false);
            var entry = root.Entries.Where(wof => wof.id == id).First();

            var subset = this.mapper.SafeMap<WofDeeplinkBridge>(entry);

            return subset;
        }

        /// <inheritdoc/>
        public async Task<Dictionary<Guid, string>> GetWorldOfForzaImageTextTileSelectionsAsync()
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.ImageTextTilePath, GitObjectType.Blob).ConfigureAwait(false);
            var root = await item.Content.DeserializeAsync<WofImageTextRoot>().ConfigureAwait(false);

            return GetWelcomeCenterTileDictionary(root.Entries);
        }

        /// <inheritdoc/>
        public async Task<Dictionary<Guid, string>> GetWorldOfForzaGenericPopupSelectionsAsync()
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.GenericPopupTilePath, GitObjectType.Blob).ConfigureAwait(false);
            var root = await item.Content.DeserializeAsync<WofGenericPopupRoot>().ConfigureAwait(false);

            return GetWelcomeCenterTileDictionary(root.Entries);
        }

        /// <inheritdoc/>
        public async Task<Dictionary<Guid, string>> GetWorldOfForzaDeeplinkSelectionsAsync()
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.DeeplinkTilePath, GitObjectType.Blob).ConfigureAwait(false);
            var root = await item.Content.DeserializeAsync<WofDeeplinkRoot>().ConfigureAwait(false);

            return GetWelcomeCenterTileDictionary(root.Entries);
        }

        /// <inheritdoc/>
        public async Task<XElement> GetWorldOfForzaImageTextTileElementAsync(Guid id)
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.ImageTextTilePath, GitObjectType.Blob).ConfigureAwait(false);

            return GetXmlElement(id, item, "WorldOfForza.WoFTileImageText");
        }

        /// <inheritdoc/>
        public async Task<XElement> GetWorldOfForzaGenericPopupTileElementAsync(Guid id)
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.GenericPopupTilePath, GitObjectType.Blob).ConfigureAwait(false);

            return GetXmlElement(id, item, "WorldOfForza.WoFTileGenericPopup");
        }

        /// <inheritdoc/>
        public async Task<XElement> GetWorldOfForzaDeeplinkTileElementAsync(Guid id)
        {
            var item = await this.azureDevOpsManager.GetItemAsync(PegasusConstants.DeeplinkTilePath, GitObjectType.Blob).ConfigureAwait(false);

            return GetXmlElement(id, item, "WorldOfForza.WoFTileDeeplink");
        }

        /// <inheritdoc/>
        public async Task<CommitRefProxy> EditWorldOfForzaImageTextTileAsync(WofImageTextBridge wofTileBridge, Guid id)
        {
            var entry = this.mapper.SafeMap<WofImageTextEntry>(wofTileBridge);
            var element = await this.GetWorldOfForzaImageTextTileElementAsync(id).ConfigureAwait(false);
            var commitMessage = string.Format(CultureInfo.InvariantCulture, WelcomeCenterHelpers.StandardCommitMessage, PegasusConstants.WoFTileImageText);

            return await this.CommitWelcomeCenterTileAsync(entry, element, PegasusConstants.ImageTextTilePath, commitMessage).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<CommitRefProxy> EditWorldOfForzaGenericPopupTileAsync(WofGenericPopupBridge wofTileBridge, Guid id)
        {
            var entry = this.mapper.SafeMap<WofGenericPopupEntry>(wofTileBridge);
            var element = await this.GetWorldOfForzaGenericPopupTileElementAsync(id).ConfigureAwait(false);
            var commitMessage = string.Format(CultureInfo.InvariantCulture, WelcomeCenterHelpers.StandardCommitMessage, PegasusConstants.WoFTileGenericPopup);

            return await this.CommitWelcomeCenterTileAsync(entry, element, PegasusConstants.GenericPopupTilePath, commitMessage).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<CommitRefProxy> EditWorldOfForzaDeeplinkTileAsync(WofDeeplinkBridge wofTileBridge, Guid id)
        {
            var entry = this.mapper.SafeMap<WofDeeplinkEntry>(wofTileBridge);
            var element = await this.GetWorldOfForzaDeeplinkTileElementAsync(id).ConfigureAwait(false);
            var commitMessage = string.Format(CultureInfo.InvariantCulture, WelcomeCenterHelpers.StandardCommitMessage, PegasusConstants.WoFTileDeeplink);

            return await this.CommitWelcomeCenterTileAsync(entry, element, PegasusConstants.DeeplinkTilePath, commitMessage).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<PullRequest>> GetPullRequestsAsync(PullRequestStatus status, string subject = null)
        {
            var allPrs = await this.azureDevOpsManager.GetPullRequestsIntoDefaultBranchAsync(status, null).ConfigureAwait(false);

            var filteredPrs = allPrs.Where(pr => pr.CreatedBy.UniqueName.Equals("t10stwrd@microsoft.com", StringComparison.OrdinalIgnoreCase));

            if (!string.IsNullOrEmpty(subject))
            {
                filteredPrs = filteredPrs.Where(pr => pr.Title.Contains(subject, StringComparison.InvariantCulture));
            }

            var formattedPrs = this.mapper.SafeMap<List<PullRequest>>(filteredPrs);

            return formattedPrs;
        }

        /// <inheritdoc/>
        public async Task<GitPullRequest> AbandonPullRequestAsync(int pullRequestId, bool deleteSourceBranch)
        {
            return await this.azureDevOpsManager.AbandonPullRequestAsync(pullRequestId, deleteSourceBranch).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<GitRef>> GetAllBranchesAsync()
        {
            return await this.azureDevOpsManager.GetAllBranchesAsync().ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<Build> RunFormatPipelineAsync(GitPush push)
        {
            return await this.azureDevOpsManager.RunPipelineAsync(
                push, int.Parse(this.formatPipelineBuildDefinition, System.Globalization.CultureInfo.InvariantCulture)).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GitPush> CommitAndPushAsync(CommitRefProxy[] changes)
        {
            return await this.azureDevOpsManager.CommitAndPushAsync(changes).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<PullRequest> CreatePullRequestAsync(GitPush pushed, string pullRequestTitle, string pullRequestDescription)
        {
            var pullrequest = await this.azureDevOpsManager.CreatePullRequestAsync(pushed, pullRequestTitle, pullRequestDescription).ConfigureAwait(false);

            return this.mapper.SafeMap<PullRequest>(pullrequest);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<string>> GetLocalizationCategoriesFromRepoAsync()
        {
            var items = await this.azureDevOpsManager.ListItemsAsync(PegasusConstants.LocalizationFolder).ConfigureAwait(false);
            return items.Skip(1).Select(k => System.IO.Path.GetFileNameWithoutExtension(k.Path[$"{PegasusConstants.LocalizationFolder}/Localization-".Length..]));
        }

        /// <inheritdoc/>
        public async Task<CommitRefProxy> WriteLocalizedStringToPegasusAsync(LocalizedStringBridge localizedString)
        {
            var path = $"{PegasusConstants.LocalizationFolder}/Localization-{localizedString.Category}.xml";

            var item = await this.azureDevOpsManager.GetItemAsync(path, GitObjectType.Blob).ConfigureAwait(false);

            var xmlObj = await item.Content.DeserializeAsync<LocalizedStringRoot>().ConfigureAwait(false);

            var entry = this.mapper.SafeMap<LocEntry>(localizedString);

            xmlObj.LocalizationEntries.Add(entry);

            var appendedXmlStr = await XmlHelpers.SerializeAsync(xmlObj, WelcomeCenterHelpers.SteelheadXmlNamespaces).ConfigureAwait(false);

            // Now fix the CData sections for {scribble:x}base elements
            var xdoc = XDocument.Parse(appendedXmlStr);
            var cdataSearchTarget = WelcomeCenterHelpers.NamespaceElement + "base";
            foreach (var el in xdoc.Descendants(cdataSearchTarget))
            {
                el.FirstNode.ReplaceWith(new XCData(el.Value));
            }

            var finalXmlString = xdoc.ToXmlString();

            var change = new CommitRefProxy()
            {
                CommitMessage = $"Add localized string to {path}",
                NewFileContent = finalXmlString,
                PathToFile = path,
                VersionControlChangeType = VersionControlChangeType.Edit,
            };

            return change;
        }

        private static XElement GetXmlElement(Guid id, GitItem item, string typeNamespace)
        {
            var doc = XDocument.Parse(item.Content);
            var selectedElement = doc.Root.Elements(WelcomeCenterHelpers.NamespaceRoot + typeNamespace)
                .Where(e => e.Attribute(WelcomeCenterHelpers.NamespaceElement + "id")?.Value == id.ToString())
                .FirstOrDefault();
            selectedElement.ShouldNotBeNull(nameof(selectedElement));
            return selectedElement;
        }

        private static Dictionary<Guid, string> GetWelcomeCenterTileDictionary(IEnumerable<WofBaseTileEntry> entries)
        {
            var choices = new Dictionary<Guid, string>();
            foreach (var entry in entries)
            {
                choices.Add(entry.id, entry.FriendlyName);
            }

            return choices;
        }

        private async Task<CommitRefProxy> CommitWelcomeCenterTileAsync(WofBaseTileEntry entry, XElement element, string sourceFilePath, string commitMessage)
        {
            var locstrings = await this.GetLocalizedStringsAsync().ConfigureAwait(false);
            var displayConditions = await this.GetDisplayConditionsAsync().ConfigureAwait(false);
            var tree = WelcomeCenterHelpers.BuildMetaData(entry, new Node(), locstrings, displayConditions);

            // deleted elements will be rewritten.
            foreach (var target in new List<string>() { "Timer", "DisplayConditions", "Destination" })
            {
                element.Elements().Where(k => k.Name.LocalName == target).Remove();
            }

            WelcomeCenterHelpers.FillXml(element, tree);

            var newXml = element.Document.ToXmlString();

            var change = new CommitRefProxy()
            {
                CommitMessage = commitMessage,
                NewFileContent = newXml,
                PathToFile = sourceFilePath,
                VersionControlChangeType = VersionControlChangeType.Edit,
            };

            return change;
        }

        private async Task VerifySlotStatus(string environment, string slot)
        {
            var slotStatus = await this.cmsRetrievalHelper.GetSlotStatusAsync(environment, slot).ConfigureAwait(false);

            if (slotStatus == null)
            {
                throw new PegasusStewardException(
                    $"The environment and slot provided are not supported in {TitleConstants.SteelheadCodeName} Pegasus. Environment: {environment}, Slot: {slot}");
            }
        }

        private string BuildCacheKey(string environment, string slot, string snapshot, string topic)
        {
            return $"{PegasusBaseCacheKey}{environment}_{slot}_{snapshot ?? "current"}_{topic}";
        }
    }
}
