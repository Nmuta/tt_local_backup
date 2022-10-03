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
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead user groups.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/racersCup")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.MotorsportDesigner,
        UserRole.CommunityManager)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Calendar, Topic.RacersCup, Target.Details, Dev.ReviseTags)]
    public class RacersCupController : V2SteelheadControllerBase
    {
        private const int GroupLookupMaxResults = 1000;
        private readonly IMapper mapper;
        private readonly ILoggingService loggingService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="RacersCupController"/> class for Steelhead.
        /// </summary>
        public RacersCupController(IMapper mapper, ILoggingService loggingService)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));

            this.mapper = mapper;
            this.loggingService = loggingService;
        }

        /// <summary>
        ///     Gets a Racer Cup schedule.
        /// </summary>
        [HttpGet("schedule")]
        [SwaggerResponse(200, type: typeof(RacersCupSchedule))]
        public async Task<IActionResult> GetCmsRacersCupSchedule(
            [FromQuery] string pegasusEnvironment,
            [FromQuery] string pegasusSlotId,
            [FromQuery] string pegasusSnapshotId,
            [FromQuery] DateTimeOffset? startTime,
            [FromQuery] int daysForward)
        {
            daysForward.ShouldBeGreaterThanValue(-1);

            var cutoffTime = DateTimeOffset.UtcNow.AddSeconds(1);
            pegasusEnvironment ??= string.Empty;
            pegasusSlotId ??= string.Empty;
            pegasusSnapshotId ??= string.Empty;

            if (!startTime.HasValue)
            {
                startTime = cutoffTime;
            }

            var startTimeUtc = startTime.Value.ToUniversalTime();
            if (startTimeUtc < cutoffTime)
            {
                throw new BadRequestStewardException("Start time provided must not be in the past.");
            }

            try
            {
                var response = await this.Services.LiveOpsService.GetCMSRacersCupSchedule(
                    pegasusEnvironment,
                    pegasusSlotId,
                    pegasusSnapshotId,
                    startTimeUtc.DateTime,
                    daysForward,
                    Array.Empty<ForzaEventSessionType>()).ConfigureAwait(true);

                var result = this.mapper.Map<RacersCupSchedule>(response.scheduleData);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No racer schedule data found for {TitleConstants.SteelheadFullName}", ex);
            }
        }

        /// <summary>
        ///     Gets a user's Racer Cup schedule.
        /// </summary>
        [HttpGet("player/{xuid}/schedule")]
        [SwaggerResponse(200, type: typeof(RacersCupSchedule))]
        public async Task<IActionResult> GetCmsRacersCupScheduleForUser(
            ulong xuid,
            [FromQuery] DateTimeOffset? startTime,
            [FromQuery] int daysForward)
        {
            daysForward.ShouldBeGreaterThanValue(-1);
            await this.EnsurePlayerExist(this.Services, xuid).ConfigureAwait(true);
            var cutoffTime = DateTimeOffset.UtcNow.AddSeconds(1);

            if (!startTime.HasValue)
            {
                startTime = cutoffTime;
            }

            var startTimeUtc = startTime.Value.ToUniversalTime();
            if (startTimeUtc < cutoffTime)
            {
                throw new BadRequestStewardException("Start time provided must not be in the past.");
            }

            try
            {
                var response = await this.Services.LiveOpsService.GetCMSRacersCupScheduleForUser(
                    xuid,
                    startTimeUtc.DateTime,
                    daysForward,
                    Array.Empty<ForzaEventSessionType>()).ConfigureAwait(true);

                var result = this.mapper.Map<RacersCupSchedule>(response.scheduleData);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No racer schedule data found for {TitleConstants.SteelheadFullName}", ex);
            }
        }
    }
}
