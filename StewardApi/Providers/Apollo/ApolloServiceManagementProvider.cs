using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <inheritdoc />
    public sealed class ApolloServiceManagementProvider : IApolloServiceManagementProvider
    {
        private readonly IApolloService apolloService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloServiceManagementProvider"/> class.
        /// </summary>
        public ApolloServiceManagementProvider(
            IApolloService apolloService,
            IMapper mapper)
        {
            apolloService.ShouldNotBeNull(nameof(apolloService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.apolloService = apolloService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<LspGroup>> GetLspGroupsAsync(int startIndex, int maxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            try
            {
                var result = await this.apolloService.GetUserGroupsAsync(startIndex, maxResults)
                    .ConfigureAwait(false);
                var lspGroups = this.mapper.Map<IList<LspGroup>>(result.userGroups);

                return lspGroups;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No LSP groups found for {TitleConstants.ApolloFullName}", ex);
            }
        }
    }
}
