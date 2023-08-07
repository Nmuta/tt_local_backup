using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;
using Microsoft.AspNetCore.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Kusto.Cloud.Platform.Utils;
using Turn10.LiveOps.StewardApi.Helpers;

#pragma warning disable CA1308 // Use .ToUpperInvariant
namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock.PlayFab.Player
{
    /// <summary>
    ///     Handles requests for Woodstock players PlayFab Inventory integrations.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/playfab/player/{playFabEntityId}/inventory/{collectionId}")]
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
        ///     Retrieves currency inventory for PlayFab player.
        /// </summary>
        [HttpGet("currency")]
        [SwaggerResponse(200, type: typeof(IList<PlayFabInventoryItem>))]
        [LogTagDependency(DependencyLogTags.PlayFab)]
        public async Task<IActionResult> GetPlayFabPlayerInventory(string playFabEntityId, string collectionId)
        {
            var playFabEnvironment = this.PlayFabEnvironment;
            var parsedCollectionId = collectionId.TryParseEnumElseThrow<PlayFabCollectionId>(nameof(collectionId));

            try
            {
                var vouchers = await this.playFabService.GetVouchersAsync(playFabEnvironment).ConfigureAwait(true);
                var inventoryItems = await this.playFabService.GetPlayerCurrencyInventoryAsync(playFabEntityId, parsedCollectionId, playFabEnvironment).ConfigureAwait(true);

                inventoryItems.ForEach(item => 
                {
                    var voucher = vouchers.FirstOrDefault(voucher => voucher.Id == item.Id);
                    item.Name = voucher.Title["NEUTRAL"] ?? "N/A";
                });

                return this.Ok(inventoryItems);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get player PlayFab inventory. (playFabId: {playFabEntityId}) (playFabEnvironment: {playFabEnvironment})", ex);
            }
        }


        /// <summary>
        ///     Retrieves transaction history for PlayFab player.
        /// </summary>
        [HttpGet("transactions")]
        [SwaggerResponse(200, type: typeof(IList<PlayFabTransaction>))]
        [LogTagDependency(DependencyLogTags.PlayFab)]
        public async Task<IActionResult> GetPlayFabTransactionHistory(string playFabEntityId, string collectionId)
        {
            var playFabEnvironment = this.PlayFabEnvironment;
            var parsedCollectionId = collectionId.TryParseEnumElseThrow<PlayFabCollectionId>(nameof(collectionId));

            try
            {
                var vouchers = await this.playFabService.GetVouchersAsync(playFabEnvironment).ConfigureAwait(true);
                var transactions = await this.playFabService.GetTransactionHistoryAsync(playFabEntityId, parsedCollectionId, playFabEnvironment).ConfigureAwait(true);

                transactions.ForEach(transaction =>
                {
                    transaction.Operations.ForEach(operation =>
                    {
                        var voucher = vouchers.FirstOrDefault(voucher => voucher.Id == operation.ItemId);
                        operation.ItemName = voucher.Title["NEUTRAL"] ?? "N/A";
                    });
                });

                return this.Ok(transactions);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get player PlayFab transaction history. (playFabId: {playFabEntityId}) (playFabEnvironment: {playFabEnvironment})", ex);
            }
        }

        /// <summary>
        ///     Adds inventory item to PlayFab player.
        /// </summary>
        [HttpPost("add")]
        [SwaggerResponse(200, type: typeof(IList<PlayFabBuildSummary>))]
        [LogTagDependency(DependencyLogTags.PlayFab)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.PlayFabInventory)]
        [Authorize(Policy = UserAttributeValues.ManagePlayFabInventory)]
        public async Task<IActionResult> AddPlayFabInventoryItem(string playFabEntityId, string collectionId, [FromBody] PlayFabInventoryChangeRequest inventoryChange)
        {
            inventoryChange.ShouldNotBeNull(nameof(inventoryChange));
            inventoryChange.ItemId.ShouldNotBeNull(nameof(inventoryChange.ItemId));
            inventoryChange.Amount.ShouldBeGreaterThanValue(0, nameof(inventoryChange.Amount));

            if(inventoryChange.Amount > 10)
            {
                throw new InvalidArgumentsStewardException($"Can not add more than 10 instances of a single inventory item at a time. (amount: {inventoryChange.Amount})");
            }

            var playFabEnvironment = this.PlayFabEnvironment;
            var parsedCollectionId = collectionId.TryParseEnumElseThrow<PlayFabCollectionId>(nameof(collectionId));

            try
            {
                await this.playFabService.AddInventoryItemToPlayerAsync(playFabEntityId, parsedCollectionId, inventoryChange.ItemId, inventoryChange.Amount, playFabEnvironment).ConfigureAwait(true);

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
        public async Task<IActionResult> RemovePlayFabInventoryItem(string playFabEntityId, string collectionId, [FromBody] PlayFabInventoryChangeRequest inventoryChange)
        {
            inventoryChange.ShouldNotBeNull(nameof(inventoryChange));
            inventoryChange.ItemId.ShouldNotBeNull(nameof(inventoryChange.ItemId));
            inventoryChange.Amount.ShouldBeGreaterThanValue(0, nameof(inventoryChange.Amount));

            if (inventoryChange.Amount > 10)
            {
                throw new InvalidArgumentsStewardException($"Can not remove more than 10 instances of a single inventory item at a time. (amount: {inventoryChange.Amount})");
            }

            var playFabEnvironment = this.PlayFabEnvironment;
            var parsedCollectionId = collectionId.TryParseEnumElseThrow<PlayFabCollectionId>(nameof(collectionId));

            try
            {
                await this.playFabService.RemoveInventoryItemFromPlayerAsync(playFabEntityId, parsedCollectionId, inventoryChange.ItemId, inventoryChange.Amount, playFabEnvironment).ConfigureAwait(true);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to remove inventory item to PlayFab account. (playFabEntityId: {playFabEntityId}) (itemId: {inventoryChange.ItemId}) (amount: {inventoryChange.Amount}) (playFabEnvironment: {playFabEnvironment})", ex);
            }
        }
    }
}
