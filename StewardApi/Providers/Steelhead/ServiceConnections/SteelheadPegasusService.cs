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
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
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

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.PegasusCmsDefaultSteelhead
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
        public async Task<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>> GetLocalizedStringsAsync()
        {
            var results = new Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>();

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

            return results;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<CarClass>> GetCarClassesAsync()
        {
            var carClassKey = $"{PegasusBaseCacheKey}CarClasses";

            async Task<IEnumerable<CarClass>> GetCarClasses()
            {
                var pegasusCarClasses = await this.cmsRetrievalHelper.GetCMSObjectAsync<IEnumerable<SteelheadLiveOpsContent.CarClass>>(
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

        /// <inheritdoc/>
        public async Task<GitPush> CommitAndPushAsync(CommitRefProxy[] changes)
        {
            GitPush pushed = await this.azureDevOpsManager.CommitAndPushAsync(changes, null).ConfigureAwait(false);

            return pushed;
        }

        /// <inheritdoc/>
        public async Task<GitPullRequest> CreatePullRequestAsync(GitPush pushed, string pullRequestTitle, string pullRequestDescription)
        {
            var pr = await this.azureDevOpsManager.CreatePullRequestAsync(pushed, pullRequestTitle, pullRequestDescription, null).ConfigureAwait(false);

            return pr;
        }

        /// <inheritdoc/>
        public async Task<XElement> GetMessageOfTheDayElementAsync(Guid id)
        {
            var item = await this.azureDevOpsManager.GetItemAsync(this.pathMessageOfTheDay, GitObjectType.Blob, null).ConfigureAwait(false);

            var doc = XDocument.Parse(item.Content);
            var selectedElement = doc.Root.Elements(WelcomeCenterHelpers.NamespaceRoot + "UserMessages.MessageOfTheDay")
                .Where(e => e.Attribute(WelcomeCenterHelpers.NamespaceElement + "id")?.Value == id.ToString())
                .FirstOrDefault();

            selectedElement.ShouldNotBeNull(nameof(selectedElement));

            return selectedElement;
        }

        /// <inheritdoc/>
        public async Task<MessageOfTheDayBridge> GetMessageOfTheDayCurrentValuesAsync(Guid id)
        {
            var item = await this.azureDevOpsManager.GetItemAsync(this.pathMessageOfTheDay, GitObjectType.Blob, null).ConfigureAwait(false);

            var root = await XmlHelpers.DeserializeAsync<MotDXmlRoot>(item.Content).ConfigureAwait(false);
            var entry = root.Entries.Where(motdXml => motdXml.idAttribute == id).First();

            var subset = this.mapper.Map<MessageOfTheDayBridge>(entry);

            return subset;
        }

        /// <inheritdoc/>
        public async Task<Dictionary<Guid, string>> GetMessageOfTheDaySelectionsAsync()
        {
            var item = await this.azureDevOpsManager.GetItemAsync(this.pathMessageOfTheDay, GitObjectType.Blob, null).ConfigureAwait(false);

            var root = await XmlHelpers.DeserializeAsync<MotDXmlRoot>(item.Content).ConfigureAwait(false);

            var choices = new Dictionary<Guid, string>();
            foreach (var entry in root.Entries)
            {
                choices.Add(entry.idAttribute, entry.FriendlyMessageName);
            }

            return choices;
        }

        /// <inheritdoc/>
        public async Task<CommitRefProxy> EditMessageOfTheDayAsync(MessageOfTheDayBridge messageOfTheDayBridge, Guid id, string commitComment)
        {
            var entry = this.mapper.Map<UserMessagesMessageOfTheDay>(messageOfTheDayBridge);

            Node tree = WelcomeCenterHelpers.BuildMetaData(entry, new Node());

            XElement element = await this.GetMessageOfTheDayElementAsync(id).ConfigureAwait(false);

            WelcomeCenterHelpers.FillXml(element, tree);

            // stitching together
            GitItem item = await this.azureDevOpsManager.GetItemAsync(this.pathMessageOfTheDay, GitObjectType.Blob, null).ConfigureAwait(false);
            var root = await XmlHelpers.DeserializeAsync<MotDXmlRoot>(item.Content).ConfigureAwait(false);

            string newXml = await root.StitchAsync(element, root, id).ConfigureAwait(false);

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
        public async Task<WofTileBridge> GetWorldOfForzaCurrentValuesAsync(Guid id)
        {
            GitItem item = await this.azureDevOpsManager.GetItemAsync(this.pathWorldOfForzaTile, GitObjectType.Blob, null).ConfigureAwait(false);

            var root = await XmlHelpers.DeserializeAsync<WofXmlRoot>(item.Content).ConfigureAwait(false);
            WorldOfForzaWoFTileImageText entry = root.Entries.Where(wof => wof.id == id).First();

            var subset = this.mapper.Map<WofTileBridge>(entry);

            return subset;
        }

        /// <inheritdoc/>
        public async Task<Dictionary<Guid, string>> GetWorldOfForzaSelectionsAsync()
        {
            GitItem item = await this.azureDevOpsManager.GetItemAsync(this.pathWorldOfForzaTile, GitObjectType.Blob, null).ConfigureAwait(false);

            WofXmlRoot root = await XmlHelpers.DeserializeAsync<WofXmlRoot>(item.Content).ConfigureAwait(false);

            var choices = new Dictionary<Guid, string>();
            foreach (WorldOfForzaWoFTileImageText entry in root.Entries)
            {
                choices.Add(entry.id, entry.FriendlyName);
            }

            return choices;
        }

        /// <inheritdoc/>
        public async Task<XElement> GetWorldOfForzaElementAsync(Guid id)
        {
            var item = await this.azureDevOpsManager.GetItemAsync(this.pathWorldOfForzaTile, GitObjectType.Blob, null).ConfigureAwait(false);

            var doc = XDocument.Parse(item.Content);
            var selectedElement = doc.Root.Elements(WelcomeCenterHelpers.NamespaceRoot + "WorldOfForza.WoFTileImageText")
                .Where(e => e.Attribute(WelcomeCenterHelpers.NamespaceElement + "id")?.Value == id.ToString())
                .FirstOrDefault();

            selectedElement.ShouldNotBeNull(nameof(selectedElement));

            return selectedElement;
        }

        /// <inheritdoc/>
        public async Task<CommitRefProxy> EditWorldOfForzaTileAsync(WofTileBridge wofTileBridge, Guid id, string commitComment)
        {
            var entry = this.mapper.Map<WorldOfForzaWoFTileImageText>(wofTileBridge);

            Node tree = WelcomeCenterHelpers.BuildMetaData(entry, new Node());

            XElement element = await this.GetWorldOfForzaElementAsync(id).ConfigureAwait(false);

            WelcomeCenterHelpers.FillXml(element, tree);

            // stitching together
            GitItem item = await this.azureDevOpsManager.GetItemAsync(this.pathWorldOfForzaTile, GitObjectType.Blob, null).ConfigureAwait(false);
            var root = await XmlHelpers.DeserializeAsync<WofXmlRoot>(item.Content).ConfigureAwait(false);

            string newXml = await root.StitchAsync(element, root, id).ConfigureAwait(false);

            var change = new CommitRefProxy()
            {
                CommitComment = commitComment,
                NewFileContent = newXml,
                PathToFile = this.pathWorldOfForzaTile,
                VersionControlChangeType = VersionControlChangeType.Edit
            };

            return change;
        }
    }
}
