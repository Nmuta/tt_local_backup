using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10;
using Turn10.Data.Common;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Controllers.v2;
using Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock car items.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/storefront")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [Authorize]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock)]
    public sealed class StorefrontController : V2WoodstockControllerBase
    {
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="StorefrontController"/> class.
        /// </summary>
        public StorefrontController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets a layer group UGC item.
        /// </summary>
        [HttpGet("layergroup/{id}")]
        [SwaggerResponse(200, type: typeof(WoodstockUgcItem))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarsAsync(string id)
        {
            if (!Guid.TryParse(id, out var idAsGuid))
            {
                throw new InvalidArgumentsStewardException($"UGC item id provided is not a valid Guid: {id}");
            }

            var ugc = await this.Services.StorefrontManagement.GetUGCObject(idAsGuid).ConfigureAwait(true);
            return this.Ok(this.mapper.SafeMap<WoodstockUgcItem>(ugc.result));
        }
    }
}
