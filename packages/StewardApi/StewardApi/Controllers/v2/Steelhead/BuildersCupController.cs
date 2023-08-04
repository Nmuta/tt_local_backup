﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SteelheadLiveOpsContent;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.BuildersCup;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead Builder's Cup Calendar.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/buildersCup")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Calendar, Topic.BuildersCup, Target.Details, Dev.ReviseTags)]
    public class BuildersCupController : V2SteelheadControllerBase
    {
        private readonly IMapper mapper;
        private readonly ISteelheadPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BuildersCupController"/> class for Steelhead.
        /// </summary>
        public BuildersCupController(IMapper mapper, ISteelheadPegasusService pegasusService)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            pegasusService.ShouldNotBeNull(nameof(pegasusService));

            this.mapper = mapper;
            this.pegasusService = pegasusService;
        }

        /// <summary>
        ///     Gets a Builder's Cup featured content schedule.
        /// </summary>
        [HttpGet("schedule")]
        [SwaggerResponse(200, type: typeof(BuildersCupFeaturedTour))]
        public async Task<IActionResult> GetCmsBuildersCupSchedule()
        {
            BuildersCupCupDataV3 featuredCupData;
            try
            {
                featuredCupData = await this.pegasusService.GetBuildersCupFeaturedCupLadderAsync().ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No builders cup schedule data found for {TitleConstants.SteelheadFullName}", ex);
            }

            if (featuredCupData == null)
            {
                throw new UnknownFailureStewardException($"No builders cup schedule data found for {TitleConstants.SteelheadFullName}");
            }

            var featuredTours = this.mapper.SafeMap<IList<BuildersCupFeaturedTour>>(featuredCupData.ChampionshipLadder);

            return this.Ok(featuredTours);
        }

        /// <summary>
        ///     Gets builders cup championships.
        /// </summary>
        [HttpGet("championships")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetBuildersCupChampionships()
        {
            var buildersCupChampionships = await this.pegasusService.GetBuildersCupChampionshipsAsync().ConfigureAwait(true);

            return this.Ok(buildersCupChampionships);
        }

        /// <summary>
        ///     Gets builders cup ladders.
        /// </summary>
        [HttpGet("ladders")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetBuildersCupLadders()
        {
            var buildersCupLadders = await this.pegasusService.GetBuildersCupLaddersAsync().ConfigureAwait(true);

            return this.Ok(buildersCupLadders);
        }

        /// <summary>
        ///     Gets builders cup series.
        /// </summary>
        [HttpGet("series")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetBuildersCupSeries()
        {
            var buildersCupSeries = await this.pegasusService.GetBuildersCupSeriesAsync().ConfigureAwait(true);

            return this.Ok(buildersCupSeries);
        }
    }
}
