using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Players
{
    /// <summary>
    ///     Handles requests for Steelhead players.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/players/ban")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Players, Target.Details, Dev.ReviseTags)]
    public class BanSummariesController : V2SteelheadControllerBase
    {
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BanSummariesController"/> class for Steelhead.
        /// </summary>
        public BanSummariesController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        [HttpPost("banSummaries")]
        [SwaggerResponse(200, type: typeof(IList<BanSummary>))]
        public async Task<IActionResult> GetBanSummaries(
            [FromBody] IList<ulong> xuids)
        {
            xuids.ShouldNotBeNull(nameof(xuids));
            await this.EnsurePlayersExist(this.Services, xuids).ConfigureAwait(true);

            if (xuids.Count == 0)
            {
                return this.Ok(new List<BanSummary>());
            }

            UserManagementService.GetUserBanSummariesOutput result = null;

            try
            {
                result = await this.Services.UserManagementService.GetUserBanSummaries(xuids.ToArray(), xuids.Count)
                    .ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Ban Summary lookup has failed.", ex);
            }

            var banSummaryResults = this.mapper.SafeMap<IList<BanSummary>>(result.banSummaries);

            return this.Ok(banSummaryResults);
        }
    }
}
