﻿using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH5_main.Generated;
using Forza.Scoreboard.FH5_main.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.Services.CMSRetrieval;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockLeaderboardProvider : IWoodstockLeaderboardProvider
    {
        private readonly IWoodstockService woodstockService;
        private readonly IWoodstockPegasusService pegasusService;
        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockLeaderboardProvider"/> class.
        /// </summary>
        public WoodstockLeaderboardProvider(
            IWoodstockService woodstockService,
            IWoodstockPegasusService pegasusService,
            ILoggingService loggingService,
            IMapper mapper)
        {
            woodstockService.ShouldNotBeNull(nameof(woodstockService));
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.woodstockService = woodstockService;
            this.pegasusService = pegasusService;
            this.loggingService = loggingService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        [SuppressMessage("Usage", "VSTHRD103:GetResult synchronously blocks", Justification = "Used in conjunction with Task.WhenAll")]

        public async Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync()
        {
            var exceptions = new List<Exception>();
            var getPegasusLeaderboards = this.pegasusService.GetLeaderboardsAsync().SuccessOrDefault(Array.Empty<Leaderboard>(), exceptions);
            var getCarClasses = this.pegasusService.GetCarClassesAsync().SuccessOrDefault(Array.Empty<CarClass>(), exceptions);

            await Task.WhenAll(getPegasusLeaderboards, getCarClasses).ConfigureAwait(false);

            if (getPegasusLeaderboards.IsFaulted)
            {
                throw new UnknownFailureStewardException(
                    "Failed to get leaderboards from Pegasus",
                    getPegasusLeaderboards.Exception);
            }

            var leaderboards = getPegasusLeaderboards.GetAwaiter().GetResult();

            if (getCarClasses.IsCompletedSuccessfully)
            {
                var carClassesDict = getCarClasses.GetAwaiter().GetResult().ToDictionary(carClass => carClass.Id);
                foreach (var leaderboard in leaderboards)
                {
                    if (carClassesDict.TryGetValue(leaderboard.CarClassId, out CarClass carClass))
                    {
                        leaderboard.CarClass = carClass.DisplayName;
                    }
                }

            }
            else
            {
                // Leaderboards will work without car class association. Log custom exception for tracking purposes.
                this.loggingService.LogException(new AppInsightsException("Failed to get car classes from Pegasus when building leaderboards", getCarClasses.Exception));
            }

            return leaderboards;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            int startAt,
            int maxResults,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));
            pivotId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(pivotId));

            var searchParams = new ForzaSearchLeaderboardsParameters()
            {
                ScoreboardType = scoreboardType,
                ScoreType = scoreType,
                TrackId = trackId,
                PivotId = pivotId,
                ScoreView = ScoreView.All,
                Xuid = 1, // 1 = System ID
            };

            try
            {
                var result = await this.woodstockService.GetLeaderboardScoresAsync(searchParams, startAt, maxResults, endpoint).ConfigureAwait(false);

                return this.mapper.Map<IEnumerable<LeaderboardScore>>(result);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get leaderboard scores with params: {this.BuildParametersErrorString(searchParams)}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAsync(
            ulong xuid,
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            int maxResults,
            string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));
            pivotId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(pivotId));

            var searchParams = new ForzaSearchLeaderboardsParameters()
            {
                ScoreboardType = scoreboardType,
                ScoreType = scoreType,
                TrackId = trackId,
                PivotId = pivotId,
                ScoreView = ScoreView.NearbyMe,
                Xuid = xuid,
            };

            try
            {

                var result = await this.woodstockService.GetLeaderboardScoresAsync(searchParams, 0, maxResults, endpoint).ConfigureAwait(false);

                if (result.Count <= 0)
                {
                    throw new NotFoundStewardException($"Could not find player XUID in leaderboard: {xuid}");
                }

                return this.mapper.Map<IEnumerable<LeaderboardScore>>(result);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get leaderboard scores with params: {this.BuildParametersErrorString(searchParams)}", ex);
            }
        }

        /// <inheritdoc />
        public async Task DeleteLeaderboardScoresAsync(Guid[] scoreIds, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            if (scoreIds.Length <= 0)
            {
                throw new BadRequestStewardException($"Cannot provided empty array of score ids.");
            }

            try
            {
                await this.woodstockService.DeleteLeaderboardScoresAsync(scoreIds, endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to delete leaderboard scores.", ex);
            }
        }

        /// <summary>
        ///     Builds string of leaderboard search parameters used for exception logging purposes.
        /// </summary>
        private string BuildParametersErrorString(ForzaSearchLeaderboardsParameters parameters)
        {
            return $"(Xuid: {parameters.Xuid}) (ScoreboardType: {parameters.ScoreboardType}) (ScoreType: {parameters.ScoreType}) (ScoreView: {parameters.ScoreView}) (TrackId: {parameters.TrackId}) (PivotId: {parameters.PivotId})";
        }
    }
}
