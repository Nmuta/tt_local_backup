using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Output;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class WelcomeCenterControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public WelcomeCenterControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<WelcomeCenterOutput> GetWelcomeCenterConfig()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/welcomeCenter/configuration");

            return await ServiceClient.SendRequestAsync<WelcomeCenterOutput>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<WelcomeCenterOutput> GetWelcomeCenterConfig(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/welcomeCenter/player/{xuid}/configuration");

            return await ServiceClient.SendRequestAsync<WelcomeCenterOutput>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
