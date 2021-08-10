using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <inheritdoc />
    public sealed class SteelheadServiceManagementProvider : ISteelheadServiceManagementProvider
    {
        private readonly ISteelheadService steelheadService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadServiceManagementProvider"/> class.
        /// </summary>
        public SteelheadServiceManagementProvider(
            ISteelheadService steelheadService,
            IMapper mapper)
        {
            steelheadService.ShouldNotBeNull(nameof(steelheadService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.steelheadService = steelheadService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<LspGroup>> GetLspGroupsAsync(int startIndex, int maxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            try
            {
                var result = await this.steelheadService.GetUserGroupsAsync(startIndex, maxResults)
                    .ConfigureAwait(false);
                var lspGroups = this.mapper.Map<IList<LspGroup>>(result.userGroups);

                return lspGroups;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No LSP groups found for {TitleConstants.SteelheadFullName}", ex);
            }
        }
    }
}
