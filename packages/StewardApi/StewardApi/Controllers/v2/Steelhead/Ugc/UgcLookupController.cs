using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FM8.Generated;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
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
        UserRole.LiveOpsAdmin)]
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
        [SwaggerResponse(200, type: typeof(IList<SteelheadUgcItem>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> Get([FromBody] UgcSearchFilters parameters, string ugcType)
        {
            parameters.ShouldNotBeNull(nameof(parameters));
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));

            var typeEnum = ugcType.TryParseEnumElseThrow<UgcType>(nameof(ugcType));
            var searchParameters = this.mapper.SafeMap<ServicesLiveOps.ForzaUGCSearchRequest>(parameters);

            async Task<IList<SteelheadUgcItem>> SearchUGC()
            {
                var mappedContentType = this.mapper.SafeMap<ServicesLiveOps.ForzaUGCContentType>(ugcType);
                var results = await this.Services.StorefrontManagementService.SearchUGC(searchParameters, mappedContentType, false, DefaultMaxResults).ConfigureAwait(false);

                // Client filters out any featured UGC that has expired. Special case for min DateTime, which is how Services tracks featured UGC with no end date.
                var filteredResults = results.result.Where(result => searchParameters.Featured == false || result.Metadata.FeaturedEndDate > DateTime.UtcNow || result.Metadata.FeaturedEndDate == DateTime.MinValue);

                return this.mapper.SafeMap<IList<SteelheadUgcItem>>(filteredResults);
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
                item.CarDescription = carsDict.TryGetValue(item.CarId, out var car) ? $"{car.DisplayName}" : "No car name in Pegasus.";
            }

            return this.Ok(ugcItems);
        }

        /// <summary>
        ///    Search curated UGC items.
        /// </summary>
        [HttpGet("{ugcType}/curated/{curationType}")]
        [SwaggerResponse(200, type: typeof(IList<SteelheadUgcItem>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetCurated(string ugcType, string curationType)
        {
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));
            curationType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(curationType));

            var ugcTypeEnum = ugcType.TryParseEnumElseThrow<ForzaUGCContentType>(nameof(ugcType));
            var curationTypeEnum = curationType.TryParseEnumElseThrow<ForzaCurationMethod>(nameof(curationType));

            var getCuratedUgc = this.Services.StorefrontManagementService.GetCuratedUgc(ugcTypeEnum, curationTypeEnum, 500);
            var getCars = this.itemsProvider.GetCarsAsync().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));

            await Task.WhenAll(getCuratedUgc, getCars).ConfigureAwait(true);

            var curatedUgcItems = getCuratedUgc.GetAwaiter().GetResult();
            var carsDict = getCars.GetAwaiter().GetResult().ToDictionary(car => car.Id);

            // empty thumbnail to not have the return object too big
            curatedUgcItems.result.ToList().ForEach(x => x.Thumbnail = null);
            curatedUgcItems.result.ToList().ForEach(x => x.AdminTexture = null);

            var ugcItems = this.mapper.SafeMap<IList<SteelheadUgcItem>>(curatedUgcItems.result.Select(x => x.Metadata));
            foreach (var item in ugcItems)
            {
                item.CarDescription = carsDict.TryGetValue(item.CarId, out var car) ? $"{car.DisplayName}" : "No car name in Pegasus.";
            }

            return this.Ok(ugcItems);
        }

        /// <summary>
        ///     Gets a UGC livery by ID.
        /// </summary>
        [HttpGet("livery/{ugcId}")]
        [SwaggerResponse(200, type: typeof(SteelheadUgcLiveryItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcLivery(string ugcId)
        {
            var parsedUgcId = ugcId.TryParseGuidElseThrow(nameof(ugcId));

            async Task<SteelheadUgcLiveryItem> GetLiveryAsync()
            {
                StorefrontManagementService.GetUGCLiveryOutput liveryOutput = null;

                liveryOutput = await this.Services.StorefrontManagementService.GetUGCLivery(parsedUgcId).ConfigureAwait(false);

                var livery = this.mapper.SafeMap<SteelheadUgcLiveryItem>(liveryOutput.result);

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
            livery.CarDescription = carData != null ? $"{carData.DisplayName}" : "No car name in Pegasus.";

            return this.Ok(livery);
        }

        /// <summary>
        ///     Gets a UGC photo by ID.
        /// </summary>
        [HttpGet("photo/{ugcId}")]
        [SwaggerResponse(200, type: typeof(SteelheadUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcPhoto(string ugcId)
        {
            var parsedUgcId = ugcId.TryParseGuidElseThrow(nameof(ugcId));

            var getPhoto = this.GetPhotoAsync(parsedUgcId);
            var getCars = this.itemsProvider.GetCarsAsync().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));

            await Task.WhenAll(getPhoto, getCars).ConfigureAwait(true);

            var photo = getPhoto.GetAwaiter().GetResult();
            var cars = getCars.GetAwaiter().GetResult();

            var carData = cars.FirstOrDefault(car => car.Id == photo.CarId);
            photo.CarDescription = carData != null ? $"{carData.DisplayName}" : "No car name in Pegasus.";

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
            var thumbnailLookups = new List<Task<SteelheadUgcItem>>();

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
        [HttpGet("tuneblob/{ugcId}")]
        [SwaggerResponse(200, type: typeof(SteelheadUgcTuneBlobItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcTune(string ugcId)
        {
            var parsedUgcId = ugcId.TryParseGuidElseThrow(nameof(ugcId));

            async Task<UgcTuneBlobItem> GetTuneAsync()
            {
                ForzaTuneBlob tuneOutput = null;

                var tuneOutputResponse = await this.Services.LiveOpsService.LiveOpsGetUGCTuneBlobs(new[] { parsedUgcId }).ConfigureAwait(false);
                tuneOutput = tuneOutputResponse.results.First();

                var tune = this.mapper.SafeMap<SteelheadUgcTuneBlobItem>(tuneOutput);

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
            tune.CarDescription = carData != null ? $"{carData.DisplayName}" : "No car name in Pegasus.";

            return this.Ok(tune);
        }

        /// <summary>
        ///     Gets a UGC layer group by ID.
        /// </summary>
        [HttpGet("layerGroup/{ugcId}")]
        [SwaggerResponse(200, type: typeof(SteelheadUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcLayerGroup(string ugcId)
        {
            var parsedUgcId = ugcId.TryParseGuidElseThrow(nameof(ugcId));

            async Task<SteelheadUgcItem> GetLayerGroupAsync()
            {
                var layerGroupOutput = await this.Services.StorefrontManagementService.GetUGCLayerGroup(parsedUgcId).ConfigureAwait(false);

                var layerGroup = this.mapper.SafeMap<SteelheadUgcItem>(layerGroupOutput.result);

                if (layerGroup.GameTitle != (int)GameTitle.FM8)
                {
                    throw new NotFoundStewardException($"Layer Group id could not found: {parsedUgcId}");
                }

                return layerGroup;
            }

            var getLayerGroup = GetLayerGroupAsync();
            var getCars = this.itemsProvider.GetCarsAsync().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));

            await Task.WhenAll(getLayerGroup, getCars).ConfigureAwait(true);

            var layerGroup = getLayerGroup.GetAwaiter().GetResult();
            var cars = getCars.GetAwaiter().GetResult();

            var carData = cars.FirstOrDefault(car => car.Id == layerGroup.CarId);
            layerGroup.CarDescription = carData != null ? $"{carData.DisplayName}" : "No car name in Pegasus.";

            return this.Ok(layerGroup);
        }

        /// <summary>
        ///     Gets a UGC game options by ID.
        /// </summary>
        [HttpGet("gameOptions/{ugcId}")]
        [SwaggerResponse(200, type: typeof(SteelheadUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcGameOptions(string ugcId)
        {
            var parsedUgcId = ugcId.TryParseGuidElseThrow(nameof(ugcId));

            async Task<SteelheadUgcItem> GetGameOptionsAsync()
            {
                ForzaUGCGameOptions gameOptionsOutput = null;

                var gameOptionOutputResponse = await this.Services.LiveOpsService.LiveOpsGetUGCGameOptions(new[] { parsedUgcId }).ConfigureAwait(false);
                gameOptionsOutput = gameOptionOutputResponse.results.First();

                var gameOptions = this.mapper.SafeMap<SteelheadUgcItem>(gameOptionsOutput);

                if (gameOptions.GameTitle != (int)GameTitle.FM8)
                {
                    throw new NotFoundStewardException($"Game Options id could not found: {parsedUgcId}");
                }

                return gameOptions;
            }

            var getGameOptions = GetGameOptionsAsync();
            var getCars = this.itemsProvider.GetCarsAsync().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));

            await Task.WhenAll(getGameOptions, getCars).ConfigureAwait(true);

            var gameOptions = getGameOptions.GetAwaiter().GetResult();
            var cars = getCars.GetAwaiter().GetResult();

            var carData = cars.FirstOrDefault(car => car.Id == gameOptions.CarId);
            gameOptions.CarDescription = carData != null ? $"{carData.DisplayName}" : "No car name in Pegasus.";

            return this.Ok(gameOptions);
        }

        /// <summary>
        ///     Gets a UGC Replay by ID.
        /// </summary>
        [HttpGet("replay/{ugcId}")]
        [SwaggerResponse(200, type: typeof(SteelheadUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcReplay(string ugcId)
        {
            var parsedUgcId = ugcId.TryParseGuidElseThrow(nameof(ugcId));

            async Task<SteelheadUgcItem> GetReplayAsync()
            {
                ForzaUGCData replayOutput = null;

                var replayOutputResponse = await this.Services.StorefrontManagementService.GetUGCObject(parsedUgcId).ConfigureAwait(false);
                replayOutput = replayOutputResponse.result;

                var replay = this.mapper.SafeMap<SteelheadUgcItem>(replayOutput);

                if (replay.GameTitle != (int)GameTitle.FM8)
                {
                    throw new NotFoundStewardException($"Replay id could not found: {parsedUgcId}");
                }

                return replay;
            }

            var getReplay = GetReplayAsync();
            var getCars = this.itemsProvider.GetCarsAsync().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));

            await Task.WhenAll(getReplay, getCars).ConfigureAwait(true);

            var replay = getReplay.GetAwaiter().GetResult();
            var cars = getCars.GetAwaiter().GetResult();

            var carData = cars.FirstOrDefault(car => car.Id == replay.CarId);
            replay.CarDescription = carData != null ? $"{carData.DisplayName}" : "No car name in Pegasus.";

            return this.Ok(replay);
        }

        /// <summary>
        ///     Gets UGC item by share code.
        /// </summary>
        [HttpGet("shareCode/{shareCode}")]
        [SwaggerResponse(200, type: typeof(IList<SteelheadUgcItem>))]
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

            async Task<IList<SteelheadUgcItem>> GetUgcItemBySharecodeAsync()
            {
                var mappedContentType = this.mapper.SafeMap<ServicesLiveOps.ForzaUGCContentType>(ugcType);

                StorefrontManagementService.SearchUGCOutput results;
                results = await this.Services.StorefrontManagementService.SearchUGC(filters, mappedContentType, false, 5_000).ConfigureAwait(false);

                // Client filters out any featured UGC that has expired. Special case for min DateTime, which is how Services tracks featured UGC with no end date.
                var filteredResults = results.result.Where(result => filters.Featured == false || result.Metadata.FeaturedEndDate > DateTime.UtcNow || result.Metadata.FeaturedEndDate == DateTime.MinValue);

                return this.mapper.SafeMap<IList<SteelheadUgcItem>>(filteredResults);
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
                item.CarDescription = carsDict.TryGetValue(item.CarId, out var car) ? $"{car.DisplayName}" : "No car name in Pegasus.";
            }

            return this.Ok(ugCItems);
        }

        private async Task<SteelheadUgcItem> GetPhotoAsync(Guid ugcId)
        {
            StorefrontManagementService.GetUGCPhotoOutput photoOutput = null;

            photoOutput = await this.Services.StorefrontManagementService.GetUGCPhoto(ugcId).ConfigureAwait(false);

            var photo = this.mapper.SafeMap<SteelheadUgcItem>(photoOutput.result);

            if (photo.GameTitle != (int)GameTitle.FM8)
            {
                throw new NotFoundStewardException($"Photo id could not found: {ugcId}");
            }

            return photo;
        }
    }
}
