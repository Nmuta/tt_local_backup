using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH4.Generated;
using Forza.UserGeneratedContent.FH4.Generated;
using Forza.WebServices.FH4.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using Turn10.UGC.Contracts;
using static Forza.WebServices.FH4.Generated.StorefrontService;
using FileType = Forza.UserGeneratedContent.FH4.Generated.FileType;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunriseStorefrontProvider : ISunriseStorefrontProvider
    {
        private readonly ISunriseServiceFactory sunriseFactory;
        private readonly ISunriseService sunriseService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseStorefrontProvider"/> class.
        /// </summary>
        public SunriseStorefrontProvider(ISunriseServiceFactory sunriseFactory, ISunriseService sunriseService, IMapper mapper)
        {
            sunriseFactory.ShouldNotBeNull(nameof(sunriseFactory));
            sunriseService.ShouldNotBeNull(nameof(sunriseService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.sunriseFactory = sunriseFactory;
            this.sunriseService = sunriseService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<UgcItem>> SearchUgcContentAsync(UGCType ugcType, UGCFilters filters, string endpoint)
        {
            ugcType.ShouldNotBeNull(nameof(ugcType));
            filters.ShouldNotBeNull(nameof(filters));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            if (ugcType == UGCType.Unknown)
            {
                throw new InvalidArgumentsStewardException("Invalid UGC item type to search: Unknown");
            }

            var mappedFilters = this.mapper.Map<ForzaUGCSearchRequest>(filters);
            var mappedContentType = this.mapper.Map<ForzaUGCContentType>(ugcType);
            var results = await this.sunriseService.SearchUgcContentAsync(mappedFilters, mappedContentType, endpoint).ConfigureAwait(false);

            return this.mapper.Map<IList<UgcItem>>(results.result);
        }

        /// <inheritdoc />
        public async Task<UgcItem> GetUGCLiveryAsync(Guid liveryId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var liveryOutput = await this.sunriseService.GetPlayerLiveryAsync(liveryId, endpoint).ConfigureAwait(false);
            var livery = this.mapper.Map<UgcItem>(liveryOutput.result);

            if (livery.GameTitle != (int)GameTitle.FH4)
            {
                throw new NotFoundStewardException($"Livery id could not found: {liveryId}");
            }

            return livery;
        }

        /// <inheritdoc />
        public async Task<UgcItem> GetUGCPhotoAsync(Guid photoId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var photoOutput = await this.sunriseService.GetPlayerPhotoAsync(photoId, endpoint).ConfigureAwait(false);
            var photo = this.mapper.Map<UgcItem>(photoOutput.result);

            if (photo.GameTitle != (int)GameTitle.FH4)
            {
                throw new NotFoundStewardException($"Photo id could not found: {photoId}");
            }

            return photo;
        }

        /// <inheritdoc />
        public async Task<UgcItem> GetUGCTuneAsync(Guid tuneId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var tuneOutput = await this.sunriseService.GetPlayerTuneAsync(tuneId, endpoint).ConfigureAwait(false);
            var tune = this.mapper.Map<UgcItem>(tuneOutput.result);

            if (tune.GameTitle != (int)GameTitle.FH4)
            {
                throw new NotFoundStewardException($"Tune id could not found: {tuneId}");
            }

            return tune;
        }

        /// <inheritdoc />
        public async Task SetUGCFeaturedStatusAsync(Guid contentId, bool isFeatured, TimeSpan? featuredExpiry, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var featureEndDate = isFeatured && featuredExpiry.HasValue ? DateTime.UtcNow.Add(featuredExpiry.Value) : DateTime.MinValue;
                await this.sunriseService.SetUGCFeaturedStatusAsync(contentId, isFeatured, featureEndDate, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException(
                    $"An unknown exception occurred while setting featured status of content item: {contentId}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<AuctionData> GetAuctionDataAsync(
            Guid auctionId,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var forzaAuctions = await this.sunriseService.GetAuctionDataAsync(auctionId, endpoint).ConfigureAwait(false);

                return this.mapper.Map<AuctionData>(forzaAuctions);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Auction Data lookup failed for auction {auctionId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<HideableUgc>> GetHiddenUGCForUser(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var storefrontService = await this.sunriseFactory.PrepareStorefrontServiceAsync(endpoint).ConfigureAwait(false);
            var exceptions = new List<Exception>();
            var defaultValue = new GetHiddenUGCForUserOutput() { ugcData = Array.Empty<ForzaStorefrontFile>() };
            var liveries = storefrontService.GetHiddenUGCForUser(100, xuid, FileType.Livery).SuccessOrDefault(defaultValue, exceptions);
            var layerGroups = storefrontService.GetHiddenUGCForUser(100, xuid, FileType.LayerGroup).SuccessOrDefault(defaultValue, exceptions);
            var photos = storefrontService.GetHiddenUGCForUser(100, xuid, FileType.Photo).SuccessOrDefault(defaultValue, exceptions);

            await Task.WhenAll(liveries, layerGroups, photos).ConfigureAwait(false);

            var results = new List<ForzaStorefrontFile>();
            if (liveries.IsCompletedSuccessfully)
            {
                results.AddRange(liveries.GetAwaiter().GetResult().ugcData);
            }

            if (layerGroups.IsCompletedSuccessfully)
            {
                results.AddRange(layerGroups.GetAwaiter().GetResult().ugcData);
            }

            if (photos.IsCompletedSuccessfully)
            {
                results.AddRange(photos.GetAwaiter().GetResult().ugcData);
            }

            var convertedResults = this.mapper.Map<List<HideableUgc>>(results);

            return convertedResults;
        }
    }
}
