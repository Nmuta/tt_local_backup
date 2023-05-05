using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Forza.WebServices.FM8.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph.TermStore;
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
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using static Forza.WebServices.FM8.Generated.LiveOpsService;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using ForzaCarUserInventoryItem = Forza.WebServices.FM8.Generated.ForzaCarUserInventoryItem;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Handles requests for Steelhead player inventory profile.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/inventory")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.Inventory)]
    public class InventoryController : V2SteelheadControllerBase
    {
        private const int MaxProfileResults = 100;
        private readonly IMapper mapper;
        private readonly ILoggingService loggingService;
        private readonly ISteelheadItemsProvider itemsProvider;
        private readonly ISteelheadPegasusService pegasusService;
        private readonly IRequestValidator<SteelheadPlayerInventory> steelheadPlayerInventoryItemUpdateRequestValidator;
        private readonly IRequestValidator<IList<CarInventoryItem>> steelheadPlayerInventoryCarUpdateRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="InventoryController"/> class.
        /// </summary>
        public InventoryController(
            IMapper mapper,
            ILoggingService loggingService,
            ISteelheadItemsProvider itemsProvider,
            ISteelheadPegasusService pegasusService,
            IRequestValidator<SteelheadPlayerInventory> steelheadPlayerInventoryItemUpdateRequestValidator,
            IRequestValidator<IList<CarInventoryItem>> steelheadPlayerInventoryCarUpdateRequestValidator)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            steelheadPlayerInventoryItemUpdateRequestValidator.ShouldNotBeNull(nameof(steelheadPlayerInventoryItemUpdateRequestValidator));
            steelheadPlayerInventoryCarUpdateRequestValidator.ShouldNotBeNull(nameof(steelheadPlayerInventoryCarUpdateRequestValidator));

            this.mapper = mapper;
            this.loggingService = loggingService;
            this.itemsProvider = itemsProvider;
            this.pegasusService = pegasusService;
            this.steelheadPlayerInventoryItemUpdateRequestValidator = steelheadPlayerInventoryItemUpdateRequestValidator;
            this.steelheadPlayerInventoryCarUpdateRequestValidator = steelheadPlayerInventoryCarUpdateRequestValidator;
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(SteelheadPlayerInventory))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        public async Task<IActionResult> GetPlayerInventory(
            ulong xuid)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            async Task<SteelheadPlayerInventory> GetInventory()
            {
                var service = this.Services.LiveOpsService;

                Forza.WebServices.FM8.Generated.LiveOpsService.GetAdminUserInventoryOutput response = null;

                try
                {
                    response = await service.GetAdminUserInventory(xuid)
                        .ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw new UnknownFailureStewardException($"Failed to retrieve player inventory. (XUID: {xuid})", ex);
                }

                var playerInventoryDetails = this.mapper.SafeMap<SteelheadPlayerInventory>(response.summary);

                return playerInventoryDetails;
            }

            var getPlayerInventory = GetInventory();
            var getMasterInventory = this.itemsProvider.GetMasterInventoryAsync();

            await Task.WhenAll(getPlayerInventory, getMasterInventory).ConfigureAwait(true);

            var playerInventory = await getPlayerInventory.ConfigureAwait(true);
            var masterInventory = await getMasterInventory.ConfigureAwait(true);

            if (playerInventory == null)
            {
                throw new NotFoundStewardException($"No inventory found for XUID: {xuid}.");
            }

            playerInventory.SetItemDescriptions(
                masterInventory,
                $"XUID: {xuid}",
                this.loggingService);

            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gets the player inventory profiles.
        /// </summary>
        [HttpGet("profiles")]
        [SwaggerResponse(200, type: typeof(IList<SteelheadInventoryProfile>))]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.UserInventory)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        public async Task<IActionResult> GetPlayerInventoryProfiles(
            ulong xuid)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            IList<SteelheadInventoryProfile> inventoryProfileSummary;
            var service = this.Services.LiveOpsService;

            Forza.WebServices.FM8.Generated.LiveOpsService.GetPlayerProfilesOutput response = null;

            try
            {
                 response = await service.GetPlayerProfiles(
                    xuid,
                    MaxProfileResults).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to retrieve player inventory profiles. (XUID: {xuid})", ex);
            }

            inventoryProfileSummary = this.mapper.SafeMap<IList<SteelheadInventoryProfile>>(response.profiles);


            if (inventoryProfileSummary == null)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}.");
            }

            return this.Ok(inventoryProfileSummary);
        }

        /// <summary>
        ///     Adds or edits inventory items.
        /// </summary>
        [HttpPost("externalProfileId/{externalProfileId}/items")]
        [SwaggerResponse(200, type: typeof(PlayerInventoryItem[]))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.UserInventory)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Inventory)]
        [Authorize(Policy = UserAttribute.AddAndEditPlayerInventory)]
        public async Task<IActionResult> EditPlayerProfileItems(ulong xuid, string externalProfileId, [FromBody]SteelheadPlayerInventory inventoryUpdates)
        {
            if (!Guid.TryParse(externalProfileId, out var externalProfileIdGuid))
            {
                throw new InvalidArgumentsStewardException($"External Profile ID provided is not a valid Guid: (externalProfileId: {externalProfileId})");
            }

            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            // Basic validation of all items
            this.steelheadPlayerInventoryItemUpdateRequestValidator.Validate(inventoryUpdates, this.ModelState);
            if (!this.ModelState.IsValid)
            {
                var result = this.steelheadPlayerInventoryItemUpdateRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            var updateCredits = inventoryUpdates.CreditRewards.Select(credit => this.mapper.SafeMap<ForzaUserInventoryItemWrapper>((credit, InventoryItemType.Credits)));
            var updateVanityItems = inventoryUpdates.VanityItems.Select(vanityItem => this.mapper.SafeMap<ForzaUserInventoryItemWrapper>((vanityItem, InventoryItemType.VanityItem)));
            var updateItems = updateCredits.Concat(updateVanityItems);

            LiveOpsAddInventoryItemsOutput rawResults = null;
            try
            {
                rawResults = await this.Services.LiveOpsService.LiveOpsAddInventoryItems(xuid, externalProfileIdGuid, updateItems.ToArray()).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to update inventory items. (XUID: {xuid}) (External Profile ID: {externalProfileIdGuid})", ex);
            }

            var results = new SteelheadPlayerInventory
            {
                CreditRewards = this.mapper.SafeMap<PlayerInventoryItem[]>(rawResults.itemResults.Where(item => item.ItemType == InventoryItemType.Credits)),
                VanityItems = this.mapper.SafeMap<PlayerInventoryItem[]>(rawResults.itemResults.Where(item => item.ItemType == InventoryItemType.VanityItem)),
            };

            return this.Ok(results);
        }

        /// <summary>
        ///     Removes inventory items.
        /// </summary>
        [HttpDelete("externalProfileId/{externalProfileId}/items")]
        [SwaggerResponse(200, type: typeof(PlayerInventoryItem[]))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.UserInventory)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Inventory)]
        [Authorize(Policy = UserAttribute.AddAndEditPlayerInventory)]
        public async Task<IActionResult> RemovePlayerProfileItems(ulong xuid, string externalProfileId, [FromBody] SteelheadPlayerInventory inventoryUpdates)
        {
            var externalProfileIdGuid = externalProfileId.TryParseGuidElseThrow("External Profile ID could no be parsed as GUID.");

            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            // Basic validation of all items
            this.steelheadPlayerInventoryItemUpdateRequestValidator.Validate(inventoryUpdates, this.ModelState);
            if (!this.ModelState.IsValid)
            {
                var result = this.steelheadPlayerInventoryItemUpdateRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            var removeCredits = inventoryUpdates.CreditRewards.Select(credit => this.mapper.SafeMap<ForzaUserInventoryItemWrapper>((credit, InventoryItemType.Credits)));
            var removeVanityItems = inventoryUpdates.VanityItems.Select(vanityItem => this.mapper.SafeMap<ForzaUserInventoryItemWrapper>((vanityItem, InventoryItemType.VanityItem)));
            var removeItems = removeCredits.Concat(removeVanityItems);

            try
            {
                await this.Services.LiveOpsService.LiveOpsRemoveInventoryItems(xuid, externalProfileIdGuid, removeItems.ToArray()).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to update inventory items. (XUID: {xuid}) (External Profile ID: {externalProfileIdGuid})", ex);
            }

            return this.Ok();
        }

        /// <summary>
        ///     Adds or edits cars.
        /// </summary>
        [HttpPost("externalProfileId/{externalProfileId}/cars")]
        [SwaggerResponse(200, type: typeof(IList<CarInventoryItem>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.UserInventory)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Inventory)]
        [Authorize(Policy = UserAttribute.AddAndEditPlayerInventory)]
        public async Task<IActionResult> EditPlayerProfileCars(ulong xuid, string externalProfileId, [FromBody] IList<CarInventoryItem> carUpdates)
        {
            if (!Guid.TryParse(externalProfileId, out var externalProfileIdGuid))
            {
                throw new InvalidArgumentsStewardException($"External Profile ID provided is not a valid Guid: (externalProfileId: {externalProfileId})");
            }

            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            // Basic validation of all cars
            this.steelheadPlayerInventoryCarUpdateRequestValidator.Validate(carUpdates, this.ModelState);
            if (!this.ModelState.IsValid)
            {
                var result = this.steelheadPlayerInventoryCarUpdateRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            var updateCars = this.mapper.SafeMap<ForzaCarUserInventoryItem[]>(carUpdates);

            LiveOpsUpdateCarDataOutput rawResults = null;
            try
            {
                rawResults = await this.Services.LiveOpsService.LiveOpsUpdateCarData(xuid, externalProfileIdGuid, updateCars, ForzaCarDataUpdateAccessLevel.Developer).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to update inventory items. (XUID: {xuid}) (External Profile ID: {externalProfileIdGuid})", ex);
            }

            var results = this.mapper.SafeMap<CarInventoryItem[]>(rawResults.carOutput);

            return this.Ok(results);
        }
    }
}
