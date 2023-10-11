using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Scoreboard.FM8.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.Services.LiveOps.FM8.Generated;
using ScoreType = Forza.Scoreboard.FM8.Generated.ScoreType;
using Track = SteelheadLiveOpsContent.Track;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead.V2
{
    /// <inheritdoc />
    public sealed class SteelheadLeaderboardProvider : ISteelheadLeaderboardProvider
    {
        private readonly ISteelheadPegasusService pegasusService;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadLeaderboardProvider"/> class.
        /// </summary>
        public SteelheadLeaderboardProvider(
            ISteelheadPegasusService pegasusService,
            ILoggingService loggingService,
            IMapper mapper)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.pegasusService = pegasusService;
            this.loggingService = loggingService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        [SuppressMessage("Usage", "VSTHRD103:GetResult synchronously blocks", Justification = "Used in conjunction with Task.WhenAll")]
        public async Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync(string pegasusEnvironment)
        {
            var exceptions = new List<Exception>();
            var getPegasusLeaderboards = this.pegasusService.GetLeaderboardsAsync(pegasusEnvironment).SuccessOrDefault(Array.Empty<Leaderboard>(), exceptions);
            var getTracks = this.pegasusService.GetTracksAsync(pegasusEnvironment).SuccessOrDefault(Array.Empty<Track>(), exceptions);
            var getCarClasses = this.pegasusService.GetCarClassesAsync(pegasusEnvironment).SuccessOrDefault(Array.Empty<CarClass>(), new Action<Exception>(ex =>
            {
                // Leaderboards will work without car class association. Log custom exception for tracking purposes.
                this.loggingService.LogException(new AppInsightsException("Failed to get car classes from Pegasus when building leaderboards", ex));
            }));

            await Task.WhenAll(getPegasusLeaderboards, getTracks, getCarClasses).ConfigureAwait(false);

            if (getPegasusLeaderboards.IsFaulted)
            {
                throw new UnknownFailureStewardException(
                    "Failed to get leaderboards from Pegasus",
                    getPegasusLeaderboards.Exception);
            }

            var leaderboards = getPegasusLeaderboards.GetAwaiter().GetResult().ToList();
            var tracks = getTracks.GetAwaiter().GetResult();

            if (getCarClasses.IsCompletedSuccessfully)
            {
                var carClasses = getCarClasses.GetAwaiter().GetResult().ToList();
                var carClassesDict = carClasses.ToDictionary(carClass => carClass.Id);
                foreach (var leaderboard in leaderboards)
                {
                    if (carClassesDict.TryGetValue(leaderboard.CarClassId, out var carClass))
                    {
                        leaderboard.CarClass = carClass.DisplayName;
                    }
                }

                // Time Attach Leaderboards are auto-generated, we need to create 1 per track per car class
                foreach (var carClass in carClasses)
                {
                    foreach (var track in tracks)
                    {
                        leaderboards.Add(new Leaderboard()
                        {
                            Name = $"{track.ShortDisplayName} Time Attack - {carClass.DisplayName} Class",
                            GameScoreboardId = (int)carClass.Id,
                            TrackId = track.id,
                            ScoreboardTypeId = (int)ScoreboardType.TimeAttack,
                            ScoreboardType = ScoreboardType.TimeAttack.ToString(),
                            ScoreTypeId = (int)ScoreType.Laptime,
                            ScoreType = ScoreType.Laptime.ToString(),
                            CarClassId = (int)carClass.Id,
                            CarClass = carClass.DisplayName,
                        });
                    }
                }
#pragma warning restore CA1851 // Possible multiple enumerations of 'IEnumerable' collection
            }

            return leaderboards;
        }

        /// <inheritdoc />
        public async Task<Leaderboard> GetLeaderboardMetadataAsync(
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            string pegasusEnvironment)
        {
            var allLeaderboards = await this.GetLeaderboardsAsync(pegasusEnvironment).ConfigureAwait(true);

            var leaderboard = allLeaderboards.FirstOrDefault(leaderboard => leaderboard.ScoreboardTypeId == (int)scoreboardType
                && leaderboard.ScoreTypeId == (int)scoreType
                && leaderboard.TrackId == trackId
                && leaderboard.GameScoreboardId.ToInvariantString() == pivotId);

            if (leaderboard == null)
            {
                throw new BadRequestStewardException($"Could not find leaderboard from provided params. ScoreboardType: " +
                                                     $"{scoreboardType}, ScoreType: {scoreType}, TrackId: {trackId}, PivotId: {pivotId},");
            }

            return leaderboard;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            SteelheadProxyBundle service,
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            IEnumerable<DeviceType> deviceTypes,
            int startAt,
            int maxResults)
        {
            return await this.GetLeaderboardScoresAsync(service.ScoreboardManagementService, scoreboardType, scoreType, trackId, pivotId, deviceTypes, startAt, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            IScoreboardManagementService scoreboardManagementService,
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            IEnumerable<DeviceType> deviceTypes,
            int startAt,
            int maxResults)
        {
            pivotId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(pivotId));

            var searchParams = new ForzaSearchLeaderboardsParametersV2()
            {
                ScoreboardType = scoreboardType.ToString(),
                ScoreType = scoreType.ToString(),
                TrackId = trackId,
                PivotId = pivotId,
                ScoreView = ScoreView.All.ToString(),
                Xuid = 1, // 1 = System ID
            };

            // Only include device type in search params if they're relevant
            if (deviceTypes.Where(type => (int)type >= 0).Any())
            {
                searchParams.DeviceTypes = this.mapper.SafeMap<ForzaLiveDeviceType[]>(deviceTypes);
            }

            var result = await scoreboardManagementService.SearchLeaderboardsV2(searchParams, startAt, maxResults).ConfigureAwait(false);

            return this.mapper.SafeMap<IEnumerable<LeaderboardScore>>(result.results.Rows);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            SteelheadProxyBundle service,
            ulong xuid,
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            IEnumerable<DeviceType> deviceTypes,
            int maxResults)
        {
            pivotId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(pivotId));

            var searchParams = new ForzaSearchLeaderboardsParametersV2()
            {
                ScoreboardType = scoreboardType.ToString(),
                ScoreType = scoreType.ToString(),
                TrackId = trackId,
                PivotId = pivotId,
                ScoreView = ScoreView.NearbyMe.ToString(),
                Xuid = xuid,
            };

            // Only include device type in search params if they're relevant
            if (deviceTypes.Where(type => (int)type >= 0).Any())
            {
                searchParams.DeviceTypes = this.mapper.SafeMap<ForzaLiveDeviceType[]>(deviceTypes);
            }

            var result = await service.ScoreboardManagementService.SearchLeaderboardsV2(searchParams, 0, maxResults).ConfigureAwait(false);

            if (result.results.Rows.Length <= 0)
            {
                throw new NotFoundStewardException($"Could not find player XUID in leaderboard: {xuid}");
            }

            return this.mapper.SafeMap<IEnumerable<LeaderboardScore>>(result.results.Rows);
        }

        /// <inheritdoc />
        public async Task DeleteLeaderboardScoresAsync(SteelheadProxyBundle service, Guid[] scoreIds)
        {
            if (scoreIds.Length <= 0)
            {
                throw new BadRequestStewardException($"Cannot provided empty array of score ids.");
            }

            await service.ScoreboardManagementService.DeleteScores(scoreIds).ConfigureAwait(false);
        }

        /// <summary>
        ///     Builds string of leaderboard search parameters used for exception logging purposes.
        /// </summary>
        private string BuildParametersErrorString(ForzaSearchLeaderboardsParametersV2 parameters)
        {
            return $"(Xuid: {parameters.Xuid}) (ScoreboardType: {parameters.ScoreboardType}) (ScoreType: {parameters.ScoreType}) (ScoreView: {parameters.ScoreView}) (TrackId: {parameters.TrackId}) (PivotId: {parameters.PivotId})";
        }
    }
}
