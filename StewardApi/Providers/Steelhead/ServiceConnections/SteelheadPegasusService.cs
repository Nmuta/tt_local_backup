using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using AutoMapper;
using Microsoft.Azure.Documents.SystemFunctions;
using Microsoft.Extensions.Configuration;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using SteelheadLiveOpsContent;
using StewardGitApi;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Git;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.MessageOfTheDay;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.Services.CMSRetrieval;
using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;
using LiveOpsContracts = Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections
{
    /// <inheritdoc />
    public sealed class SteelheadPegasusService : ISteelheadPegasusService
    {
        private const string PegasusBaseCacheKey = "SteelheadPegasus_";
        private const string LocalizationFileAntecedent = "LiveOps_LocalizationStrings-";
        private const string LocalizationStringIdsMappings = "LiveOps_LocalizationStringMappings";

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.PegasusCmsDefaultSteelhead,
            ConfigurationKeyConstants.SteelheadMessageOfTheDayPath,
            ConfigurationKeyConstants.SteelheadWorldOfForzaPath,
            ConfigurationKeyConstants.KeyVaultUrl,
            ConfigurationKeyConstants.SteelheadContentAccessToken,
            ConfigurationKeyConstants.SteelheadContentOrganizationUrl,
            ConfigurationKeyConstants.SteelheadContentProjectId,
            ConfigurationKeyConstants.SteelheadContentRepoId,
        };

        private readonly string cmsEnvironment;
        private readonly string pathMessageOfTheDay;
        private readonly string pathWorldOfForzaTile;
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
            IKeyVaultProvider keyVaultProvider,
            IRefreshableCacheStore refreshableCacheStore,
            IMapper mapper,
            IConfiguration configuration,
            ILoggingService loggingService)
        {
            pegasusCmsProvider.ShouldNotBeNull(nameof(pegasusCmsProvider));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            azureDevOpsFactory.ShouldNotBeNull(nameof(azureDevOpsFactory));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));

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
            this.pathMessageOfTheDay = configuration[ConfigurationKeyConstants.SteelheadMessageOfTheDayPath];
            this.pathWorldOfForzaTile = configuration[ConfigurationKeyConstants.SteelheadWorldOfForzaPath];

            string steelheadContentPAT = keyVaultProvider.GetSecretAsync(
                configuration[ConfigurationKeyConstants.KeyVaultUrl],
                configuration[ConfigurationKeyConstants.SteelheadContentAccessToken]).GetAwaiter().GetResult();

            this.azureDevOpsManager = azureDevOpsFactory.Create(
                configuration[ConfigurationKeyConstants.SteelheadContentOrganizationUrl],
                steelheadContentPAT,
                Guid.Parse(configuration[ConfigurationKeyConstants.SteelheadContentProjectId]),
                Guid.Parse(configuration[ConfigurationKeyConstants.SteelheadContentRepoId]));
        }

        /// <inheritdoc />
        public async Task<IEnumerable<SupportedLocale>> GetSupportedLocalesAsync()
        {
            var locales =
                await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<SteelheadLiveOpsContent.SupportedLocale>>(
                    SteelheadLiveOpsContent.CMSFileNames.SupportedLocales,
                    this.cmsEnvironment,
                    slot: "daily").ConfigureAwait(false);

            return locales;
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>> GetLocalizedStringsAsync(bool useInternalIds = true)
        {
            var localizedStringCacheKey = $"{PegasusBaseCacheKey}LocalizedStrings{(useInternalIds ? "_useInternalIds" : string.Empty)}";

            async Task<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>> GetLocalizedStrings(bool useInternalIds)
            {
                var results = new Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>();

                var localizationIdsMapping = await this.cmsRetrievalHelper
                    .GetCMSObjectAsync<Dictionary<Guid, Guid>>(
                        LocalizationStringIdsMappings,
                        this.cmsEnvironment,
                        slot: "daily").ConfigureAwait(false);

                var supportedLocales = await this.GetSupportedLocalesAsync().ConfigureAwait(false);
                foreach (var supportedLocale in supportedLocales)
                {
                    var filename = $"{LocalizationFileAntecedent}{supportedLocale.Locale}";

                    var localizedStrings = await this.cmsRetrievalHelper
                        .GetCMSObjectAsync<Dictionary<Guid, SteelheadLiveOpsContent.LocalizedString>>(
                            filename,
                            this.cmsEnvironment,
                            slot: "daily").ConfigureAwait(false);

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

                this.refreshableCacheStore.PutItem(localizedStringCacheKey, TimeSpan.FromMinutes(1), results);

                // Remap the ids to the right ids from the mapping file
                if (useInternalIds)
                {
                    return results
                        .Where(p => localizationIdsMapping.ContainsKey(p.Key))
                        .ToDictionary(p => localizationIdsMapping[p.Key], p => p.Value);
                }

                return results;
            }

            return this.refreshableCacheStore.GetItem<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>>(localizedStringCacheKey)
                   ?? await GetLocalizedStrings(useInternalIds).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<CarClass>> GetCarClassesAsync(string pegasusEnvironment, string slotId = SteelheadPegasusSlot.Daily)
        {
            var carClassKey = $"{PegasusBaseCacheKey}CarClasses";

            async Task<IEnumerable<CarClass>> GetCarClasses(string pegasusEnvironment, string slotId = SteelheadPegasusSlot.Daily)
            {
                var slotStatus = await this.cmsRetrievalHelper.GetSlotStatusAsync(pegasusEnvironment, slotId).ConfigureAwait(false);

                if (slotStatus == null)
                {
                    throw new PegasusStewardException(
                        $"The environment and slot provided are not supported in {TitleConstants.SteelheadCodeName} Pegasus. Environment: {pegasusEnvironment}, Slot: {slotId}");
                }

                var pegasusCarClasses = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<SteelheadLiveOpsContent.CarClass>>(
                    CMSFileNames.CarClasses,
                    this.cmsEnvironment,
                    slot: slotId).ConfigureAwait(false);
                var carClasses = this.mapper.Map<IEnumerable<CarClass>>(pegasusCarClasses);

                this.refreshableCacheStore.PutItem(carClassKey, TimeSpan.FromDays(7), carClasses);

                return carClasses;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<CarClass>>(carClassKey)
                   ?? await GetCarClasses(pegasusEnvironment ?? this.cmsEnvironment, slotId).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync(string pegasusEnvironment, string slotId = SteelheadPegasusSlot.Daily)
        {
            var slotStatus = await this.cmsRetrievalHelper.GetSlotStatusAsync(pegasusEnvironment, slotId).ConfigureAwait(false);

            if (slotStatus == null)
            {
                throw new PegasusStewardException(
                    $"The environment and slot provided are not supported in {TitleConstants.SteelheadCodeName} Pegasus. Environment: {pegasusEnvironment}, Slot: {slotId}");
            }

            var leaderboardsKey = $"{PegasusBaseCacheKey}{pegasusEnvironment}_Leaderboards";

            async Task<IEnumerable<Leaderboard>> GetLeaderboards()
            {
                var filename = CMSFileNames.RivalEvents.Replace("{:loc}", "en-US");
                var pegasusLeaderboards = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<RivalEvent>>(filename, pegasusEnvironment, slot: slotId).ConfigureAwait(false);
                var leaderboards = this.mapper.Map<IEnumerable<Leaderboard>>(pegasusLeaderboards);

                this.refreshableCacheStore.PutItem(leaderboardsKey, TimeSpan.FromHours(1), leaderboards);

                return leaderboards;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<Leaderboard>>(leaderboardsKey)
                   ?? await GetLeaderboards().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<DataCar>> GetCarsAsync(string slotId = SteelheadPegasusSlot.Daily)
        {
            var slotStatus = await this.cmsRetrievalHelper.GetSlotStatusAsync(this.cmsEnvironment, slotId).ConfigureAwait(false);

            if (slotStatus == null)
            {
                throw new PegasusStewardException(
                    $"The environment and slot provided are not supported in {TitleConstants.SteelheadCodeName} Pegasus. Environment: {this.cmsEnvironment}, Slot: {slotId}");
            }

            var carsKey = $"{PegasusBaseCacheKey}{slotId}_Cars";

            async Task<IEnumerable<DataCar>> GetCars()
            {
                var cars = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<DataCar>>(CMSFileNames.DataCars, this.cmsEnvironment, slot: slotId).ConfigureAwait(false);

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
        public async Task<IEnumerable<VanityItem>> GetVanityItemsAsync(string slotId = SteelheadPegasusSlot.Daily)
        {
            var slotStatus = await this.cmsRetrievalHelper.GetSlotStatusAsync(this.cmsEnvironment, slotId).ConfigureAwait(false);

            if (slotStatus == null)
            {
                throw new PegasusStewardException(
                    $"The environment and slot provided are not supported in {TitleConstants.SteelheadCodeName} Pegasus. Environment: {this.cmsEnvironment}, Slot: {slotId}");
            }

            var vanityItemsKey = $"{PegasusBaseCacheKey}VanityItems";

            async Task<IEnumerable<VanityItem>> GetVanityItems()
            {
                var vanityItems = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<VanityItem>>(CMSFileNames.VanityItems, this.cmsEnvironment, slot: slotId).ConfigureAwait(false);

                this.refreshableCacheStore.PutItem(vanityItemsKey, TimeSpan.FromDays(1), vanityItems);

                return vanityItems;
            }

            return this.refreshableCacheStore.GetItem<IEnumerable<VanityItem>>(vanityItemsKey)
                   ?? await GetVanityItems().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, SteelheadLiveOpsContent.ChampionshipPlaylistDataV3>> GetRacersCupPlaylistDataV3Async(string pegasusEnvironment = null, string pegasusSlot = null, string pegasusSnapshot = null)
        {
            pegasusEnvironment ??= this.cmsEnvironment;
            pegasusSlot ??= SteelheadPegasusSlot.Daily;

            var playlists = await this.cmsRetrievalHelper.GetCMSObjectAsync<Dictionary<Guid, SteelheadLiveOpsContent.ChampionshipPlaylistDataV3>>(
                CMSFileNames.PlaylistDataForService,
                environment: pegasusEnvironment,
                slot: pegasusSlot,
                snapshot: pegasusSnapshot).ConfigureAwait(false);

            return playlists;
        }

        /// <inheritdoc />
        public async Task<SteelheadLiveOpsContent.RacersCupChampionships> GetRacersCupChampionshipScheduleV4Async(string pegasusEnvironment, string pegasusSlot = null, string pegasusSnapshot = null)
        {
            pegasusEnvironment ??= this.cmsEnvironment;
            pegasusSlot ??= SteelheadPegasusSlot.Daily;

            var fileName = "LiveOps_RacersCupChampionshipScheduleV4";
            var scheduleData = await this.cmsRetrievalHelper.GetCMSObjectAsync<SteelheadLiveOpsContent.RacersCupChampionships>(
                fileName,
                environment: pegasusEnvironment,
                slot: pegasusSlot,
                snapshot: pegasusSnapshot).ConfigureAwait(false);

            return scheduleData;
        }

        /// <inheritdoc />
        public async Task<SteelheadLiveOpsContent.BuildersCupCupDataV3> GetBuildersCupFeaturedCupLadderAsync()
        {
            var pegasusSlot = SteelheadPegasusSlot.Daily; // This will need to be updated once Live slot is ready
            var fileName = "LiveOps_BuildersCupFeaturedCup-en-US";

            var featuredCupData = await this.cmsRetrievalHelper.GetCMSObjectAsync<SteelheadLiveOpsContent.BuildersCupCupDataV3[]>(
                fileName,
                environment: this.cmsEnvironment,
                slot: pegasusSlot).ConfigureAwait(false);

            return featuredCupData.Single();
        }

        /// <inheritdoc/>
        public async Task<SteelheadLiveOpsContent.WorldOfForzaConfigV3> GetWelcomeCenterDataAsync()
        {
            var filename = CMSFileNames.WorldOfForzaConfig;
            var wofConfig = await this.cmsRetrievalHelper.GetCMSObjectAsync<SteelheadLiveOpsContent.WorldOfForzaConfigV3>(filename, this.cmsEnvironment, slot: "daily").ConfigureAwait(false);

            return wofConfig;
        }

        /// <inheritdoc/>
        public async Task<SteelheadLiveOpsContent.WorldOfForzaTileCMSCollection> GetWelcomeCenterTileDataAsync()
        {
            var filename = CMSFileNames.WorldOfForzaTileCMSData.Replace("{:loc}", "en-US");
            var wofTileCollection = await this.cmsRetrievalHelper.GetCMSObjectAsync<SteelheadLiveOpsContent.WorldOfForzaTileCMSCollection>(filename, this.cmsEnvironment, slot: "daily").ConfigureAwait(false);

            return wofTileCollection;
        }

        /// <inheritdoc/>
        public async Task<GitPush> CommitAndPushAsync(CommitRefProxy[] changes)
        {
            var pushed = await this.azureDevOpsManager.CommitAndPushAsync(changes, null).ConfigureAwait(false);

            return pushed;
        }

        /// <inheritdoc/>
        public async Task<PullRequest> CreatePullRequestAsync(GitPush pushed, string pullRequestTitle, string pullRequestDescription)
        {
            var pullrequest = await this.azureDevOpsManager.CreatePullRequestAsync(pushed, pullRequestTitle, pullRequestDescription, null).ConfigureAwait(false);

            var formattedPr = this.mapper.Map<PullRequest>(pullrequest);

            return formattedPr;
        }

        /// <inheritdoc/>
        public async Task<XElement> GetMessageOfTheDayElementAsync(Guid id)
        {
            GitItem item = await this.azureDevOpsManager.GetItemAsync(this.pathMessageOfTheDay, GitObjectType.Blob, null).ConfigureAwait(false);

            XDocument doc = XDocument.Parse(item.Content);
            var selectedElement = doc.Root.Elements(WelcomeCenterHelpers.NamespaceRoot + "UserMessages.MessageOfTheDay")
                .Where(e => e.Attribute(WelcomeCenterHelpers.NamespaceElement + "id")?.Value == id.ToString())
                .FirstOrDefault();

            selectedElement.ShouldNotBeNull(nameof(selectedElement));

            return selectedElement;
        }

        /// <inheritdoc/>
        public async Task<MotdBridge> GetMessageOfTheDayCurrentValuesAsync(Guid id)
        {
            GitItem item = await this.azureDevOpsManager.GetItemAsync(this.pathMessageOfTheDay, GitObjectType.Blob, null).ConfigureAwait(false);

            MotdRoot root = await item.Content.DeserializeAsync<MotdRoot>().ConfigureAwait(false);
            MotdEntry entry = root.Entries.Where(motd => motd.idAttribute == id).First();

            var subset = this.mapper.Map<MotdBridge>(entry);

            return subset;
        }

        /// <inheritdoc/>
        public async Task<Dictionary<Guid, string>> GetMessageOfTheDaySelectionsAsync()
        {
            GitItem item = await this.azureDevOpsManager.GetItemAsync(this.pathMessageOfTheDay, GitObjectType.Blob, null).ConfigureAwait(false);
            MotdRoot root = await item.Content.DeserializeAsync<MotdRoot>().ConfigureAwait(false);

            var choices = new Dictionary<Guid, string>();
            foreach (var entry in root.Entries)
            {
                choices.Add(entry.idAttribute, entry.FriendlyMessageName);
            }

            return choices;
        }

        /// <inheritdoc/>
        public async Task<CommitRefProxy> EditMessageOfTheDayAsync(MotdBridge messageOfTheDayBridge, Guid id, string commitComment)
        {
            var entry = this.mapper.Map<MotdEntry>(messageOfTheDayBridge);
            var locstrings = await this.GetLocalizedStringsAsync().ConfigureAwait(false);
            Node tree = WelcomeCenterHelpers.BuildMetaData(entry, new Node(), locstrings);

            XElement element = await this.GetMessageOfTheDayElementAsync(id).ConfigureAwait(false);

            WelcomeCenterHelpers.FillXml(element, tree);

            string newXml = element.Document.ToXmlString();

            var change = new CommitRefProxy()
            {
                CommitComment = commitComment,
                NewFileContent = newXml,
                PathToFile = this.pathMessageOfTheDay,
                VersionControlChangeType = VersionControlChangeType.Edit
            };

            return change;
        }

        /// <inheritdoc/>
        public async Task<WofBridge> GetWorldOfForzaCurrentValuesAsync(Guid id)
        {
            GitItem item = await this.azureDevOpsManager.GetItemAsync(this.pathWorldOfForzaTile, GitObjectType.Blob, null).ConfigureAwait(false);

            WofRoot root = await item.Content.DeserializeAsync<WofRoot>().ConfigureAwait(false);
            WofEntry entry = root.Entries.Where(wof => wof.id == id).First();

            var subset = this.mapper.Map<WofBridge>(entry);

            return subset;
        }

        /// <inheritdoc/>
        public async Task<Dictionary<Guid, string>> GetWorldOfForzaSelectionsAsync()
        {
            GitItem item = await this.azureDevOpsManager.GetItemAsync(this.pathWorldOfForzaTile, GitObjectType.Blob, null).ConfigureAwait(false);
            WofRoot root = await item.Content.DeserializeAsync<WofRoot>().ConfigureAwait(false);

            var choices = new Dictionary<Guid, string>();
            foreach (WofEntry entry in root.Entries)
            {
                choices.Add(entry.id, entry.FriendlyName);
            }

            return choices;
        }

        /// <inheritdoc/>
        public async Task<XElement> GetWorldOfForzaElementAsync(Guid id)
        {
            GitItem item = await this.azureDevOpsManager.GetItemAsync(this.pathWorldOfForzaTile, GitObjectType.Blob, null).ConfigureAwait(false);

            XDocument doc = XDocument.Parse(item.Content);
            var selectedElement = doc.Root.Elements(WelcomeCenterHelpers.NamespaceRoot + "WorldOfForza.WoFTileImageText")
                .Where(e => e.Attribute(WelcomeCenterHelpers.NamespaceElement + "id")?.Value == id.ToString())
                .FirstOrDefault();

            selectedElement.ShouldNotBeNull(nameof(selectedElement));

            return selectedElement;
        }

        /// <inheritdoc/>
        public async Task<CommitRefProxy> EditWorldOfForzaTileAsync(WofBridge wofTileBridge, Guid id, string commitComment)
        {
            var entry = this.mapper.Map<WofEntry>(wofTileBridge);
            var locstrings = await this.GetLocalizedStringsAsync().ConfigureAwait(false);
            Node tree = WelcomeCenterHelpers.BuildMetaData(entry, new Node(), locstrings);

            XElement element = await this.GetWorldOfForzaElementAsync(id).ConfigureAwait(false);

            WelcomeCenterHelpers.FillXml(element, tree);

            string newXml = element.Document.ToXmlString();

            var change = new CommitRefProxy()
            {
                CommitComment = commitComment,
                NewFileContent = newXml,
                PathToFile = this.pathWorldOfForzaTile,
                VersionControlChangeType = VersionControlChangeType.Edit
            };

            return change;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<PullRequest>> GetPullRequestsAsync(PullRequestStatus status, string subject = null)
        {
            var allPrs = await this.azureDevOpsManager.GetPullRequestsIntoDefaultBranchAsync(status, null, null).ConfigureAwait(false);

            var filteredPrs = allPrs.Where(pr => pr.CreatedBy.UniqueName.Equals("t10stwrd@microsoft.com", StringComparison.OrdinalIgnoreCase));

            if (!string.IsNullOrEmpty(subject))
            {
                filteredPrs = filteredPrs.Where(pr => pr.Title.Contains(subject, StringComparison.InvariantCulture));
            }

            var formattedPrs = this.mapper.Map<List<PullRequest>>(filteredPrs);

            return formattedPrs;
        }

        /// <inheritdoc/>
        public async Task<GitPullRequest> AbandonPullRequestAsync(int pullRequestId)
        {
            var pullRequest = await this.azureDevOpsManager.AbandonPullRequestAsync(pullRequestId).ConfigureAwait(false);

            return pullRequest;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<GitRef>> GetAllBranchesAsync()
        {
            var branches = await this.azureDevOpsManager.GetAllBranchesAsync().ConfigureAwait(false);

            return branches;
        }
    }
}
