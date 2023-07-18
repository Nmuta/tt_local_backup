using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.BigCat;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
namespace Turn10.LiveOps.StewardApi.Controllers.V2
{
    /// <summary>
    ///     Handles requests for pricing.
    /// </summary>
    [Route("api/v{version:apiVersion}/pricing")]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Agnostic)]
    public sealed class PricingController : V2ControllerBase
    {
        private readonly IBigCatService bigCatService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PricingController"/> class.
        /// </summary>
        public PricingController(IBigCatService bigCatService)
        {
            bigCatService.ShouldNotBeNull(nameof(bigCatService));

            this.bigCatService = bigCatService;
        }

        /// <summary>
        ///     Gets product IDs for lookup in pricing catalog.
        /// </summary>
        [HttpGet("productIds")]
        [SwaggerResponse(200, type: typeof(Dictionary<string, string>))]
        public async Task<IActionResult> GetProductIdsAsync()
        {
            var productIdMap = new Dictionary<string, string>()
        {
            { "Forza Motorsport Standard Edition", "9PLKVSWR299F" },
            { "Forza Motorsport Deluxe Edition", "9PN4DRJDLZT7" },
            { "Forza Motorsport Premium Edition", "9P8PGC771MLP" },
            { "Forza Motorsport Premium Add-Ons Bundle", "9N5MZM3J3LCQ" },
            { "Forza Horizon 5 Standard Edition", "9NKX70BBCDRN" }
        };

            return this.Ok(productIdMap);
        }

        /// <summary>
        ///    Retrieves pricing catalog data for a given productId.
        /// </summary>
        [HttpGet("{productId}")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> GetProductPricingInfoAsync(string productId)
        {
            productId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(productId));

            var result = await this.bigCatService.RetrievePriceCatalogAsync(productId).ConfigureAwait(true);

            return this.Ok(result);
        }
    }
}
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
