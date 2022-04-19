using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Azure.Documents.SystemFunctions;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.Pegasus;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.Services.CMSRetrieval;

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
    }
}
