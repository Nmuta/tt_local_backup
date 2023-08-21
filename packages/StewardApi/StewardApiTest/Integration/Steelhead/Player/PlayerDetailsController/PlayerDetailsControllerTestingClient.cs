using System;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class PlayerDetailsControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public PlayerDetailsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<SteelheadPlayerDetails> GetPlayerDetails(string gamertag)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/gamertag/{gamertag}/details");

            return await ServiceClient.SendRequestAsync<SteelheadPlayerDetails>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadPlayerDetails> GetPlayerDetails(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/xuid/{xuid}/details");

            return await ServiceClient.SendRequestAsync<SteelheadPlayerDetails>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<PlayerGameDetails> GetPlayerGameDetails(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/xuid/{xuid}/gamedetails");

            return await ServiceClient.SendRequestAsync<PlayerGameDetails>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
