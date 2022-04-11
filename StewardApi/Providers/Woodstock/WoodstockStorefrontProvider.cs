using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH5_main.Generated;
using Forza.WebServices.FH5_main.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.UGC.Contracts;
using static Forza.LiveOps.FH5_main.Generated.AuctionManagementService;
using static Forza.WebServices.FH5_main.Generated.StorefrontService;
using FileType = Forza.UserGeneratedContent.FH5_main.Generated.FileType;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockStorefrontProvider : IWoodstockStorefrontProvider
    {
        private readonly IWoodstockService woodstockService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockStorefrontProvider"/> class.
        /// </summary>
        public WoodstockStorefrontProvider(IWoodstockService woodstockService, IMapper mapper)
        {
            woodstockService.ShouldNotBeNull(nameof(woodstockService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.woodstockService = woodstockService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<UgcItem>> SearchUgcContentAsync(UGCType ugcType, UGCFilters filters, string endpoint, bool includeThumbnails = false)
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
            var results = await this.woodstockService.SearchUgcContentAsync(mappedFilters, mappedContentType, endpoint, includeThumbnails).ConfigureAwait(false);

            return this.mapper.Map<IList<UgcItem>>(results.result);
        }

        /// <inheritdoc />
        public async Task<UgcItem> GetUGCLiveryAsync(Guid liveryId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var liveryOutput = await this.woodstockService.GetPlayerLiveryAsync(liveryId, endpoint).ConfigureAwait(false);
            var livery = this.mapper.Map<UgcItem>(liveryOutput.result);

            if (livery.GameTitle != (int)GameTitle.FH5)
            {
                throw new NotFoundStewardException($"Livery id could not found: {liveryId}");
            }

            return livery;
        }

        /// <inheritdoc />
        public async Task<UgcItem> GetUGCPhotoAsync(Guid photoId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var photoOutput = await this.woodstockService.GetPlayerPhotoAsync(photoId, endpoint).ConfigureAwait(false);
            var photo = this.mapper.Map<UgcItem>(photoOutput.result);

            if (photo.GameTitle != (int)GameTitle.FH5)
            {
                throw new NotFoundStewardException($"Photo id could not found: {photoId}");
            }

            return photo;
        }

        /// <inheritdoc />
        public async Task<UgcItem> GetUGCTuneAsync(Guid tuneId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var tuneOutput = await this.woodstockService.GetPlayerTuneAsync(tuneId, endpoint).ConfigureAwait(false);
            var tune = this.mapper.Map<UgcItem>(tuneOutput.result);

            if (tune.GameTitle != (int)GameTitle.FH5)
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
                await this.woodstockService.SetUGCFeaturedStatusAsync(contentId, isFeatured, featureEndDate, endpoint).ConfigureAwait(false);
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
                var forzaAuctions = await this.woodstockService.GetAuctionDataAsync(auctionId, endpoint).ConfigureAwait(false);

                return this.mapper.Map<AuctionData>(forzaAuctions);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Auction Data lookup failed for auction {auctionId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<DeleteAuctionsOutput> DeleteAuctionAsync(
            Guid auctionId,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                return await this.woodstockService.DeleteAuctionAsync(auctionId, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Auction Data lookup failed for auction {auctionId}.", ex);
            }
        }

        /// <inheritdoc />
        [SuppressMessage("Usage", "VSTHRD103:GetResult synchronously blocks", Justification = "Used in conjunction with Task.WhenAll")]
        public async Task<IList<HideableUgc>> GetHiddenUGCForUserAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var exceptions = new List<Exception>();
            var defaultValue = new GetHiddenUGCForUserOutput() { ugcData = Array.Empty<ForzaStorefrontFile>() };
            var liveries = this.woodstockService.GetHiddenUgcForUserAsync(100, xuid, FileType.Livery, endpoint).SuccessOrDefault(defaultValue, exceptions);
            var layerGroups = this.woodstockService.GetHiddenUgcForUserAsync(100, xuid, FileType.LayerGroup, endpoint).SuccessOrDefault(defaultValue, exceptions);
            var photos = this.woodstockService.GetHiddenUgcForUserAsync(100, xuid, FileType.Photo, endpoint).SuccessOrDefault(defaultValue, exceptions);
            var tunings = this.woodstockService.GetHiddenUgcForUserAsync(100, xuid, FileType.Tuning, endpoint).SuccessOrDefault(defaultValue, exceptions);

            await Task.WhenAll(liveries, layerGroups, photos, tunings).ConfigureAwait(false);

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

            if (tunings.IsCompletedSuccessfully)
            {
                results.AddRange(tunings.GetAwaiter().GetResult().ugcData);
            }

            var convertedResults = this.mapper.Map<List<HideableUgc>>(results);

            return convertedResults;
        }

        /// <inheritdoc />
        public async Task HideUGCAsync(
            Guid ugcId,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                await this.woodstockService.HideUGCAsync(ugcId, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to hide {ugcId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task UnhideUGCAsync(
            ulong xuid,
            Guid ugcId,
            FileType fileType,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                await this.woodstockService.UnhideUGCAsync(ugcId, xuid, fileType, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to unhide {fileType}:{ugcId} for {xuid}.", ex);
            }
        }
    }
}
