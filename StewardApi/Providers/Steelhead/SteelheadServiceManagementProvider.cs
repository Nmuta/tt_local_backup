using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FM8.Generated;
using SteelheadLiveOpsContent;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.Services.LiveOps.FM8.Generated;
using LiveOpsContracts = Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <inheritdoc />
    public sealed class SteelheadServiceManagementProvider : ISteelheadServiceManagementProvider
    {
        private const int GroupLookupMaxResults = 1000;
        private readonly ISteelheadService steelheadService;
        private readonly ILoggingService loggingService;
        private readonly ISteelheadPegasusService steelheadPegasusService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadServiceManagementProvider"/> class.
        /// </summary>
        public SteelheadServiceManagementProvider(
            ISteelheadService steelheadService,
            ILoggingService loggingService,
            ISteelheadPegasusService pegasusService,
            IMapper mapper)
        {
            steelheadService.ShouldNotBeNull(nameof(steelheadService));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.steelheadService = steelheadService;
            this.loggingService = loggingService;
            this.steelheadPegasusService = pegasusService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<LspGroup>> GetLspGroupsAsync(string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var result = await this.steelheadService.GetUserGroupsAsync(0, GroupLookupMaxResults, endpoint)
                    .ConfigureAwait(false);
                var lspGroups = this.mapper.Map<IList<LspGroup>>(result.userGroups);

                if (lspGroups.Count > GroupLookupMaxResults - 50)
                {
                    this.loggingService.LogException(new ApproachingLimitAppInsightsException(
                        $"LSP group lookup for {TitleConstants.SteelheadFullName} is nearing the maximum lookup value."));
                }

                return lspGroups;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No LSP groups found for {TitleConstants.SteelheadFullName}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<Guid> AddStringToLocalizeAsync(LocalizedStringData data, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var forzaLocalizedStringData = this.mapper.Map<ForzaLocalizedStringData>(data);

                var result = await this.steelheadService.AddStringToLocalizeAsync(forzaLocalizedStringData, endpoint)
                    .ConfigureAwait(false);

                return result.localizedStringId;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No racer schedule data found for {TitleConstants.SteelheadFullName}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<SupportedLocale>> GetSupportedLocalesAsync()
        {
            return await this.steelheadPegasusService.GetSupportedLocalesAsync().ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<Dictionary<Guid, List<LiveOpsContracts.LocalizedString>>> GetLocalizedStringsAsync()
        {
            return await this.steelheadPegasusService.GetLocalizedStringsAsync().ConfigureAwait(false);
        }
    }
}
