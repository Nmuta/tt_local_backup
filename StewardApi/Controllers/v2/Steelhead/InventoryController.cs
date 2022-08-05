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
using Turn10.LiveOps.StewardApi.Controllers.V2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead player inventory profile.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/inventory/{profileId}")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags("Inventory", "Steelhead")]
    public class InventoryController : V2SteelheadControllerBase
    {
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
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        public async Task<IActionResult> GetPlayerInventory(
            int profileId)
        {
            profileId.ShouldBeGreaterThanValue(-1);

            async Task<SteelheadPlayerInventory> GetInventory()
            {
                var service = this.Services.LiveOpsService;

                try
                {
                    var response = await service.GetAdminUserInventoryByProfileId(profileId)
                        .ConfigureAwait(false);
                    var playerInventoryDetails = this.mapper.Map<SteelheadPlayerInventory>(response.summary);

                    return playerInventoryDetails;
                }
                catch (Exception ex)
                {
                    throw new UnknownFailureStewardException($"Failed to retrieve player inventory. (profileId: {profileId})", ex);
                }
            }

            // TODO uncomment below when Steelhead Pegasus item data is ready.
            var getPlayerInventory = GetInventory();
            //var getMasterInventory = this.itemsProvider.GetMasterInventoryAsync();

            await Task.WhenAll(getPlayerInventory/*, getMasterInventory*/).ConfigureAwait(true);

            var playerInventory = await getPlayerInventory.ConfigureAwait(true);
            //var masterInventory = await getMasterInventory.ConfigureAwait(true);

            if (playerInventory == null)
            {
                throw new NotFoundStewardException($"No inventory found for profileId: {profileId}.");
            }

            //playerInventory.SetItemDescriptions(
            //    masterInventory,
            //    $"XUID: {xuid}",
            //    this.loggingService);

            return this.Ok(playerInventory);
        }
    }
}
