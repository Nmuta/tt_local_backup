using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

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
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.MediaTeam,
        UserRole.MotorsportDesigner,
        UserRole.HorizonDesigner)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.Inventory)]
    public class InventoryController : V2SteelheadControllerBase
    {
        private const int MaxProfileResults = 50;
        private readonly IMapper mapper;
        private readonly ILoggingService loggingService;
        private readonly ISteelheadItemsProvider itemsProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="InventoryController"/> class.
        /// </summary>
        public InventoryController(IMapper mapper, ILoggingService loggingService, ISteelheadItemsProvider itemsProvider)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));

            this.mapper = mapper;
            this.loggingService = loggingService;
            this.itemsProvider = itemsProvider;
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
            await this.EnsurePlayerExist(this.Services, xuid).ConfigureAwait(true);

            async Task<SteelheadPlayerInventory> GetInventory()
            {
                var service = this.Services.LiveOpsService;

                try
                {
                    var response = await service.GetAdminUserInventory(xuid)
                        .ConfigureAwait(false);
                    var playerInventoryDetails = this.mapper.Map<SteelheadPlayerInventory>(response.summary);

                    return playerInventoryDetails;
                }
                catch (Exception ex)
                {
                    throw new UnknownFailureStewardException($"Failed to retrieve player inventory. (XUID: {xuid})", ex);
                }
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
            await this.EnsurePlayerExist(this.Services, xuid).ConfigureAwait(true);

            IList<SteelheadInventoryProfile> inventoryProfileSummary;
            var service = this.Services.UserInventoryManagementService;

            try
            {
                var response = await service.GetAdminUserProfiles(
                    xuid,
                    MaxProfileResults).ConfigureAwait(false);

                inventoryProfileSummary = this.mapper.Map<IList<SteelheadInventoryProfile>>(response.profiles);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to retrieve player inventory profiles. (XUID: {xuid})", ex);
            }

            if (inventoryProfileSummary == null)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}.");
            }

            return this.Ok(inventoryProfileSummary);
        }
    }
}
