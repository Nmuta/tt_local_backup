using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Forza.WebServices.FM8.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.TeamFoundation.Build.WebApi;
using SteelheadLiveOpsContent;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.BuildersCup;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using static Forza.WebServices.FM8.Generated.LiveOpsService;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead user groups.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/buildersCup")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin,
        UserRole.MotorsportDesigner,
        UserRole.CommunityManager)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Calendar, Topic.BuildersCup, Target.Details, Dev.ReviseTags)]
    public class BuildersCupController : V2SteelheadControllerBase
    {
        private const int GroupLookupMaxResults = 1000;
        private readonly IMapper mapper;
        private readonly ILoggingService loggingService;
        private readonly ISteelheadPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="RacersCupController"/> class for Steelhead.
        /// </summary>
        public BuildersCupController(IMapper mapper, ILoggingService loggingService, ISteelheadPegasusService pegasusService)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            pegasusService.ShouldNotBeNull(nameof(pegasusService));

            this.mapper = mapper;
            this.loggingService = loggingService;
            this.pegasusService = pegasusService;
        }

        /// <summary>
        ///     Gets a Racer Cup schedule.
        /// </summary>
        [HttpGet("schedule")]
        [SwaggerResponse(200, type: typeof(RacersCupSchedule))]
        public async Task<IActionResult> GetCmsRacersCupSchedule()
        {
            try
            {
                var featuredCupData = await this.pegasusService.GetBuildersCupFeaturedCupLadderAsync().ConfigureAwait(true);
                var featuredTours = this.mapper.SafeMap<IList<BuildersCupFeaturedTour>>(featuredCupData.ChampionshipLadder);

                return this.Ok(featuredTours);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No builders cup schedule data found for {TitleConstants.SteelheadFullName}", ex);
            }
        }
    }
}
