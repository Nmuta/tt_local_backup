using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10;
using Turn10.Data.Common;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Controllers;
using Turn10.LiveOps.StewardApi.Controllers.V2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead bans.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/ban")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.Banning)]
    public class BanController : V2ControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BanController"/> class.
        /// </summary>
        public BanController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Expire ban.
        /// </summary>
        [HttpPost("{banEntryId}")]
        [SwaggerResponse(201, type: typeof(UnbanResult))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Banning)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
        public async Task<IActionResult> ExpireBan(int banEntryId)
        {
            banEntryId.ShouldBeGreaterThanValue(-1);

            var service = this.SteelheadServices.Value.UserManagementService;
            try
            {
                var forzaExpireBanParameters =
                    this.mapper.Map<ForzaUserExpireBanParameters>(banEntryId);

                ForzaUserExpireBanParameters[] parameterArray = { forzaExpireBanParameters };

                var response = await service.ExpireBanEntries(parameterArray, 1)
                    .ConfigureAwait(false);

                var result = this.mapper.Map<UnbanResult>(response.unbanResults[0]);

                if (!result.Success)
                {
                    throw new BadRequestStewardException($"Failed to expire ban with ID: {banEntryId}");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to expire ban with ID: {banEntryId}.", ex);
            }
        }

        /// <summary>
        ///     Delete ban.
        /// </summary>
        [HttpDelete("{banEntryId}")]
        [SwaggerResponse(201, type: typeof(UnbanResult))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Delete | ActionAreaLogTags.Banning)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
        public async Task<IActionResult> DeleteBan(int banEntryId)
        {
            banEntryId.ShouldBeGreaterThanValue(-1);

            var banEntryIds = new int[] { banEntryId };
            var service = this.SteelheadServices.Value.UserManagementService;
            try
            {
                var response = await service.DeleteBanEntries(banEntryIds)
                    .ConfigureAwait(false);

                var result = this.mapper.Map<UnbanResult>(response.unbanResults[0]);

                if (!result.Success && !result.Deleted)
                {
                    throw new BadRequestStewardException($"Failed to delete ban with ID: {banEntryId}");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to delete ban with ID: {banEntryId}.", ex);
            }
        }
    }
}
