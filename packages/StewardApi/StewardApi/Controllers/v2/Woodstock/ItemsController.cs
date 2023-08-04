using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock items.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/items")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock)]
    public sealed class ItemsController : V2WoodstockControllerBase
    {
        private readonly IWoodstockItemsProvider itemsProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ItemsController"/> class.
        /// </summary>
        public ItemsController(IWoodstockItemsProvider itemsProvider)
        {
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));

            this.itemsProvider = itemsProvider;
        }

        /// <summary>
        ///     Gets the master inventory data for each item type.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(WoodstockMasterInventory))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetMasterInventoryList([FromQuery] string slotId = WoodstockPegasusSlot.LiveSteward)
        {
            slotId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(slotId));

            var masterInventory = await this.itemsProvider.GetMasterInventoryAsync(slotId).ConfigureAwait(true);
            return this.Ok(masterInventory);
        }
    }
}
