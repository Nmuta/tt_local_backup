using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FM8.Generated;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.UGC.Contracts;
using ServicesLiveOps = Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead user groups.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/ugc/lookup")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags("Ugc", "Steelhead", "InDev")]
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
        public async Task<IActionResult> Get([FromBody] UGCSearchFilters parameters, string ugcType)
        {
            parameters.ShouldNotBeNull(nameof(parameters));
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));

            if (!Enum.TryParse(ugcType, out UgcType typeEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(UgcType)} provided: {ugcType}");
            }

            var searchParameters = this.mapper.Map<ServicesLiveOps.ForzaUGCSearchRequest>(parameters);

            async Task<IList<UgcItem>> SearchUGC()
            {
                var mappedContentType = this.mapper.Map<ServicesLiveOps.ForzaUGCContentType>(ugcType);
                var results = await this.Services.StorefrontManagementService.SearchUGC(searchParameters, mappedContentType, false, DefaultMaxResults).ConfigureAwait(false);

                // Client filters out any featured UGC that has expired.
                var filteredResults = results.result.Where(result => searchParameters.Featured == false || result.Metadata.FeaturedEndDate > DateTime.UtcNow);

                return this.mapper.Map<IList<UgcItem>>(filteredResults);
            }

            var getUgc = SearchUGC();
            var getCars = this.itemsProvider.GetCarsAsync();

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
                try
                {
                    var liveryOutput = await this.Services.StorefrontManagementService.GetUGCLivery(parsedUgcId).ConfigureAwait(false);
                    var livery = this.mapper.Map<UgcLiveryItem>(liveryOutput.result);

                    if (livery.GameTitle != (int)GameTitle.FM8)
                    {
                        throw new NotFoundStewardException($"Livery id could not found: {parsedUgcId}");
                    }

                    return livery;
                }
                catch (Exception ex)
                {
                    throw new NotFoundStewardException($"No livery found with id: {parsedUgcId}.", ex);
                }
            }

            var getLivery = GetLiveryAsync();
            //var getCars = this.itemsProvider.GetCarsAsync();

            await Task.WhenAll(getLivery/*, getCars*/).ConfigureAwait(true);

            var livery = getLivery.GetAwaiter().GetResult();
            //var cars = getCars.GetAwaiter().GetResult();

            //var carData = cars.FirstOrDefault(car => car.Id == livery.CarId);
            //livery.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : "No car name in Pegasus.";

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

            async Task<UgcItem> GetPhotoAsync()
            {
                try
                {
                    var photoOutput = await this.Services.StorefrontManagementService.GetUGCPhoto(parsedUgcId).ConfigureAwait(false);
                    var photo = this.mapper.Map<UgcItem>(photoOutput.result);

                    if (photo.GameTitle != (int)GameTitle.FM8)
                    {
                        throw new NotFoundStewardException($"Photo id could not found: {parsedUgcId}");
                    }

                    return photo;
                }
                catch (Exception ex)
                {
                    throw new NotFoundStewardException($"No Photo found with id: {parsedUgcId}.", ex);
                }
            }

            var getPhoto = GetPhotoAsync();
            //var getCars = this.itemsProvider.GetCarsAsync();

            await Task.WhenAll(getPhoto/*, getCars*/).ConfigureAwait(true);

            var photo = getPhoto.GetAwaiter().GetResult();
            //var cars = getCars.GetAwaiter().GetResult();

            //var carData = cars.FirstOrDefault(car => car.Id == photo.CarId);
            //photo.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : "No car name in Pegasus.";

            return this.Ok(photo);
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
                try
                {
                    var tuneOutput = await this.Services.StorefrontManagementService.GetUGCTune(parsedUgcId).ConfigureAwait(false);
                    var tune = this.mapper.Map<UgcItem>(tuneOutput.result);

                    if (tune.GameTitle != (int)GameTitle.FM8)
                    {
                        throw new NotFoundStewardException($"Tune id could not found: {parsedUgcId}");
                    }

                    return tune;
                }
                catch (Exception ex)
                {
                    throw new NotFoundStewardException($"No Tune found with id: {parsedUgcId}.", ex);
                }
            }

            var getTune = GetTuneAsync();
            //var getCars = this.itemsProvider.GetCarsAsync();

            await Task.WhenAll(getTune/*, getCars*/).ConfigureAwait(true);

            var tune = getTune.GetAwaiter().GetResult();
            //var cars = getCars.GetAwaiter().GetResult();

            //var carData = cars.FirstOrDefault(car => car.Id == tune.CarId);
            //tune.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : "No car name in Pegasus.";

            return this.Ok(tune);
        }
    }
}
