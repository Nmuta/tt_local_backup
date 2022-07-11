using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FM7.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.Apollo.ServiceConnections;
using Turn10.UGC.Contracts;
using ForzaUGCSearchV2Request = Forza.WebServices.FM7.Generated.ForzaUGCSearchV2Request;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <inheritdoc />
    public sealed class ApolloStorefrontProvider : IApolloStorefrontProvider
    {
        private readonly IApolloService apolloService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloStorefrontProvider"/> class.
        /// </summary>
        public ApolloStorefrontProvider(IApolloService apolloService, IMapper mapper)
        {
            apolloService.ShouldNotBeNull(nameof(apolloService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.apolloService = apolloService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<ApolloUgcItem>> GetPlayerUgcContentAsync(ulong xuid, UgcType ugcType, string endpoint, bool includeThumbnails = false)
        {
            ugcType.ShouldNotBeNull(nameof(ugcType));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            if (ugcType == UgcType.Unknown)
            {
                throw new InvalidArgumentsStewardException("Invalid UGC item type to search: Unknown");
            }

            var mappedContentType = this.mapper.Map<ForzaUGCContentType>(ugcType);
            var results = await this.apolloService.GetPlayerUgcContentAsync(xuid, mappedContentType, endpoint, includeThumbnails).ConfigureAwait(false);

            return this.mapper.Map<IList<ApolloUgcItem>>(results.result);
        }

        /// <inheritdoc />
        public async Task<IList<ApolloUgcItem>> SearchUgcContentAsync(UgcType ugcType, UgcFilters filters, string endpoint, bool includeThumbnails = false)
        {
            ugcType.ShouldNotBeNull(nameof(ugcType));
            filters.ShouldNotBeNull(nameof(filters));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            if (ugcType == UgcType.Unknown)
            {
                throw new InvalidArgumentsStewardException("Invalid UGC item type to search: Unknown");
            }

            var mappedFilters = this.mapper.Map<ForzaUGCSearchV2Request>(filters);
            var mappedContentType = this.mapper.Map<ForzaUGCContentType>(ugcType);
            var results = await this.apolloService.SearchUgcContentAsync(mappedFilters, mappedContentType, endpoint, includeThumbnails).ConfigureAwait(false);

            return this.mapper.Map<IList<ApolloUgcItem>>(results.result);
        }

        /// <inheritdoc />
        public async Task<ApolloUgcLiveryItem> GetUgcLiveryAsync(string liveryId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var liveryOutput = await this.apolloService.GetPlayerLiveryAsync(liveryId, endpoint).ConfigureAwait(false);
            var livery = this.mapper.Map<ApolloUgcLiveryItem>(liveryOutput.result);

            if (livery.GameTitle != (int)GameTitle.FM7)
            {
                throw new NotFoundStewardException($"Livery id could not found: {liveryId}");
            }

            return livery;
        }
    }
}
