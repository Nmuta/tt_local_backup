using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using static Turn10.Services.LiveOps.FH5_main.Generated.UserManagementService;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Player
{
    /// <summary>
    ///     Handles requests for Woodstock Ban.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/player/{xuid}/ban/")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.Player, Topic.LoyaltyRewards)]
    public class BanController : V2WoodstockControllerBase
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
                nextBanPeriod = await this.ServicesWithLiveStewardCms.UserManagementService.GetNextBanPeriod(xuid, banconfig).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get next ban duration. (xuid: {xuid}) (banconfig: {banconfig})", ex);
            }

            return this.Ok(nextBanPeriod.banDuration);
        }
    }
}
