using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
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
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;
using Turn10.UGC.Contracts;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using static Turn10.Services.LiveOps.FH5_main.Generated.StorefrontManagementService;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Ugc
{
    /// <summary>
    ///     Handles requests for detailed information on specific types of Woodstock UGC content.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/ugc/")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.Details, Topic.Ugc)]
    public class TypesController : V2WoodstockControllerBase
    {
        private readonly IWoodstockItemsProvider itemsProvider;
        private readonly ILoggingService loggingService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="TypesController"/> class.
        /// </summary>
        public TypesController(IWoodstockItemsProvider itemsProvider, ILoggingService loggingService)
        {
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            loggingService.ShouldNotBeNull(nameof(loggingService));

            this.itemsProvider = itemsProvider;
            this.loggingService = loggingService;
        }

        /// <summary>
        ///     Gets a UGC livery by ID.
        /// </summary>
        [HttpGet("livery/{id}")]
        [SwaggerResponse(200, type: typeof(WoodstockUgcLiveryItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public Task<IActionResult> GetUgcLivery(string id)
            => this.UgcLookupWithCarDataAsync<GetUGCLiveryOutput, WoodstockUgcLiveryItem>(id, this.Services.StorefrontManagementService.GetUGCLivery, o => o.result);

        /// <summary>
        ///     Gets a UGC photo by ID.
        /// </summary>
        [HttpGet("photo/{id}")]
        [SwaggerResponse(200, type: typeof(WoodstockUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public Task<IActionResult> GetUgcPhoto(string id)
            => this.UgcLookupWithCarDataAsync(id, this.Services.StorefrontManagementService.GetUGCPhoto, o => o.result);

        /// <summary>
        ///     Gets a UGC tune by ID.
        /// </summary>
        [HttpGet("tune/{id}")]
        [SwaggerResponse(200, type: typeof(WoodstockUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public Task<IActionResult> GetUgcTune(string id)
            => this.UgcLookupWithCarDataAsync(id, this.Services.StorefrontManagementService.GetUGCTune, o => o.result);

        /// <summary>
        ///     Gets a UGC blueprint by ID.
        /// </summary>
        [HttpGet("eventBlueprint/{id}")]
        [SwaggerResponse(200, type: typeof(WoodstockUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public Task<IActionResult> GetUgcEventBlueprint(string id)
            => this.SimpleUgcLookupAsync(id, this.Services.LiveOpsService.GetUGCEventBlueprint, o => o.result);

        /// <summary>
        ///     Gets a UGC community challenge by ID.
        /// </summary>
        [HttpGet("communityChallenge/{id}")]
        [SwaggerResponse(200, type: typeof(WoodstockUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public Task<IActionResult> GetUgcCommunityChallenge(string id)
            => this.SimpleUgcLookupAsync(id, this.Services.LiveOpsService.GetUGCCommunityChallenge, o => o.communityChallengeData);

        /// <summary>
        ///     Gets a UGC layer group by ID.
        /// </summary>
        [HttpGet("layerGroup/{id}")]
        [SwaggerResponse(200, type: typeof(WoodstockUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public Task<IActionResult> GetLayerGroup(string id)
            => this.SimpleUgcLookupAsync(id, this.Services.StorefrontManagementService.GetUGCLayerGroup, o => o.result);


        private Task<IActionResult> SimpleUgcLookupAsync<TempT>(
            string id, Func<Guid, Task<TempT>> action, Func<TempT, object> mappedObjectSelector)
            => this.SimpleUgcLookupAsync<TempT, WoodstockUgcItem>(id, action, mappedObjectSelector);

        private async Task<IActionResult> SimpleUgcLookupAsync<TempT, OutT>(
            string id, Func<Guid, Task<TempT>> action, Func<TempT, object> mappedObjectSelector)
            where OutT : UgcItem
        {
            if (!Guid.TryParse(id, out var idAsGuid))
            {
                throw new InvalidArgumentsStewardException($"UGC item id provided is not a valid Guid: {id}");
            }

            var actionOutput = await action(idAsGuid).ConfigureAwait(true);
            var objectToMap = mappedObjectSelector(actionOutput);
            var result = this.Mapper.SafeMap<OutT>(objectToMap);
            if (result.GameTitle != (int)GameTitle.FH5)
            {
                throw new NotFoundStewardException($"ID could not found: {id}");
            }

            return this.Ok(result);
        }

        private Task<IActionResult> UgcLookupWithCarDataAsync<TempT>(
            string id, Func<Guid, Task<TempT>> action, Func<TempT, object> mappedObjectSelector)
            => this.UgcLookupWithCarDataAsync<TempT, WoodstockUgcItem>(id, action, mappedObjectSelector);

        private async Task<IActionResult> UgcLookupWithCarDataAsync<TempT, OutT>(
            string id, Func<Guid, Task<TempT>> action, Func<TempT, object> mappedObjectSelector)
            where OutT : UgcItem
        {
            if (!Guid.TryParse(id, out var idAsGuid))
            {
                throw new InvalidArgumentsStewardException($"UGC item id provided is not a valid Guid: {id}");
            }

            var getCars = this.itemsProvider.GetCarsAsync<SimpleCar>().SuccessOrDefault(Array.Empty<SimpleCar>(), new Action<Exception>(ex =>
            {
                this.loggingService.LogException(new AppInsightsException("Failed to get Pegasus cars.", ex));
            }));
            var getAction = action(idAsGuid);

            await Task.WhenAll(getAction, getCars).ConfigureAwait(true);

            var actionOutput = getAction.GetAwaiter().GetResult();
            var objectToMap = mappedObjectSelector(actionOutput);
            var result = this.Mapper.SafeMap<OutT>(objectToMap);

            var query = new ForzaPlayerLookupParameters
            {
                UserID = result.OwnerXuid.ToInvariantString(),
                UserIDType = ForzaUserIdType.Xuid
            };

            var playerLookup = await this.Services.UserManagementService.GetUserIds(1, new ForzaPlayerLookupParameters[] { query }).ConfigureAwait(true);
            result.OwnerGamertag = playerLookup.playerLookupResult[0].Gamertag;

            var cars = getCars.GetAwaiter().GetResult();
            if (result.GameTitle != (int)GameTitle.FH5)
            {
                throw new NotFoundStewardException($"ID could not found: {id}");
            }

            var carData = cars.FirstOrDefault(car => car.Id == result.CarId);
            result.CarDescription = carData != null ? $"{carData.DisplayName}" : "No car name in Pegasus.";

            return this.Ok(result);
        }
    }
}
