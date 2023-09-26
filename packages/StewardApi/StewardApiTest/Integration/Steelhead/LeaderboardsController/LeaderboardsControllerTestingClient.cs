using Forza.Scoreboard.FM8.Generated;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class LeaderboardsControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public LeaderboardsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IEnumerable<Leaderboard>> GetLeaderboards()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/leaderboards");

            return await ServiceClient.SendRequestAsync<IEnumerable<Leaderboard>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<Leaderboard> GetLeaderboardMetadata(
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/leaderboards/metadata?scoreboardType={scoreboardType}&scoreType={scoreType}&trackId={trackId}&pivotId={pivotId}");

            return await ServiceClient.SendRequestAsync<Leaderboard>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<LeaderboardScore>> GetLeaderboardScores(
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            string deviceTypes)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/leaderboards/scores/top?scoreboardType={scoreboardType}&scoreType={scoreType}&trackId={trackId}&pivotId={pivotId}&deviceTypes={deviceTypes}");

            return await ServiceClient.SendRequestAsync<IEnumerable<LeaderboardScore>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<LeaderboardScore>> GetLeaderboardScoresAroundXuid(
            ulong xuid,
            ScoreboardType scoreboardType,
            ScoreType scoreType,
            int trackId,
            string pivotId,
            string deviceTypes)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/leaderboards/scores/near-player/{xuid}?scoreboardType={scoreboardType}&scoreType={scoreType}&trackId={trackId}&pivotId={pivotId}&deviceTypes={deviceTypes}");

            return await ServiceClient.SendRequestAsync<IEnumerable<LeaderboardScore>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<IdentityResultAlpha>> GetLeaderboardTalent()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/leaderboards/talent");

            return await ServiceClient.SendRequestAsync<IList<IdentityResultAlpha>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
