using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class LoyaltyRewardsControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public LoyaltyRewardsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<SteelheadLoyaltyRewardsTitle>> GetHasPlayedRecord(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/loyalty");

            return await ServiceClient.SendRequestAsync<IList<SteelheadLoyaltyRewardsTitle>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<Dictionary<SteelheadLoyaltyRewardsTitle, bool>> ResendLoyaltyRewards(ulong xuid, IList<string> gameTitles)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/loyalty");

            return await ServiceClient.SendRequestAsync<Dictionary<SteelheadLoyaltyRewardsTitle, bool>>(HttpMethod.Post, path, this.authKey, Version, gameTitles, headers: this.headers).ConfigureAwait(false);
        }
    }
}
