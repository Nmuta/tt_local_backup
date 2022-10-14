using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using PermissionsManagementService = Turn10.Services.LiveOps.FH5_main.Generated.PermissionsManagementService;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Woodstock.Services
{
    /// <summary>
    ///     Controller for woodstock services API permission.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/services/apiPermissions")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [DangerousTags(Title.Woodstock, Target.Lsp, Topic.Permissions)]
    public class ApiPermissions : V2WoodstockControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        /// <summary>
        ///    Gets API permissions.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(PermissionsManagementService.GetApiPermissionsOutput))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        public async Task<IActionResult> GetServicesApiPermissions([FromQuery] int deviceRegion, [FromQuery] int startAt, [FromQuery] int maxResults)
        {
            try
            {
                var response = await this.Services.PermissionsManagementService.GetApiPermissions(deviceRegion, startAt, maxResults).ConfigureAwait(true);

                return this.Ok(response);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get services API permissions.", ex);
            }
        }

        /// <summary>
        ///    Sets API permissions.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200, type: typeof(IList<ForzaPermissionUpdateResult>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.ServiceApis, ActionAreaLogTags.Update)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.ApiPermissions)]
        public async Task<IActionResult> SetServicesApiPermissions([FromBody] ForzaLiveOpsPermissionsUpdateParameters[] parametersList)
        {
            try
            {
                var response = await this.Services.PermissionsManagementService.UpdateApiPermissions(parametersList).ConfigureAwait(true);

                return this.Ok(response);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to update services API permissions.", ex);
            }
        }
    }
}
