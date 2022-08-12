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
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Test controller for testing Steelhead LSP APIs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/reportWeight")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags("ProfileNotes", "Steelhead")]
    public class ReportWeightController : V2SteelheadControllerBase
    {
        private const int DefaultReportWeight = 10; // Value players are initialized with.
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
        ///     Gets a player's report weight.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(UserReportWeight))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetReportWeightAsync(ulong xuid)
        {
            //xuid.IsValidXuid();

            try
            {
                var response = await this.Services.UserManagementService.GetUserReportWeight(xuid).ConfigureAwait(true);
                var mappedResponse = this.mapper.Map<UserReportWeight>(response);

                return this.Ok(mappedResponse);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"No report weight found. (XUID: {xuid})", ex);
            }
        }

        /// <summary>
        ///    Sets a player's report weight.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200, type: typeof(UserReportWeight))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Steelhead, StewardAction.Update, StewardSubject.Player)]
        public async Task<IActionResult> SetUserReportWeight(ulong xuid, [FromBody] UserReportWeightType reportWeightType)
        {
            //xuid.IsValidXuid();

            try
            {
                var mappedReportWeightType = this.mapper.Map<ForzaUserReportWeightType>(reportWeightType);
                await this.Services.UserManagementService.SetUserReportWeightType(xuid, mappedReportWeightType).ConfigureAwait(false);

                if (reportWeightType == UserReportWeightType.Default)
                {
                    await this.Services.UserManagementService.SetUserReportWeight(xuid, DefaultReportWeight).ConfigureAwait(false);
                }

                var response = await this.Services.UserManagementService.GetUserReportWeight(xuid).ConfigureAwait(true);
                var mappedRepsonse = this.mapper.Map<UserReportWeight>(response);

                return this.Ok(mappedRepsonse);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to set report weight. (XUID: {xuid})", ex);
            }
        }
    }
}
