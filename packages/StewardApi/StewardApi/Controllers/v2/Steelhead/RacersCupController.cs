﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FM8.Generated;
using Microsoft.AspNetCore.Mvc;
using SteelheadLiveOpsContent;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
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
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Calendar, Topic.RacersCup, Target.Details, Dev.ReviseTags)]
    public class RacersCupController : V2SteelheadControllerBase
    {
        private readonly IMapper mapper;
        private readonly ILoggingService loggingService;
        private readonly ISteelheadPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="RacersCupController"/> class for Steelhead.
        /// </summary>
        public RacersCupController(IMapper mapper, ILoggingService loggingService, ISteelheadPegasusService pegasusService)
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
        public async Task<IActionResult> GetCmsRacersCupSchedule(
            [FromQuery] string environment,
            [FromQuery] string slot,
            [FromQuery] string snapshot,
            [FromQuery] DateTimeOffset? startTime,
            [FromQuery] int daysForward)
        {
            daysForward.ShouldBeGreaterThanValue(-1);
            environment.ShouldNotBeNullEmptyOrWhiteSpace(nameof(environment));

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
                var eventGeneration = this.Services.LiveOpsService.GetCMSRacersCupScheduleV2(
                    environment,
                    slot ?? string.Empty,
                    snapshot ?? string.Empty,
                    startTimeUtc.DateTime,
                    daysForward);
                var racersCupChampionshipScheduleV3 = this.pegasusService.GetRacersCupChampionshipScheduleV4Async(environment, slot, snapshot);
                var racersCupPlaylistDataV3 = this.pegasusService.GetRacersCupPlaylistDataV3Async(environment, slot, snapshot);

                await Task.WhenAll(eventGeneration, racersCupChampionshipScheduleV3, racersCupPlaylistDataV3);

                var racersCupChampionshipSchedule = this.BuildChampionship(
                    eventGeneration.GetAwaiter().GetResult().scheduleData,
                    racersCupChampionshipScheduleV3.GetAwaiter().GetResult().Championships.Single(),
                    racersCupPlaylistDataV3.GetAwaiter().GetResult());

                return this.Ok(racersCupChampionshipSchedule);
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
            xuid.EnsureValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid);
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
                var eventGeneration = this.Services.LiveOpsService.GetCMSRacersCupScheduleForUserV2(
                    xuid,
                    startTimeUtc.DateTime,
                    daysForward);
                var racersCupChampionshipScheduleV3 = this.pegasusService.GetRacersCupChampionshipScheduleV4Async();
                var racersCupPlaylistDataV3 = this.pegasusService.GetRacersCupPlaylistDataV3Async();
                await Task.WhenAll(eventGeneration, racersCupChampionshipScheduleV3, racersCupPlaylistDataV3);

                var racersCupChampionshipSchedule = this.BuildChampionship(
                    eventGeneration.GetAwaiter().GetResult().scheduleData,
                    racersCupChampionshipScheduleV3.GetAwaiter().GetResult().Championships.Single(),
                    racersCupPlaylistDataV3.GetAwaiter().GetResult());

                return this.Ok(racersCupChampionshipSchedule);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No racer schedule data found for {TitleConstants.SteelheadFullName}", ex);
            }
        }

        private RacersCupChampionship BuildChampionship(
            ForzaRacersCupScheduleDataV2 eventGeneration,
            ChampionshipDataV3 racersCupChampionship,
            Dictionary<Guid, ChampionshipPlaylistDataV3> racersCupPlaylistDataV3)
        {
            var racersCupChampionshipSchedule = new RacersCupChampionship() { Series = new List<RacersCupSeries>() };

            foreach (var seriesCollection in racersCupChampionship.SeriesCollections)
            {
                foreach (var cycledSeriesData in seriesCollection.CycledSeriesData)
                {
                    ////ChampionshipPlaylistDataV3 playlistInfo = racersCupPlaylistDataV3[cycledSeriesData.CycledSeries.ChampionshipPlaylistData.First()];
                    var playlistInfoCollection = cycledSeriesData.CycledSeries.ChampionshipPlaylistData.Select(x => racersCupPlaylistDataV3[x]);

                    var events = new List<RacersCupEvent>();

                    foreach (var eventData in cycledSeriesData.CycledSeries.ChampionshipEventData)
                    {
                        // Propogate event windows for each event.
                        var eventWindows = eventGeneration.EventWindowData.FirstOrDefault(x => x.EventDataId == eventData.EventDataId)?.Windows;
                        if (eventWindows == null)
                        {
                            // If there's no event windows to chart, we don't care about it.
                            continue;
                        }

                        var playlistName = playlistInfoCollection.Where(playlistData => playlistData.EventPlaylistEventData.Select(tuple => tuple.Item1)
                                            .Where(championshipEventData => championshipEventData.EventDataId == eventData.EventDataId).Any()).Single().EventPlaylistName;

                        var newEvent = new RacersCupEvent()
                        {
                            Name = eventData.Name,
                            PlaylistName = playlistName, ////PlaylistName = playlistInfo.EventPlaylistName,
                            EventWindows = this.mapper.SafeMap<List<RacersCupEventWindow>>(eventWindows),
                            GameOptions = new List<RacersCupGameOptions>(), // TODO: use real game options
                            QualificationOptions = this.mapper.SafeMap<RacersCupQualificationOptions>(cycledSeriesData.CycledSeries.DefaultEventOverrides.QualificationOptions),
                        };

                        events.Add(newEvent);
                    }

                    var newSeries = new RacersCupSeries
                    {
                        Name = cycledSeriesData.CycledSeries.Name,
                        OpenTimeUtc = cycledSeriesData.CycledSeries.OpenTime.HasValue ? cycledSeriesData.CycledSeries.OpenTime.Value : DateTime.MinValue,
                        CloseTimeUtc = cycledSeriesData.CycledSeries.CloseTime.HasValue ? cycledSeriesData.CycledSeries.CloseTime.Value : DateTime.MaxValue,
                        Events = events,
                        EventPlaylistTransitionTimeUtc = cycledSeriesData.CycledSeries.EventPlaylistTransitionTime,
                    };

                    racersCupChampionshipSchedule.Series.Add(newSeries);
                }

                foreach (var scheduledSeriesData in seriesCollection.ScheduledSeriesData)
                {
                    var playlistInfoCollection = scheduledSeriesData.ScheduledSeries.ChampionshipPlaylistData.Select(x => racersCupPlaylistDataV3[x]);

                    var events = new List<RacersCupEvent>();

                    var carRestriction = scheduledSeriesData.ScheduledSeries.DefaultEventOverrides.Buckets.First().CarRestrictions.CarClassId.ToString();

                    foreach (var eventData in scheduledSeriesData.ScheduledSeries.ChampionshipEventData)
                    {
                        // Propogate event windows for each event.
                        var eventWindows = eventGeneration.EventWindowData.FirstOrDefault(x => x.EventDataId == eventData.EventDataId)?.Windows;
                        if (eventWindows == null)
                        {
                            // If there's no event windows to chart, we don't care about it.
                            continue;
                        }

                        var playlistName = playlistInfoCollection.Where(playlistData => playlistData.EventPlaylistEventData.Select(tuple => tuple.Item1)
                                            .Where(championshipEventData => championshipEventData.EventDataId == eventData.EventDataId).Any()).Single().EventPlaylistName;

                        var newEvent = new RacersCupEvent()
                        {
                            Name = eventData.Name,
                            PlaylistName = playlistName,
                            CarRestrictions = carRestriction,
                            EventWindows = this.mapper.SafeMap<List<RacersCupEventWindow>>(eventWindows),
                            GameOptions = this.mapper.SafeMap<List<RacersCupGameOptions>>(eventData.GameOptions),
                            QualificationOptions = this.mapper.SafeMap<RacersCupQualificationOptions>(scheduledSeriesData.ScheduledSeries.DefaultEventOverrides.QualificationOptions),
                        };

                        events.Add(newEvent);
                    }

                    var newSeries = new RacersCupSeries
                    {
                        Name = scheduledSeriesData.ScheduledSeries.Name,
                        OpenTimeUtc = scheduledSeriesData.ScheduledSeries.OpenTime,
                        CloseTimeUtc = scheduledSeriesData.ScheduledSeries.CloseTime,
                        Events = events,
                        EventPlaylistTransitionTimeUtc = scheduledSeriesData.ScheduledSeries.EventPlaylistTransitionTime,
                    };

                    racersCupChampionshipSchedule.Series.Add(newSeries);
                }
            }

            return racersCupChampionshipSchedule;
        }

        /// <summary>
        ///     Gets all racers cup series.
        /// </summary>
        [HttpGet("series")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetRacersCupSeries()
        {
            var racersCupSeries = await this.pegasusService.GetRacersCupSeriesAsync();

            return this.Ok(racersCupSeries);
        }
    }
}
