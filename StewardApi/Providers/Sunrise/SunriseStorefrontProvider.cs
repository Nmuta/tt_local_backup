using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH4.Generated;
using Forza.UserGeneratedContent.FH4.Generated;
using Forza.WebServices.FH4.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using static Forza.WebServices.FH4.Generated.StorefrontService;
using ForzaUserBanParameters = Forza.LiveOps.FH4.Generated.ForzaUserBanParameters;
using GiftingService = Forza.LiveOps.FH4.Generated.GiftingService;
using RareCarShopService = Forza.WebServices.FH4.Generated.RareCarShopService;
using UserInventoryService = Forza.LiveOps.FH4.Generated.UserInventoryService;

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
        public async Task<IList<UGCItem>> SearchUGCItems(UGCType ugcType, UGCFilters filters, string endpoint)
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
            var results = await this.sunriseService.SearchUgcLiveries(mappedFilters, mappedContentType, endpoint).ConfigureAwait(false);

            return this.mapper.Map<IList<UGCItem>>(results.result);
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
        public async Task<UGCItem> GetUGCTune(Guid tuneId, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var photoOutput = await this.sunriseService.GetPlayerPhoto(tuneId, endpoint).ConfigureAwait(false);

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
        public async Task<IList<SunriseHideableUgc>> GetHiddenUGCForUser(ulong xuid, string endpoint)
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
                results.AddRange(liveries.Result.ugcData);
            }

            if (layerGroups.IsCompletedSuccessfully)
            {
                results.AddRange(layerGroups.Result.ugcData);
            }

            if (photos.IsCompletedSuccessfully)
            {
                results.AddRange(photos.Result.ugcData);
            }

            var convertedResults = this.mapper.Map<List<SunriseHideableUgc>>(results);

            return convertedResults;
        }
    }
}
