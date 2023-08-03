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
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Validation;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Ugc
{
    /// <summary>
    ///     Handles GeoFlags requests for Woodstock.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/ugc/{id}/persist")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags("UGC", "Woodstock")]
    public class PersistController : V2WoodstockControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="PersistController"/> class.
        /// </summary>
        public PersistController()
        {
        }

        /// <summary>
        ///    Persists the identified item by copying the file to the system user.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.UgcItem, ActionAreaLogTags.Action | ActionAreaLogTags.Ugc)]
        [Authorize(Policy = UserAttributeValues.PersistUgc)]
        public async Task<IActionResult> Post(string id, [FromBody] PersistUgcOverrides overrides)
        {
            // Overrides should never be null.
            overrides.ShouldNotBeNull(nameof(overrides));

            // The strings can be null, but if they are we need to coerce them into empty strings
            // or the LSP call will throw an error.
            var title = overrides.Title ?? string.Empty;
            var description = overrides.Description ?? string.Empty;

            title.ShouldBeUnderMaxLength(32, nameof(title));
            description.ShouldBeUnderMaxLength(128, nameof(description));

            var ugcId = id.TryParseGuidElseThrow(nameof(id));

            var liveOps = this.WoodstockServices.Value.LiveOpsService;
            var result = await liveOps.PersistUgcFile(ugcId, title, description).ConfigureAwait(true);

            // TODO: Clean up this output model.
            return this.Ok(result);
        }
    }
}
