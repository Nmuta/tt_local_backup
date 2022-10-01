using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

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
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.Services.CMSRetrieval;
using CarClass = Turn10.LiveOps.StewardApi.Contracts.Common.CarClass;

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

            string steelheadContentPAT = keyVaultProvider.GetSecretAsync(
                configuration[ConfigurationKeyConstants.KeyVaultUrl],
                configuration[ConfigurationKeyConstants.SteelheadContentAccessToken]).GetAwaiter().GetResult();

            string steelheadContentOrgUrl = configuration[ConfigurationKeyConstants.SteelheadContentOrganizationUrl];

            this.azureDevOpsManager = azureDevOpsFactory.Create(
                steelheadContentOrgUrl,
                steelheadContentPAT,
                Guid.ParseExact(configuration[ConfigurationKeyConstants.SteelheadContentProjectId], "D"),
                Guid.ParseExact(configuration[ConfigurationKeyConstants.SteelheadContentRepoId], "D"));
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
        public async Task<Dictionary<Guid, List<string>>> GetLocalizedStringsAsync()
        {
            var results = new Dictionary<Guid, List<string>>();

            var supportedLocales = await this.GetSupportedLocalesAsync().ConfigureAwait(false);
            foreach (var supportedLocale in supportedLocales)
            {
                var filename = $"{LocalizationFileAntecedent}{supportedLocale.Locale}";

                var localizedStrings = await this.cmsRetrievalHelper
                    .GetCMSObjectAsync<Dictionary<Guid, SteelheadLiveOpsContent.LocalizedString>>(
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

        /// <inheritdoc />
        public async Task<GitPush> EditMotDMessagesAsync(Dictionary<XName, string> editsToMake)
        {
            const string messageOfTheDayPath = "GitXml/Data/original.xml";

            GitItem item = await this.azureDevOpsManager.GetItemAsync(messageOfTheDayPath, GitObjectType.Blob, null).ConfigureAwait(false);
            string filecontent = item.Content;

            XDocument doc = XDocument.Parse(filecontent);
            XNamespace nspc = "scribble:title-content";

            foreach (KeyValuePair<XName, string> pair in editsToMake)
            {
                XElement el = doc.Descendants(nspc + $"{pair.Key}").FirstOrDefault();
                if (el != null)
                {
                    el.Value = pair.Value;
                }
            }

            // convert doc to string UTF8, XmlDoc.ToString() returns UTF16
            MemoryStream memory = new ();
            doc.Save(memory);
            string xmlText = Encoding.UTF8.GetString(memory.ToArray());
            await memory.DisposeAsync().ConfigureAwait(false);

            var change = new CommitRefProxy()
            {
                CommitComment = $"Edit Message of the Day",
                NewFileContent = xmlText,
                PathToFile = messageOfTheDayPath,
                VersionControlChangeType = VersionControlChangeType.Edit
            };

            GitPush pushed = await this.azureDevOpsManager.CommitAndPushAsync(new CommitRefProxy[] { change }, null).ConfigureAwait(false);
            return pushed;
        }
    }
}
