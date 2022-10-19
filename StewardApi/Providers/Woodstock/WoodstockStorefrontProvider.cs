using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FH5_main.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.UGC.Contracts;
using static Forza.WebServices.FH5_main.Generated.StorefrontService;
using FileType = Forza.UserGeneratedContent.FH5_main.Generated.FileType;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

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
        public async Task<IList<WoodstockUgcItem>> GetPlayerUgcContentAsync(ulong xuid, UgcType ugcType, string endpoint, bool includeThumbnails = false)
        {
            ugcType.ShouldNotBeNull(nameof(ugcType));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            if (ugcType == UgcType.Unknown)
            {
                throw new InvalidArgumentsStewardException("Invalid UGC item type to search: Unknown");
            }

            var mappedContentType = this.mapper.Map<ServicesLiveOps.ForzaUGCContentType>(ugcType);
            var results = await this.woodstockService.GetPlayerUgcContentAsync(xuid, mappedContentType, endpoint, includeThumbnails).ConfigureAwait(false);

            return this.mapper.Map<IList<WoodstockUgcItem>>(results.result);
        }

        /// <inheritdoc />
        public async Task<IList<WoodstockUgcItem>> SearchUgcContentAsync(UgcType ugcType, ServicesLiveOps.ForzaUGCSearchRequest filters, string endpoint, bool includeThumbnails = false)
        {
            ugcType.ShouldNotBeNull(nameof(ugcType));
            filters.ShouldNotBeNull(nameof(filters));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            if (ugcType == UgcType.Unknown)
            {
                throw new InvalidArgumentsStewardException("Invalid UGC item type to search: Unknown");
            }

            var mappedContentType = this.mapper.Map<ServicesLiveOps.ForzaUGCContentType>(ugcType);
            var results = await this.woodstockService.SearchUgcContentAsync(filters, mappedContentType, endpoint, includeThumbnails).ConfigureAwait(false);

            // Client filters out any featured UGC that has expired. Special case for min DateTime, which is how Services tracks featured UGC with no end date.
            var filteredResults = results.result.Where(result => filters.Featured == false || result.Metadata.FeaturedEndDate > DateTime.UtcNow || result.Metadata.FeaturedEndDate == DateTime.MinValue);

            return this.mapper.Map<IList<WoodstockUgcItem>>(filteredResults);
        }

        /// <inheritdoc />
        public async Task<WoodstockUgcLiveryItem> GetUgcLiveryAsync(Guid liveryId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var liveryOutput = await this.woodstockService.GetPlayerLiveryAsync(liveryId, endpoint).ConfigureAwait(false);
            var livery = this.mapper.Map<WoodstockUgcLiveryItem>(liveryOutput.result);

            if (livery.GameTitle != (int)GameTitle.FH5)
            {
                throw new NotFoundStewardException($"Livery id could not found: {liveryId}");
            }

            return livery;
        }

        /// <inheritdoc />
        public async Task<WoodstockUgcItem> GetUgcPhotoAsync(Guid photoId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var photoOutput = await this.woodstockService.GetPlayerPhotoAsync(photoId, endpoint).ConfigureAwait(false);
            var photo = this.mapper.Map<WoodstockUgcItem>(photoOutput.result);

            if (photo.GameTitle != (int)GameTitle.FH5)
            {
                throw new NotFoundStewardException($"Photo id could not found: {photoId}");
            }

            return photo;
        }

        /// <inheritdoc />
        public async Task<WoodstockUgcItem> GetUgcTuneAsync(Guid tuneId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var tuneOutput = await this.woodstockService.GetPlayerTuneAsync(tuneId, endpoint).ConfigureAwait(false);
            var tune = this.mapper.Map<WoodstockUgcItem>(tuneOutput.result);

            if (tune.GameTitle != (int)GameTitle.FH5)
            {
                throw new NotFoundStewardException($"Tune id could not found: {tuneId}");
            }

            return tune;
        }

        /// <inheritdoc />
        public async Task<WoodstockUgcItem> GetUgcEventBlueprintAsync(Guid eventBlueprintId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var eventBlueprintOutput = await this.woodstockService.GetEventBlueprintAsync(eventBlueprintId, endpoint).ConfigureAwait(false);
            var eventBlueprint = this.mapper.Map<WoodstockUgcItem>(eventBlueprintOutput.result);

            if (eventBlueprint.GameTitle != (int)GameTitle.FH5)
            {
                throw new NotFoundStewardException($"Event blueprint id could not found: {eventBlueprintId}");
            }

            return eventBlueprint;
        }

        /// <inheritdoc />
        public async Task<UgcItem> GetUgcCommunityChallengeAsync(Guid communityChallengeId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var communityChallengeOutput = await this.woodstockService.GetCommunityChallengeAsync(communityChallengeId, endpoint).ConfigureAwait(false);
            var communityChallenge = this.mapper.Map<WoodstockUgcItem>(communityChallengeOutput.result.communityChallengeData);

            if (communityChallenge.GameTitle != (int)GameTitle.FH5)
            {
                throw new NotFoundStewardException($"Community Challenge ID could not found: {communityChallengeId}");
            }

            return communityChallenge;
        }

        /// <inheritdoc />
        public async Task SetUgcFeaturedStatusAsync(Guid contentId, bool isFeatured, TimeSpan? featuredExpiry, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            try
            {
                var featureEndDate = isFeatured && featuredExpiry.HasValue ? DateTime.UtcNow.Add(featuredExpiry.Value) : DateTime.MinValue;
                await this.woodstockService.SetUgcFeaturedStatusAsync(contentId, isFeatured, featureEndDate, endpoint).ConfigureAwait(false);
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
                throw new UnknownFailureStewardException($"Failed to get auction data. (auctionId: {auctionId})", ex);
            }
        }

        /// <inheritdoc />
        public async Task<ServicesLiveOps.AuctionManagementService.DeleteAuctionsOutput> DeleteAuctionAsync(
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
                throw new UnknownFailureStewardException($"Failed to delete auction. (auctionId: {auctionId})", ex);
            }
        }

        /// <inheritdoc />
        [SuppressMessage("Usage", "VSTHRD103:GetResult synchronously blocks", Justification = "Used in conjunction with Task.WhenAll")]
        public async Task<IList<HideableUgc>> GetHiddenUgcForUserAsync(ulong xuid, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var exceptions = new List<Exception>();
            var defaultValue = new GetHiddenUGCForUserOutput() { ugcData = Array.Empty<ForzaStorefrontFile>() };
            var liveries = this.woodstockService.GetHiddenUgcForUserAsync(100, xuid, FileType.Livery, endpoint).SuccessOrDefault(defaultValue, exceptions);
            var layerGroups = this.woodstockService.GetHiddenUgcForUserAsync(100, xuid, FileType.LayerGroup, endpoint).SuccessOrDefault(defaultValue, exceptions);
            var photos = this.woodstockService.GetHiddenUgcForUserAsync(100, xuid, FileType.Photo, endpoint).SuccessOrDefault(defaultValue, exceptions);
            var tunings = this.woodstockService.GetHiddenUgcForUserAsync(100, xuid, FileType.Tuning, endpoint).SuccessOrDefault(defaultValue, exceptions);
            var eventBlueprints = this.woodstockService.GetHiddenUgcForUserAsync(100, xuid, FileType.EventBlueprint, endpoint).SuccessOrDefault(defaultValue, exceptions);

            await Task.WhenAll(liveries, layerGroups, photos, tunings, eventBlueprints).ConfigureAwait(false);

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

            if (eventBlueprints.IsCompletedSuccessfully)
            {
                results.AddRange(eventBlueprints.GetAwaiter().GetResult().ugcData);
            }

            var convertedResults = this.mapper.Map<List<HideableUgc>>(results);

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
                await this.woodstockService.HideUgcAsync(ugcId, endpoint).ConfigureAwait(false);
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
                await this.woodstockService.UnhideUgcAsync(ugcId, xuid, fileType, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to unhide {fileType}:{ugcId} for {xuid}.", ex);
            }
        }
    }
}
