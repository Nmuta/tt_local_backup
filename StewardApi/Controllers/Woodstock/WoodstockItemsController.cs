﻿using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for Woodstock items.
    /// </summary>
    [Route("api/v1/title/woodstock/items")]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.HorizonDesigner,
        UserRole.MediaTeam)]
    [SuppressMessage(
        "Microsoft.Maintainability",
        "CA1506:AvoidExcessiveClassCoupling",
        Justification = "This can't be avoided.")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    public sealed class WoodstockItemsController : ControllerBase
    {
        private const string DefaultEndpointKey = "Woodstock|Retail";

        private readonly ILoggingService loggingService;
        private readonly IWoodstockItemsProvider itemsProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockItemsController"/> class.
        /// </summary>
        public WoodstockItemsController(
            ILoggingService loggingService,
            IWoodstockItemsProvider itemsProvider)
        {
            loggingService.ShouldNotBeNull(nameof(loggingService));
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));

            this.loggingService = loggingService;
            this.itemsProvider = itemsProvider;
        }

        /// <summary>
        ///     Gets the master inventory data for each item type.
        /// </summary>
        [HttpGet("")]
        [SwaggerResponse(200, type: typeof(WoodstockMasterInventory))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetMasterInventoryList()
        {
            var masterInventory = await this.itemsProvider.GetMasterInventoryAsync().ConfigureAwait(true);
            return this.Ok(masterInventory);
        }

        /// <summary>
        ///     Gets the detailed car list.
        /// </summary>
        [HttpGet("cars")]
        [SwaggerResponse(200, type: typeof(IEnumerable<DetailedCar>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarsAsync([FromQuery] string slotId = WoodstockPegasusSlot.Live)
        {
            var cars = await this.itemsProvider.GetCarsAsync(slotId).ConfigureAwait(true);
            return this.Ok(cars);
        }
    }
}
