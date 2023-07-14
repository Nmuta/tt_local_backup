﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
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
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.v2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
using Turn10.UGC.Contracts;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock cms override.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/player/{xuid}/cmsOverride")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [DangerousTags(Title.Woodstock, Target.Player, Topic.CmsOverride)]
    public class CmsOverrideController : V2WoodstockControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        /// <summary>
        ///     Gets player CMS override.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(ForzaCMSOverride))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        public async Task<IActionResult> GetPlayerCmsOverride(
            ulong xuid)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            try
            {
                var response = await this.Services.UserManagementService.GetCMSOverride(xuid).ConfigureAwait(true);

                return this.Ok(response.cmsOverride);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get player CMS override. (XUID: {xuid})", ex);
            }
        }

        /// <summary>
        ///     Sets player CMS override.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.CmsOverride)]
        [Authorize(Policy = UserAttribute.OverrideCms)]
        public async Task<IActionResult> SetPlayerCmsOverride(
            ulong xuid,
            [FromBody] ForzaCMSOverride cmsOverride)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            try
            {
                await this.Services.UserManagementService.SetCMSOverride(
                        xuid,
                        cmsOverride.Snapshot,
                        cmsOverride.Environment,
                        cmsOverride.Slot).ConfigureAwait(true);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to set player CMS override. (XUID: {xuid}) (snapshot: {cmsOverride.Snapshot}) (environment: {cmsOverride.Environment}) (slot: {cmsOverride.Slot})", ex);
            }
        }

        /// <summary>
        ///     Removes a player CMS override.
        /// </summary>
        [HttpDelete]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.CmsOverride)]
        [Authorize(Policy = UserAttribute.OverrideCms)]
        public async Task<IActionResult> DeletePlayerCmsOverride(ulong xuid)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            try
            {
                await this.Services.UserManagementService.DeleteCMSOverride(xuid).ConfigureAwait(true);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to delete player CMS override. (XUID: {xuid})", ex);
            }
        }
    }
}
