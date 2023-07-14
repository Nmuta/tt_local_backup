using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FM8.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.V2
{
    /// <inheritdoc />
    public sealed class SteelheadServiceManagementProvider : ISteelheadServiceManagementProvider
    {
        private const int GroupLookupMaxResults = 5_000;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadServiceManagementProvider"/> class.
        /// </summary>
        public SteelheadServiceManagementProvider(ILoggingService loggingService, IMapper mapper)
        {
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.loggingService = loggingService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<LspGroup>> GetUserGroupsAsync(SteelheadProxyBundle services)
        {

            UserManagementService.GetUserGroupsOutput result = null;

            try
            {
                result = await services.UserManagementService.GetUserGroups(0, GroupLookupMaxResults).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to retrieve user groups for title: {TitleConstants.SteelheadFullName}", ex);
            }

            var lspGroups = this.mapper.SafeMap<IList<LspGroup>>(result.userGroups);

            if (lspGroups.Count > GroupLookupMaxResults - 50)
            {
                this.loggingService.LogException(new ApproachingLimitAppInsightsException(
                    $"LSP group lookup for {TitleConstants.SteelheadFullName} is nearing the maximum lookup value."));
            }

            return lspGroups;
        }
    }
}
