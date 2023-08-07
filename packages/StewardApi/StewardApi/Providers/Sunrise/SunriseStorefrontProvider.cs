using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH4.Generated;
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
        public async Task<IList<UgcItem>> SearchUgcContentAsync(UgcType ugcType, UgcFilters filters, string endpoint, bool includeThumbnails = false)
        {
            ugcType.ShouldNotBeNull(nameof(ugcType));
            filters.ShouldNotBeNull(nameof(filters));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            if (ugcType == UgcType.Unknown)
            {
                throw new InvalidArgumentsStewardException("Invalid UGC item type to search: Unknown");
            }

            var mappedFilters = this.mapper.SafeMap<ForzaUGCSearchRequest>(filters);
            var mappedContentType = this.mapper.SafeMap<ForzaUGCContentType>(ugcType);
            var results = await this.sunriseService.SearchUgcContentAsync(mappedFilters, mappedContentType, endpoint, includeThumbnails).ConfigureAwait(false);

            return this.mapper.SafeMap<IList<UgcItem>>(results.result);
        }

        /// <inheritdoc />
        public async Task<UgcLiveryItem> GetUgcLiveryAsync(Guid liveryId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var liveryOutput = await this.sunriseService.GetPlayerLiveryAsync(liveryId, endpoint).ConfigureAwait(false);
            var livery = this.mapper.SafeMap<UgcLiveryItem>(liveryOutput.result);

            if (livery.GameTitle != (int)GameTitle.FH4)
            {
                throw new NotFoundStewardException($"Livery id could not found: {liveryId}");
            }

            return livery;
        }

        /// <inheritdoc />
        public async Task<UgcItem> GetUgcPhotoAsync(Guid photoId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var photoOutput = await this.sunriseService.GetPlayerPhotoAsync(photoId, endpoint).ConfigureAwait(false);
            var photo = this.mapper.SafeMap<UgcItem>(photoOutput.result);

            if (photo.GameTitle != (int)GameTitle.FH4)
            {
                throw new NotFoundStewardException($"Photo id could not found: {photoId}");
            }

            return photo;
        }

        /// <inheritdoc />
        public async Task<UgcItem> GetUgcTuneAsync(Guid tuneId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var tuneOutput = await this.sunriseService.GetPlayerTuneAsync(tuneId, endpoint).ConfigureAwait(false);
            var tune = this.mapper.SafeMap<UgcItem>(tuneOutput.result);

            if (tune.GameTitle != (int)GameTitle.FH4)
            {
                throw new NotFoundStewardException($"Tune id could not found: {tuneId}");
            }

            return tune;
        }

        /// <inheritdoc />
        public async Task<UgcItem> GetUgcLayerGroupAsync(Guid layerGroupId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var layerGroupOutput = await this.sunriseService.GetPlayerUgcObjectAsync(layerGroupId, endpoint).ConfigureAwait(false);
            var layerGroup = this.mapper.SafeMap<UgcItem>(layerGroupOutput.result);

            if (layerGroup.GameTitle != (int)GameTitle.FH4)
            {
                throw new NotFoundStewardException($"Layer Group id could not found: {layerGroupId}");
            }

            return layerGroup;
        }

        /// <inheritdoc />
        public async Task<UgcItem> GetUgcEventBlueprintAsync(Guid eventBlueprintId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var eventBlueprintOutput = await this.sunriseService.GetPlayerUgcObjectAsync(eventBlueprintId, endpoint).ConfigureAwait(false);
            var eventBlueprint = this.mapper.SafeMap<UgcItem>(eventBlueprintOutput.result);

            if (eventBlueprint.GameTitle != (int)GameTitle.FH4)
            {
                throw new NotFoundStewardException($"Tune id could not found: {eventBlueprintId}");
            }

            return eventBlueprint;
        }

        /// <inheritdoc />
        public async Task SetUgcFeaturedStatusAsync(Guid contentId, bool isFeatured, TimeSpan? featuredExpiry, TimeSpan? forceFeaturedExpiry, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var featureEndDate = isFeatured && featuredExpiry.HasValue ? DateTime.UtcNow.Add(featuredExpiry.Value) : DateTime.MinValue;
                var forceFeatureEndDate = isFeatured && forceFeaturedExpiry.HasValue ? DateTime.UtcNow.Add(forceFeaturedExpiry.Value) : DateTime.MinValue;
                await this.sunriseService.SetUgcFeaturedStatusAsync(contentId, isFeatured, featureEndDate, forceFeatureEndDate, endpoint).ConfigureAwait(false);
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

            Forza.LiveOps.FH4.Generated.ForzaAuction forzaAuctions = null;

            try
            {
                forzaAuctions = await this.sunriseService.GetAuctionDataAsync(auctionId, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Auction Data lookup failed for auction {auctionId}.", ex);
            }

            return this.mapper.SafeMap<AuctionData>(forzaAuctions);
        }

        /// <inheritdoc />
        [SuppressMessage("Usage", "VSTHRD103:GetResult synchronously blocks", Justification = "Used in conjunction with Task.WhenAll")]
        public async Task<IList<HideableUgc>> GetHiddenUgcForUserAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var exceptions = new List<Exception>();
            var defaultValue = new GetHiddenUGCForUserOutput() { ugcData = Array.Empty<ForzaStorefrontFile>() };
            var liveries = this.sunriseService.GetHiddenUgcForUserAsync(100, xuid, FileType.Livery, endpoint).SuccessOrDefault(defaultValue, exceptions);
            var layerGroups = this.sunriseService.GetHiddenUgcForUserAsync(100, xuid, FileType.LayerGroup, endpoint).SuccessOrDefault(defaultValue, exceptions);
            var photos = this.sunriseService.GetHiddenUgcForUserAsync(100, xuid, FileType.Photo, endpoint).SuccessOrDefault(defaultValue, exceptions);

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

            var convertedResults = this.mapper.SafeMap<List<HideableUgc>>(results);

            return convertedResults;
        }

        /// <inheritdoc />
        public async Task HideUgcAsync(
            Guid ugcId,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                await this.sunriseService.HideUgcAsync(ugcId, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to hide {ugcId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task UnhideUgcAsync(
            ulong xuid,
            Guid ugcId,
            FileType fileType,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                await this.sunriseService.UnhideUgcAsync(ugcId, xuid, fileType, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to unhide {fileType}:{ugcId} for {xuid}.", ex);
            }
        }
    }
}
