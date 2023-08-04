using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

#pragma warning disable CA1308 // Use .ToUpperInvariant
namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock.PlayFab.Player
{
    /// <summary>
    ///     Handles requests for Woodstock players PlayFab Inventory integrations.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/playfab/player/{playFabEntityId}/inventory")]
    [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.PlayFab)]
    public class InventoryController : V2WoodstockControllerBase
    {
        private readonly IWoodstockPlayFabService playFabService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="InventoryController"/> class for Woodstock.
        /// </summary>
        public InventoryController(IWoodstockPlayFabService playFabService)
        {
            playFabService.ShouldNotBeNull(nameof(playFabService));

            this.playFabService = playFabService;
        }

        /// <summary>
        ///     Adds inventory item to PlayFab player.
        /// </summary>
        [HttpPost("add")]
        [SwaggerResponse(200, type: typeof(IList<PlayFabBuildSummary>))]
        [LogTagDependency(DependencyLogTags.PlayFab)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.PlayFabInventory)]
        [Authorize(Policy = UserAttributeValues.ManagePlayFabInventory)]
        public async Task<IActionResult> AddPlayFabInventoryItem(string playFabEntityId, [FromBody] PlayFabInventoryChangeRequest inventoryChange)
        {
            inventoryChange.ShouldNotBeNull(nameof(inventoryChange));
            inventoryChange.ItemId.ShouldNotBeNull(nameof(inventoryChange.ItemId));
            inventoryChange.Amount.ShouldBeGreaterThanValue(0, nameof(inventoryChange.Amount));

            if (inventoryChange.Amount > 10)
            {
                throw new InvalidArgumentsStewardException($"Can not add more than 10 instances of a single inventory item at a time. (amount: {inventoryChange.Amount})");
            }

            var playFabEnvironment = this.PlayFabEnvironment;

            try
            {
                await this.playFabService.AddInventoryItemToPlayerAsync(playFabEntityId, inventoryChange.ItemId, inventoryChange.Amount, playFabEnvironment).ConfigureAwait(true);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to add inventory item to PlayFab account. (playFabEntityId: {playFabEntityId}) (itemId: {inventoryChange.ItemId}) (amount: {inventoryChange.Amount}) (playFabEnvironment: {playFabEnvironment})", ex);
            }
        }

        /// <summary>
        ///     Removes inventory item to PlayFab player.
        /// </summary>
        [HttpPost("remove")]
        [SwaggerResponse(200, type: typeof(IList<PlayFabBuildSummary>))]
        [LogTagDependency(DependencyLogTags.PlayFab)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.PlayFabInventory)]
        [Authorize(Policy = UserAttributeValues.ManagePlayFabInventory)]
        public async Task<IActionResult> RemovePlayFabInventoryItem(string playFabEntityId, [FromBody] PlayFabInventoryChangeRequest inventoryChange)
        {
            inventoryChange.ShouldNotBeNull(nameof(inventoryChange));
            inventoryChange.ItemId.ShouldNotBeNull(nameof(inventoryChange.ItemId));
            inventoryChange.Amount.ShouldBeGreaterThanValue(0, nameof(inventoryChange.Amount));

            if (inventoryChange.Amount > 10)
            {
                throw new InvalidArgumentsStewardException($"Can not remove more than 10 instances of a single inventory item at a time. (amount: {inventoryChange.Amount})");
            }

            var playFabEnvironment = this.PlayFabEnvironment;

            try
            {
                await this.playFabService.RemoveInventoryItemFromPlayerAsync(playFabEntityId, inventoryChange.ItemId, inventoryChange.Amount, playFabEnvironment).ConfigureAwait(true);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to remove inventory item to PlayFab account. (playFabEntityId: {playFabEntityId}) (itemId: {inventoryChange.ItemId}) (amount: {inventoryChange.Amount}) (playFabEnvironment: {playFabEnvironment})", ex);
            }
        }
    }
}
