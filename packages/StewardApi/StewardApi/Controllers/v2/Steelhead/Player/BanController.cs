using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using static Turn10.Services.LiveOps.FM8.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Handles requests for Steelhead Ban.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/ban/")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.LoyaltyRewards)]
    public class BanController : V2SteelheadControllerBase
    {
        /// <summary>
        ///    Gets a pnext ban duration for a player based on the ban configuration.
        /// </summary>
        [HttpGet("nextDuration/{banconfig}")]
        [SwaggerResponse(200, type: typeof(ForzaBanDuration))]
        public async Task<IActionResult> GetNextBanDuration(ulong xuid, Guid banconfig)
        {
            GetNextBanPeriodOutput nextBanPeriod;
            try
            {
                nextBanPeriod = await this.Services.UserManagementService.GetNextBanPeriod(xuid, banconfig).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get next ban duration. (xuid: {xuid}) (banconfig: {banconfig})", ex);
            }

            return this.Ok(nextBanPeriod.banDuration);
        }
    }
}
