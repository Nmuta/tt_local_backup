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
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Controllers.v2;
using Turn10.LiveOps.StewardApi.Controllers.v2.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Test controller for testing Steelhead LSP APIs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/reportWeight")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags("ProfileNotes", "Steelhead", "InDev")]
    public class ReportWeightController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ReportWeightController"/> class.
        /// </summary>
        public ReportWeightController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the user's profile notes.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(int))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetReportWeightAsync(
            ulong xuid)
        {
            try
            {
                var response = await this.Services.UserManagementService.GetUserReportWeight(xuid).ConfigureAwait(true);

                return this.Ok(response.reportWeight);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No report weight found for XUID: {xuid}.", ex);
            }
        }

        /// <summary>
        ///     Adds a profile note to a user's profile.
        /// </summary>
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin)]
        [HttpPut]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(CodeName, StewardAction.Add, StewardSubject.ProfileNotes)]
        public async Task<IActionResult> SetReportWeight(
            ulong xuid,
            [FromBody] string reportWeightType)
        {
            if(!Enum.TryParse(reportWeightType, out ForzaUserReportWeightType reportWeightEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(ForzaUserReportWeightType)} provided: {reportWeightType}");
            }

            try
            {
                await this.Services.UserManagementService.SetUserReportWeight(xuid, reportWeightEnum).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Could not set report weight for XUID: {xuid}.", ex);
            }

            return this.Ok();
        }
    }
}
