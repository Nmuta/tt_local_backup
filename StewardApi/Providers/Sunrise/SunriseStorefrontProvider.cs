using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH4.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunriseStorefrontProvider : ISunriseStorefrontProvider
    {
        private readonly ISunriseService sunriseService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseStorefrontProvider"/> class.
        /// </summary>
        public SunriseStorefrontProvider(ISunriseService sunriseService, IMapper mapper)
        {
            sunriseService.ShouldNotBeNull(nameof(sunriseService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.sunriseService = sunriseService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<UGCItem>> SearchUGCItems(UGCType ugcType, UGCFilters filters, string endpoint)
        {
            ugcType.ShouldNotBeNull(nameof(ugcType));
            filters.ShouldNotBeNull(nameof(filters));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var mappedFilters = this.mapper.Map<ForzaUGCSearchRequest>(filters);
            List<UGCItem> ugcItems;
            switch (ugcType)
            {
                case UGCType.Livery:
                    var nonMappedLiveries = await this.sunriseService.GetPlayerLiveries(mappedFilters, endpoint).ConfigureAwait(false);
                    ugcItems = this.mapper.Map<List<UGCItem>>(nonMappedLiveries.result);
                    break;
                case UGCType.Photo:
                    var nonMappedPhotos = await this.sunriseService.GetPlayerPhotos(mappedFilters, endpoint).ConfigureAwait(false);
                    ugcItems = this.mapper.Map<List<UGCItem>>(nonMappedPhotos.result);
                    break;
                default:
                    throw new InvalidArgumentsStewardException($"Invalid UGC item type to search: {ugcType.ToString()}");
            }

            return ugcItems;
        }

        /// <inheritdoc />
        public async Task<UGCItem> GetUGCLivery(Guid liveryId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var liveryOutput = await this.sunriseService.GetPlayerLivery(liveryId, endpoint).ConfigureAwait(false);

            return this.mapper.Map<UGCItem>(liveryOutput.result);
        }

        /// <inheritdoc />
        public async Task<UGCItem> GetUGCPhoto(Guid photoId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var photoOutput = await this.sunriseService.GetPlayerPhoto(photoId, endpoint).ConfigureAwait(false);

            return this.mapper.Map<UGCItem>(photoOutput.result);
        }

        /// <inheritdoc />
        public async Task SetUGCFeaturedStatus(Guid contentId, bool isFeatured, TimeSpan? featuredExpiry, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var featureEndDate = isFeatured && featuredExpiry.HasValue ? DateTime.UtcNow.Add(featuredExpiry.Value) : DateTime.MinValue;
                await this.sunriseService.SetUGCFeaturedStatus(contentId, isFeatured, featureEndDate, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException(
                    $"An unknown exception occurred while setting featured status of content item: {contentId}", ex);
            }
        }
    }
}
