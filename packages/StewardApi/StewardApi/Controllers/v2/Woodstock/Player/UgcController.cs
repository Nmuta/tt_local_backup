using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
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
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Player
{
    /// <summary>
    ///     Handles requests for Woodstock player UGC.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/player/{xuid}/ugc")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.Player, Topic.Ugc)]
    public class UgcController : V2WoodstockControllerBase
    {
        private readonly int ugcMaxResults = 8_000;
        private readonly IWoodstockItemsProvider itemsProvider;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UgcController"/> class.
        /// </summary>
        public UgcController(IWoodstockItemsProvider itemsProvider, ILoggingService loggingService, IMapper mapper)
        {
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.itemsProvider = itemsProvider;
            this.loggingService = loggingService;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets player UGC items.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<UgcItem>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcItems(ulong xuid, [FromQuery] string ugcType = "Unknown")
        {
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));

            var parseUgcType = ugcType.TryParseEnumElseThrow<UgcType>(nameof(ugcType));

            if (parseUgcType == UgcType.Unknown)
            {
                throw new InvalidArgumentsStewardException($"Invalid UGC item type to search: (type: {parseUgcType})");
            }

            async Task<IList<UgcItem>> GetPlayerUgcAsync(ulong xuid, UgcType ugcType)
            {
                var mappedContentType = this.mapper.SafeMap<ForzaUGCContentType>(ugcType);

                StorefrontManagementService.GetUGCForUserOutput results = null;

                try
                {
                    results = await this.Services.StorefrontManagementService.GetUGCForUser(xuid, mappedContentType, false, this.ugcMaxResults, false).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw new UnknownFailureStewardException($"Failed to get player UGC. (xuid: {xuid}) (ugcType: {ugcType})", ex);
                }

                return this.mapper.SafeMap<IList<UgcItem>>(results.result);
            }

            var getUgcItems = GetPlayerUgcAsync(xuid, parseUgcType);
            var getCars = this.itemsProvider.GetCarsAsync<SimpleCar>().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));

            await Task.WhenAll(getUgcItems, getCars).ConfigureAwait(true);

            var ugcItems = getUgcItems.GetAwaiter().GetResult();
            var carsDict = getCars.GetAwaiter().GetResult().ToDictionary(car => car.Id);

            foreach (var item in ugcItems)
            {
                item.CarDescription = carsDict.TryGetValue(item.CarId, out var car) ? $"{car.DisplayName}" : "No car name in Pegasus.";
            }

            return this.Ok(ugcItems);
        }

        /// <summary>
        ///     Gets player hidden UGC items.
        /// </summary>
        [HttpGet("hidden")]
        [SwaggerResponse(200, type: typeof(IList<WoodstockUgcItem>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetHiddenUgcItems(ulong xuid, [FromQuery] string ugcType = "Unknown")
        {
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));

            var parseUgcType = ugcType.TryParseEnumElseThrow<UgcType>(nameof(ugcType));

            if (parseUgcType == UgcType.Unknown)
            {
                throw new InvalidArgumentsStewardException($"Invalid UGC item type to search: (type: {parseUgcType})");
            }

            var mappedContentType = this.mapper.SafeMap<ForzaUGCContentType>(ugcType);
            var results = new List<ForzaUGCDataLight>();

            switch (mappedContentType)
            {
                case ForzaUGCContentType.Livery:
                    var liveries = await this.Services.StorefrontManagementService.GetHiddenUGCByUser(xuid, ForzaUGCContentType.Livery, this.ugcMaxResults).ConfigureAwait(false);
                    results.AddRange(liveries.result);
                    break;

                case ForzaUGCContentType.Layergroup:
                    var layerGroups = await this.Services.StorefrontManagementService.GetHiddenUGCByUser(xuid, ForzaUGCContentType.Layergroup, this.ugcMaxResults).ConfigureAwait(false);
                    results.AddRange(layerGroups.result);
                    break;

                case ForzaUGCContentType.Photo:
                    var photos = await this.Services.StorefrontManagementService.GetHiddenUGCByUser(xuid, ForzaUGCContentType.Photo, this.ugcMaxResults).ConfigureAwait(false);
                    results.AddRange(photos.result);
                    break;

                case ForzaUGCContentType.Tune:
                    var tunes = await this.Services.StorefrontManagementService.GetHiddenUGCByUser(xuid, ForzaUGCContentType.Tune, this.ugcMaxResults).ConfigureAwait(false);
                    results.AddRange(tunes.result);
                    break;

                case ForzaUGCContentType.EventBlueprint:
                    var eventBlueprints = await this.Services.StorefrontManagementService.GetHiddenUGCByUser(xuid, ForzaUGCContentType.EventBlueprint, this.ugcMaxResults).ConfigureAwait(false);
                    results.AddRange(eventBlueprints.result);
                    break;

                default:
                    throw new UnknownFailureStewardException($"Unsupported UGC type: {parseUgcType}");
            }

            var convertedResults = this.mapper.SafeMap<List<WoodstockUgcItem>>(results);

            return this.Ok(convertedResults);
        }
    }
}
