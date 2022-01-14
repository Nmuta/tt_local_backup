using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH5.Generated;
using Forza.Scoreboard.FH5.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.Services.CMSRetrieval;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockLeaderboardProvider : IWoodstockLeaderboardProvider
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.PegasusCmsEnvironment
        };

        private readonly string cmsEnvironment;
        private readonly IWoodstockService woodstockService;
        private readonly CMSRetrievalHelper cmsRetrievalHelper;
        private readonly IKustoProvider kustoProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockLeaderboardProvider"/> class.
        /// </summary>
        public WoodstockLeaderboardProvider(
            IWoodstockService woodstockService,
            PegasusCmsProvider pegasusCmsProvider,
            IKustoProvider kustoProvider,
            IMapper mapper,
            IConfiguration configuration)
        {
            woodstockService.ShouldNotBeNull(nameof(woodstockService));
            pegasusCmsProvider.ShouldNotBeNull(nameof(pegasusCmsProvider));
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));
            mapper.ShouldNotBeNull(nameof(mapper));
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);

            this.woodstockService = woodstockService;
            this.cmsRetrievalHelper = pegasusCmsProvider.WoodstockCmsRetrievalHelper;
            this.kustoProvider = kustoProvider;
            this.mapper = mapper;
            this.cmsEnvironment = configuration[ConfigurationKeyConstants.PegasusCmsEnvironment];
        }

        /// <inheritdoc />
        public async Task<IEnumerable<Leaderboard>> GetLeaderboardsAsync()
        {
            var getPegasusLeaderboards = this.cmsRetrievalHelper.GetCMSObjectAsync<IList<PegasusLeaderboard>>(WoodstockContent.CMSFileNames.Leaderboards, this.cmsEnvironment);
            var getCarClasses = this.kustoProvider.GetCarClassesAsync();

            await Task.WhenAll(getPegasusLeaderboards, getCarClasses).ConfigureAwait(false);

            var pegasusLeaderboards = await getPegasusLeaderboards.ConfigureAwait(false);
            var leaderboards = this.mapper.Map<IList<Leaderboard>>(pegasusLeaderboards);
            var carClasses = await getCarClasses.ConfigureAwait(false);

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
