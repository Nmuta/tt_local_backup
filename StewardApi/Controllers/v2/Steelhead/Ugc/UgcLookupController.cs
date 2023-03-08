using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.Services.LiveOps.FM8.Generated;
using Turn10.UGC.Contracts;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using ServicesLiveOps = Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead user groups.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/ugc/lookup")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.MediaTeam,
        UserRole.MotorsportDesigner,
        UserRole.HorizonDesigner)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Ugc, Target.Details)]
    public class UgcLookupController : V2SteelheadControllerBase
    {
        private const int DefaultMaxResults = 500;
        private readonly IMapper mapper;
        private readonly ILoggingService loggingService;
        private readonly ISteelheadItemsProvider itemsProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UgcLookupController"/> class for Steelhead.
        /// </summary>
        public UgcLookupController(IMapper mapper, ILoggingService loggingService, ISteelheadItemsProvider itemsProvider)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));

            this.mapper = mapper;
            this.loggingService = loggingService;
            this.itemsProvider = itemsProvider;
        }

        /// <summary>
        ///    Search UGC items.
        /// </summary>
        [HttpPost("{ugcType}")]
        [SwaggerResponse(200, type: typeof(IList<UgcItem>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> Get([FromBody] UgcSearchFilters parameters, string ugcType)
        {
            parameters.ShouldNotBeNull(nameof(parameters));
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));

            if (!Enum.TryParse(ugcType, out UgcType typeEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(UgcType)} provided: {ugcType}");
            }

            var searchParameters = this.mapper.SafeMap<ServicesLiveOps.ForzaUGCSearchRequest>(parameters);

            async Task<IList<UgcItem>> SearchUGC()
            {
                var mappedContentType = this.mapper.SafeMap<ServicesLiveOps.ForzaUGCContentType>(ugcType);
                var results = await this.Services.StorefrontManagementService.SearchUGC(searchParameters, mappedContentType, false, DefaultMaxResults).ConfigureAwait(false);

                // Client filters out any featured UGC that has expired. Special case for min DateTime, which is how Services tracks featured UGC with no end date.
                var filteredResults = results.result.Where(result => searchParameters.Featured == false || result.Metadata.FeaturedEndDate > DateTime.UtcNow || result.Metadata.FeaturedEndDate == DateTime.MinValue);

                return this.mapper.SafeMap<IList<UgcItem>>(filteredResults);
            }

            var getUgc = SearchUGC();
            var getCars = this.itemsProvider.GetCarsAsync().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));

            await Task.WhenAll(getUgc, getCars).ConfigureAwait(true);

            var ugcItems = getUgc.GetAwaiter().GetResult();
            var carsDict = getCars.GetAwaiter().GetResult().ToDictionary(car => car.Id);

            foreach (var item in ugcItems)
            {
                item.CarDescription = carsDict.TryGetValue(item.CarId, out var car) ? $"{car.Make} {car.Model}" : "No car name in Pegasus.";
            }

            return this.Ok(ugcItems);
        }

        /// <summary>
        ///     Gets a UGC livery by ID.
        /// </summary>
        [HttpGet("livery/{ugcId}")]
        [SwaggerResponse(200, type: typeof(UgcLiveryItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcLivery(string ugcId)
        {
            if (!Guid.TryParse(ugcId, out var parsedUgcId))
            {
                throw new BadRequestStewardException("Auction ID could not be parsed as GUID.");
            }

            async Task<UgcItem> GetLiveryAsync()
            {
                StorefrontManagementService.GetUGCLiveryOutput liveryOutput = null;

                try
                {
                    liveryOutput = await this.Services.StorefrontManagementService.GetUGCLivery(parsedUgcId).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw new UnknownFailureStewardException($"No livery found. (ugcId: {parsedUgcId}).", ex);
                }

                var livery = this.mapper.SafeMap<UgcLiveryItem>(liveryOutput.result);

                if (livery.GameTitle != (int)GameTitle.FM8)
                {
                    throw new NotFoundStewardException($"Livery id could not found: {parsedUgcId}");
                }

                return livery;
            }

            var getLivery = GetLiveryAsync();
            var getCars = this.itemsProvider.GetCarsAsync().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));

            await Task.WhenAll(getLivery, getCars).ConfigureAwait(true);

            var livery = getLivery.GetAwaiter().GetResult();
            var cars = getCars.GetAwaiter().GetResult();

            var carData = cars.FirstOrDefault(car => car.Id == livery.CarId);
            livery.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : "No car name in Pegasus.";

            return this.Ok(livery);
        }

        /// <summary>
        ///     Gets a UGC photo by ID.
        /// </summary>
        [HttpGet("photo/{ugcId}")]
        [SwaggerResponse(200, type: typeof(UgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcPhoto(string ugcId)
        {
            if (!Guid.TryParse(ugcId, out var parsedUgcId))
            {
                throw new BadRequestStewardException("Auction ID could not be parsed as GUID.");
            }

            var getPhoto = this.GetPhotoAsync(parsedUgcId);
            var getCars = this.itemsProvider.GetCarsAsync().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));

            await Task.WhenAll(getPhoto, getCars).ConfigureAwait(true);

            var photo = getPhoto.GetAwaiter().GetResult();
            var cars = getCars.GetAwaiter().GetResult();

            var carData = cars.FirstOrDefault(car => car.Id == photo.CarId);
            photo.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : "No car name in Pegasus.";

            return this.Ok(photo);
        }

        /// <summary>
        ///    Gets list of photo thumbnails from id.
        /// </summary>
        [HttpPost("photos/thumbnails")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetPhotoThumbnails([FromBody] IList<Guid> ugcIds)
        {
            var thumbnails = new List<ThumbnailLookupOutput>();
            var thumbnailLookups = new List<Task<UgcItem>>();

            foreach (var id in ugcIds)
            {
                thumbnailLookups.Add(this.GetPhotoAsync(id));
            }

            await Task.WhenAll(thumbnailLookups).ConfigureAwait(true);

            foreach (var query in thumbnailLookups)
            {
                var lookupResult = query.GetAwaiter().GetResult();
                var thumbnailResult = new ThumbnailLookupOutput
                { Id = lookupResult.Id, Thumbnail = lookupResult.ThumbnailOneImageBase64 };

                thumbnails.Add(thumbnailResult);
            }

            return this.Ok(thumbnails);
        }

        /// <summary>
        ///     Gets a UGC tune by ID.
        /// </summary>
        [HttpGet("tune/{ugcId}")]
        [SwaggerResponse(200, type: typeof(UgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcTune(string ugcId)
        {
            if (!Guid.TryParse(ugcId, out var parsedUgcId))
            {
                throw new BadRequestStewardException("Auction ID could not be parsed as GUID.");
            }

            async Task<UgcItem> GetTuneAsync()
            {
                StorefrontManagementService.GetUGCTuneOutput tuneOutput = null;

                try
                {
                    tuneOutput = await this.Services.StorefrontManagementService.GetUGCTune(parsedUgcId).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw new UnknownFailureStewardException($"No tune found. (ugcId: {parsedUgcId}).", ex);
                }

                var tune = this.mapper.SafeMap<UgcItem>(tuneOutput.result);

                if (tune.GameTitle != (int)GameTitle.FM8)
                {
                    throw new NotFoundStewardException($"Tune id could not found: {parsedUgcId}");
                }

                return tune;
            }

            var getTune = GetTuneAsync();
            var getCars = this.itemsProvider.GetCarsAsync().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));

            await Task.WhenAll(getTune, getCars).ConfigureAwait(true);

            var tune = getTune.GetAwaiter().GetResult();
            var cars = getCars.GetAwaiter().GetResult();

            var carData = cars.FirstOrDefault(car => car.Id == tune.CarId);
            tune.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : "No car name in Pegasus.";

            return this.Ok(tune);
        }

        /// <summary>
        ///     Gets UGC item by share code.
        /// </summary>
        [HttpGet("shareCode/{shareCode}")]
        [SwaggerResponse(200, type: typeof(IList<UgcItem>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcItemBySharecode(string shareCode, [FromQuery] string ugcType = "Unknown")
        {
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));

            if (!Enum.TryParse(ugcType, out UgcType parseUgcType))
            {
                throw new InvalidArgumentsStewardException($"Invalid UGC type provided. (type: {ugcType})");
            }

            if (parseUgcType == UgcType.Unknown)
            {
                throw new InvalidArgumentsStewardException($"Invalid UGC item type to search: (type: {parseUgcType})");
            }

            var filters = this.mapper.SafeMap<ForzaUGCSearchRequest>(new UgcFilters(ulong.MaxValue, shareCode));

            async Task<IList<UgcItem>> GetUgcItemBySharecodeAsync()
            {
                var mappedContentType = this.mapper.SafeMap<ServicesLiveOps.ForzaUGCContentType>(ugcType);

                StorefrontManagementService.SearchUGCOutput results;
                try
                {
                    results = await this.Services.StorefrontManagementService.SearchUGC(filters, mappedContentType, false, 5_000).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw new UnknownFailureStewardException($"Failed to search UGC by sharecode. (shareCode: {shareCode}) (ugcType: {ugcType})", ex);
                }

                // Client filters out any featured UGC that has expired. Special case for min DateTime, which is how Services tracks featured UGC with no end date.
                var filteredResults = results.result.Where(result => filters.Featured == false || result.Metadata.FeaturedEndDate > DateTime.UtcNow || result.Metadata.FeaturedEndDate == DateTime.MinValue);

                return this.mapper.SafeMap<IList<UgcItem>>(filteredResults);
            }

            var getUgcItems = GetUgcItemBySharecodeAsync();
            var getCars = this.itemsProvider.GetCarsAsync().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));

            await Task.WhenAll(getUgcItems, getCars).ConfigureAwait(true);

            var ugCItems = getUgcItems.GetAwaiter().GetResult();
            var carsDict = getCars.GetAwaiter().GetResult().ToDictionary(car => car.Id);

            foreach (var item in ugCItems)
            {
                item.CarDescription = carsDict.TryGetValue(item.CarId, out var car) ? $"{car.Make} {car.Model}" : "No car name in Pegasus.";
            }

            return this.Ok(ugCItems);
        }

        private async Task<UgcItem> GetPhotoAsync(Guid ugcId)
        {
            StorefrontManagementService.GetUGCPhotoOutput photoOutput = null;

            try
            {
                photoOutput = await this.Services.StorefrontManagementService.GetUGCPhoto(ugcId).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No photo found. (ugcId: {ugcId}).", ex);
            }

            var photo = this.mapper.SafeMap<UgcItem>(photoOutput.result);

            if (photo.GameTitle != (int)GameTitle.FM8)
            {
                throw new NotFoundStewardException($"Photo id could not found: {ugcId}");
            }

            return photo;
        }
    }
}
