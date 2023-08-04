﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead profile templates.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/profileTemplates")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.ProfileTemplates, Target.Details, Dev.ReviseTags)]
    public class ProfileTemplatesController : V2ControllerBase
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="ProfileTemplatesController"/> class.
        /// </summary>
        public ProfileTemplatesController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
        }

        /// <summary>
        ///   Gets all player profile templates.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<string>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        public async Task<IActionResult> GetAllProfileTemplates()
        {
            var services = this.SteelheadServices.Value;

            var results = await services.LiveOpsService.GetAllProfileTemplateNames().ConfigureAwait(true);
            return this.Ok(results.profileTemplateNames);
        }
    }
}
