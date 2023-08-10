using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for Steelhead items.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/items")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead)]
    public sealed class ItemsController : V2SteelheadControllerBase
    {
        private readonly ISteelheadItemsProvider itemsProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ItemsController"/> class.
        /// </summary>
        public ItemsController(ISteelheadItemsProvider itemsProvider)
        {
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));

            this.itemsProvider = itemsProvider;
        }

        /// <summary>
        ///     Gets the master inventory data for each item type.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(SteelheadMasterInventory))]
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
        [SwaggerResponse(200, type: typeof(IEnumerable<SimpleCar>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarsAsync([FromQuery] string slotId = SteelheadPegasusSlot.Live)
        {
            var cars = await this.itemsProvider.GetCarsAsync(slotId).ConfigureAwait(true);
            return this.Ok(cars);
        }
    }
}
