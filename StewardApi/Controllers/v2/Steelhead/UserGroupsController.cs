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
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead user groups.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/userGroups")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.LspGroups, Target.Details, Dev.ReviseTags)]
    public class UserGroupsController : V2SteelheadControllerBase
    {
        private const int GroupLookupMaxResults = 1000;
        private readonly IMapper mapper;
        private readonly ILoggingService loggingService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UserGroupsController"/> class for Steelhead.
        /// </summary>
        public UserGroupsController(IMapper mapper, ILoggingService loggingService)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));

            this.mapper = mapper;
            this.loggingService = loggingService;
        }

        /// <summary>
        ///     Gets user groups for Steelhead.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<LspGroup>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetUserGroups()
        {
            try
            {
                var result = await this.Services.UserManagementService.GetUserGroups(0, GroupLookupMaxResults).ConfigureAwait(true);
                var lspGroups = this.mapper.Map<IList<LspGroup>>(result.userGroups);

                if (lspGroups.Count > GroupLookupMaxResults - 50)
                {
                    this.loggingService.LogException(new ApproachingLimitAppInsightsException(
                        $"LSP group lookup for {TitleConstants.SteelheadFullName} is nearing the maximum lookup value."));
                }

                return this.Ok(lspGroups);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No LSP groups found for {TitleConstants.SteelheadFullName}", ex);
            }
        }
    }
}
