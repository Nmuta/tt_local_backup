using System;
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
using Turn10.LiveOps.StewardApi.Contracts.Pegasus;
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
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockLeaderboardProvider"/> class.
        /// </summary>
        public WoodstockLeaderboardProvider(
            IWoodstockService woodstockService,
            IWoodstockPegasusService pegasusService,
            IMapper mapper)
        {
            woodstockService.ShouldNotBeNull(nameof(woodstockService));
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.woodstockService = woodstockService;
            this.pegasusService = pegasusService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        [SuppressMessage("Usage", "VSTHRD103:GetResult synchronously blocks", Justification = "Used in conjunction with Task.WhenAll")]

        public async Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync()
        {
            var getPegasusLeaderboards = this.pegasusService.GetLeaderboardsAsync();
            var getCarClasses = this.pegasusService.GetCarClassesAsync();

            await Task.WhenAll(getPegasusLeaderboards, getCarClasses).ConfigureAwait(false);

            var leaderboards = getPegasusLeaderboards.GetAwaiter().GetResult();
            var carClasses = getCarClasses.GetAwaiter().GetResult();

            foreach (var leaderboard in leaderboards)
            {
                var carClass = carClasses.FirstOrDefault(c => c.Id == leaderboard.CarClassId);
                if (carClass != null)
                {
                    leaderboard.CarClass = carClass.DisplayName;
                }
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

            var result = await this.woodstockService.GetLeaderboardScoresAsync(searchParams, startAt, maxResults, endpoint).ConfigureAwait(false);

            return this.mapper.Map<IEnumerable<LeaderboardScore>>(result);
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

            var result = await this.woodstockService.GetLeaderboardScoresAsync(searchParams, 0, maxResults, endpoint).ConfigureAwait(false);

            if (result.Count <= 0)
            {
                throw new NotFoundStewardException($"Could not find player XUID in leaderboard: {xuid}");
            }

            return this.mapper.Map<IEnumerable<LeaderboardScore>>(result);
        }

        /// <inheritdoc />
        public async Task DeleteLeaderboardScoresAsync(Guid[] scoreIds, string endpoint)
        {
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            if (scoreIds.Length <= 0)
            {
                throw new BadRequestStewardException($"Cannot provided empty array of score ids.");
            }

            await this.woodstockService.DeleteLeaderboardScoresAsync(scoreIds, endpoint).ConfigureAwait(false);
        }
    }
}
