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
using Turn10.Services.LiveOps.FM8.Generated;
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

        /// <summary>
        ///     Initializes a new instance of the <see cref="InventoryController"/> class.
        /// </summary>
        public InventoryController(
            IMapper mapper,
            ILoggingService loggingService,
            ISteelheadItemsProvider itemsProvider,
            ISteelheadPegasusService pegasusService,
            IRequestValidator<SteelheadPlayerInventory> steelheadPlayerInventoryItemUpdateRequestValidator)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            steelheadPlayerInventoryItemUpdateRequestValidator.ShouldNotBeNull(nameof(steelheadPlayerInventoryItemUpdateRequestValidator));

            this.mapper = mapper;
            this.loggingService = loggingService;
            this.itemsProvider = itemsProvider;
            this.pegasusService = pegasusService;
            this.steelheadPlayerInventoryItemUpdateRequestValidator = steelheadPlayerInventoryItemUpdateRequestValidator;
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
        ///     Gets the player inventory based on profile id.
        /// </summary>
        [HttpGet("profile/{profileId}")]
        [SwaggerResponse(200, type: typeof(SteelheadPlayerInventory))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        public async Task<IActionResult> GetPlayerInventory(
            ulong xuid,
            int profileId)
        {
            var inventory = await this.GetPlayerInventoryByProfileId(xuid, profileId).ConfigureAwait(true);

            return this.Ok(inventory);
        }

        /// <summary>
        ///     Gets a specific car from player inventory based on profile id.
        /// </summary>
        [HttpGet("profile/{profileId}/car/{vin}")]
        [SwaggerResponse(200, type: typeof(PlayerInventoryCarItem))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        public async Task<IActionResult> GetPlayerInventoryCar(
            ulong xuid,
            int profileId,
            string vin)
        {
            var parsedVin = vin.TryParseGuidElseThrow(nameof(vin));
            var inventory = await this.GetPlayerInventoryByProfileId(xuid, profileId).ConfigureAwait(true);

            var car = inventory.Cars.FirstOrDefault(car => car.Vin == parsedVin);
            if (car == null)
            {
                throw new InvalidArgumentsStewardException($"Could not find car with vin on player's inventory profile. (xuid: {xuid}) (profileId: {profileId}) (vin: {vin})");
            }

            return this.Ok(car);
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
        [SwaggerResponse(200, type: typeof(SteelheadPlayerInventory))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.UserInventory)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Inventory)]
        [Authorize(Policy = UserAttributeValues.ManagePlayerInventory)]
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

            var exceptions = new List<Exception>();
            LiveOpsAddInventoryItemsOutput rawResults = null;
            LiveOpsUpdateCarDataV2Output carRawResults = null;

            var updateCredits = inventoryUpdates.CreditRewards.Select(credit => this.mapper.SafeMap<ForzaUserInventoryItemWrapper>((credit, InventoryItemType.Credits)));
            var updateVanityItems = inventoryUpdates.VanityItems.Select(vanityItem => this.mapper.SafeMap<ForzaUserInventoryItemWrapper>((vanityItem, InventoryItemType.VanityItem)));
            var updateDriverSuits = inventoryUpdates.DriverSuits.Select(driverSuit => this.mapper.SafeMap<ForzaUserInventoryItemWrapper>((driverSuit, InventoryItemType.DriverSuit)));
            var updateItems = updateCredits.Concat(updateVanityItems).Concat(updateDriverSuits).ToArray();

            // Verify UGC ids for each car to make sure they match the car id and type it is being applied to
            foreach (var car in inventoryUpdates.Cars)
            {
                var carId = car.Id;
                var liveryId = car.VersionedLiveryId;
                var tuneId = car.VersionedTuneId;

                if (liveryId.HasValue && liveryId != default(Guid))
                {
                    await this.VerifyUgcHasCorrectTypeAndCarIdElseThrowAsync(liveryId.Value, ForzaUGCContentType.Livery, carId, this.Services.StorefrontManagementService).ConfigureAwait(true);
                }

                if (tuneId.HasValue && tuneId != default(Guid))
                {
                    await this.VerifyUgcHasCorrectTypeAndCarIdElseThrowAsync(tuneId.Value, ForzaUGCContentType.TuneBlob, carId, this.Services.StorefrontManagementService).ConfigureAwait(true);
                }
            }

            var updateCars = inventoryUpdates.Cars.Select(car => this.mapper.SafeMap<AdminForzaCarUserInventoryItem>(car)).ToArray();

            if (updateItems != null && updateItems.Length > 0)
            {
                rawResults = await this.Services.LiveOpsService.LiveOpsAddInventoryItems(xuid, externalProfileIdGuid, updateItems).ConfigureAwait(true);
            }

            try
            {
                if (updateCars != null && updateCars.Length > 0)
                {
                    carRawResults = await this.Services.LiveOpsService.LiveOpsUpdateCarDataV2(xuid, externalProfileIdGuid, updateCars, ForzaCarDataUpdateAccessLevel.Developer).ConfigureAwait(true);
                }
            }
            catch (Exception ex)
            {
                exceptions.Add(new LspFailureStewardException("Failed to update car inventory items.", ex));
            }

            var results = new SteelheadPlayerInventory
            {
                CreditRewards = rawResults != null ? this.mapper.SafeMap<PlayerInventoryItem[]>(rawResults.itemResults.Where(item => item.ItemType == InventoryItemType.Credits)) : new List<PlayerInventoryItem>(),
                VanityItems = rawResults != null ? this.mapper.SafeMap<PlayerInventoryItem[]>(rawResults.itemResults.Where(item => item.ItemType == InventoryItemType.VanityItem)) : new List<PlayerInventoryItem>(),
                DriverSuits = rawResults != null ? this.mapper.SafeMap<PlayerInventoryItem[]>(rawResults.itemResults.Where(item => item.ItemType == InventoryItemType.DriverSuit)) : new List<PlayerInventoryItem>(),
                Cars = carRawResults != null ? this.mapper.SafeMap<PlayerInventoryCarItem[]>(carRawResults.carOutput) : new List<PlayerInventoryCarItem>(),
                Errors = exceptions,
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
        [Authorize(Policy = UserAttributeValues.ManagePlayerInventory)]
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
            var removeDriverSuits = inventoryUpdates.DriverSuits.Select(driverSuit => this.mapper.SafeMap<ForzaUserInventoryItemWrapper>((driverSuit, InventoryItemType.DriverSuit)));
            var removeItems = removeCredits.Concat(removeVanityItems).Concat(removeDriverSuits).ToArray();

            await this.Services.LiveOpsService.LiveOpsRemoveInventoryItems(xuid, externalProfileIdGuid, removeItems).ConfigureAwait(true);

            return this.Ok();
        }

        private async Task VerifyUgcHasCorrectTypeAndCarIdElseThrowAsync(Guid ugcId, ForzaUGCContentType type, int carId, IStorefrontManagementService service)
        {
            var response = await service.GetUGCObject(ugcId).ConfigureAwait(false);
            if (response == null || response.result == null)
            {
                throw new InvalidArgumentsStewardException($"UGC id not found. (ugcId: {ugcId})");
            }

            if (response.result?.Metadata.ContentType != type)
            {
                throw new InvalidArgumentsStewardException($"Cannot attached UGC from one type to another. (ugcId: {ugcId}) (carId: {type})");
            }

            if (response.result?.Metadata.CarId != carId)
            {
                throw new InvalidArgumentsStewardException($"Cannot attached UGC from a specific car to another. (ugcId: {ugcId}) (carId: {carId})");
            }
        }

        private async Task<SteelheadPlayerInventory> GetPlayerInventoryByProfileId(
            ulong xuid,
            int profileId)
        {
            profileId.ShouldBeGreaterThanValue(-1);

            async Task<SteelheadPlayerInventory> GetInventory()
            {
                var service = this.Services.LiveOpsService;

                Forza.WebServices.FM8.Generated.LiveOpsService.GetAdminUserInventoryByProfileIdOutput response = null;

                try
                {
                    response = await service.GetAdminUserInventoryByProfileId(profileId, xuid)
                        .ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw new UnknownFailureStewardException($"Failed to retrieve player inventory. (profileId: {profileId})", ex);
                }

                var playerInventoryDetails = this.mapper.SafeMap<SteelheadPlayerInventory>(response.summary);

                return playerInventoryDetails;
            }

            var getPlayerInventory = GetInventory();
            var getMasterInventory = this.itemsProvider.GetMasterInventoryAsync();

            await Task.WhenAll(getPlayerInventory, getMasterInventory).ConfigureAwait(false);

            var playerInventory = await getPlayerInventory.ConfigureAwait(false);
            var masterInventory = await getMasterInventory.ConfigureAwait(false);

            if (playerInventory == null)
            {
                throw new NotFoundStewardException($"No inventory found for profileId: {profileId}.");
            }

            playerInventory.SetItemDescriptions(
                masterInventory,
                $"Profile Id: {profileId}",
                this.loggingService);

            return playerInventory;
        }
    }
}
