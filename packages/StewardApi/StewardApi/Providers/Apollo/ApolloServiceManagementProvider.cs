﻿using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <inheritdoc />
    public sealed class ApolloServiceManagementProvider : IApolloServiceManagementProvider
    {
        private const int GroupLookupMaxResults = 1000;
        private readonly IApolloService apolloService;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloServiceManagementProvider"/> class.
        /// </summary>
        public ApolloServiceManagementProvider(
            IApolloService apolloService,
            ILoggingService loggingService,
            IMapper mapper)
        {
            apolloService.ShouldNotBeNull(nameof(apolloService));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.apolloService = apolloService;
            this.loggingService = loggingService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<LspGroup>> GetLspGroupsAsync(string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            Forza.WebServices.FM7.Generated.UserManagementService.GetUserGroupsOutput result = null;

            try
            {
                result = await this.apolloService.GetUserGroupsAsync(0, GroupLookupMaxResults, endpoint)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No LSP groups found for {TitleConstants.ApolloFullName}", ex);
            }

            var lspGroups = this.mapper.SafeMap<IList<LspGroup>>(result.userGroups);

            if (lspGroups.Count > GroupLookupMaxResults - 50)
            {
                this.loggingService.LogException(new ApproachingLimitAppInsightsException(
                    $"LSP group lookup for {TitleConstants.ApolloFullName} is nearing the maximum lookup value."));
            }

            return lspGroups;
        }
    }
}
