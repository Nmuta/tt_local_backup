using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;
using ApolloContracts = Turn10.LiveOps.StewardApi.Contracts.Apollo;
using SteelheadContracts = Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using SunriseContracts = Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using WoodstockContracts = Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Ugc
{
    /// <summary>
    ///     Handles GeoFlags requests for Woodstock.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/ugc/{id}/clone")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags("UGC", "Woodstock")]
    public class CloneToDevController : V2WoodstockControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="CloneToDevController"/> class.
        /// </summary>
        public CloneToDevController()
        {
            // force this endpoint to always use Studio. It does not work in other environments.
            this.WoodstockEndpoint = new Lazy<string>(() => WoodstockContracts.WoodstockEndpoint.Studio);
        }

        /// <summary>
        ///    Clones the identified to dev.
        /// </summary>
        /// <param name="id">The id from a Retail environment.</param>
        /// <param name="configuration">The configuration to produce the clone with.</param>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.UgcItem, ActionAreaLogTags.Action | ActionAreaLogTags.Ugc)]
        [Authorize(Policy = UserAttribute.CloneUgc)]
        public async Task<IActionResult> Post(string id, [FromBody] CloneConfigurationModel configuration)
        {
            if (!Guid.TryParse(id, out var ugcId))
            {
                throw new BadRequestStewardException($"'{id}' was not parseable as a GUID.");
            }

            if (!configuration.ContentType.HasValue)
            {
                throw new BadRequestStewardException($"{nameof(configuration.ContentType)} not provided.");
            }

            if (!configuration.IsSearchable.HasValue)
            {
                throw new BadRequestStewardException($"{nameof(configuration.IsSearchable)} not provided.");
            }

            if (!configuration.KeepGuid.HasValue)
            {
                throw new BadRequestStewardException($"{nameof(configuration.KeepGuid)} not provided.");
            }

            var liveOps = this.WoodstockServices.Value.LiveOpsService;
            var result = await liveOps
                .CloneUgcFile(
                    ugcId,
                    string.Empty,
                    configuration.ContentType.Value,
                    configuration.IsSearchable.Value,
                    configuration.KeepGuid.Value)
                .ConfigureAwait(true);

            // TODO: Clean up this output model.
            return this.Ok(result);
        }

        public class CloneConfigurationModel
        {
            public ForzaUGCContentType? ContentType { get; set; }

            public bool? KeepGuid { get; set; }

            public bool? IsSearchable { get; set; }
        }
    }
}
