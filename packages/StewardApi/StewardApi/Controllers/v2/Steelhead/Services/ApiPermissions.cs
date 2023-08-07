﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using PermissionsManagementService = Turn10.Services.LiveOps.FM8.Generated.PermissionsManagementService;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.Steelhead.Services
{
    /// <summary>
    ///     Controller for steelhead services API permission.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/services/apiPermissions")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [DangerousTags(Title.Steelhead, Target.Lsp, Topic.Permissions)]
    public class ApiPermissions : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;

        /// <summary>
        ///    Gets API permissions.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(PermissionsManagementService.GetApiPermissionsOutput))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        public async Task<IActionResult> GetServicesApiPermissions([FromQuery] int deviceRegion, [FromQuery] int startAt, [FromQuery] int maxResults)
        {
            var response = await this.Services.PermissionsManagementService.GetApiPermissions(deviceRegion, startAt, maxResults).ConfigureAwait(true);

            return this.Ok(response);
        }

        /// <summary>
        ///    Sets API permissions.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200, type: typeof(IList<ForzaPermissionUpdateResult>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.ServiceApis, ActionAreaLogTags.Update)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.ApiPermissions)]
        [Authorize(Policy = UserAttributeValues.ServicesFeature)]
        public async Task<IActionResult> SetServicesApiPermissions([FromBody] ForzaLiveOpsPermissionsUpdateParameters[] parametersList)
        {
            var response = await this.Services.PermissionsManagementService.UpdateApiPermissions(parametersList).ConfigureAwait(true);

            return this.Ok(response);
        }
    }
}
