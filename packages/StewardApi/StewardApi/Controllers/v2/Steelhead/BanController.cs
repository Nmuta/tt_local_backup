using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
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
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
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
        [Authorize(Policy = UserAttributeValues.DeleteBan)]
        public async Task<IActionResult> ExpireBan(int banEntryId)
        {
            banEntryId.ShouldBeGreaterThanValue(-1);

            var service = this.SteelheadServices.Value.UserManagementService;

            var forzaExpireBanParameters =
                this.mapper.SafeMap<ForzaUserExpireBanParameters>(banEntryId);

            UserManagementService.ExpireBanEntriesOutput response = null;

            try
            {
                ForzaUserExpireBanParameters[] parameterArray = { forzaExpireBanParameters };

                response = await service.ExpireBanEntries(parameterArray, 1)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to expire ban with ID: {banEntryId}.", ex);
            }

            var result = this.mapper.SafeMap<UnbanResult>(response.unbanResults[0]);

            if (!result.Success)
            {
                throw new BadRequestStewardException($"Failed to expire ban with ID: {banEntryId}");
            }

            return this.Ok(result);
        }

        /// <summary>
        ///     Delete ban.
        /// </summary>
        [HttpDelete("{banEntryId}")]
        [SwaggerResponse(201, type: typeof(UnbanResult))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Delete | ActionAreaLogTags.Banning)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
        [Authorize(Policy = UserAttributeValues.DeleteBan)]
        public async Task<IActionResult> DeleteBan(int banEntryId)
        {
            banEntryId.ShouldBeGreaterThanValue(-1);

            var banEntryIds = new int[] { banEntryId };
            var service = this.SteelheadServices.Value.UserManagementService;

            UserManagementService.DeleteBanEntriesOutput response = null;

            try
            {
                response = await service.DeleteBanEntries(banEntryIds)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to delete ban with ID: {banEntryId}.", ex);
            }

            var result = this.mapper.SafeMap<UnbanResult>(response.unbanResults[0]);

            if (!result.Success && !result.Deleted)
            {
                throw new BadRequestStewardException($"Failed to delete ban with ID: {banEntryId}");
            }

            return this.Ok(result);
        }
    }
}
