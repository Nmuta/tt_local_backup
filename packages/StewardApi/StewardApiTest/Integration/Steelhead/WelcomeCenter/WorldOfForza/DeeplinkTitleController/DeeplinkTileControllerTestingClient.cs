using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Git;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class DeeplinkTileControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public DeeplinkTileControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<Dictionary<Guid, string>> GetWorldOfForzaDeeplinkSelectionOptionsAsync()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/welcomecenter/worldofforza/deeplink/options");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<WofDeeplinkBridge> GetWorldOfForzaDeeplinkCurrentValuesAsync(string id)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/welcomecenter/worldofforza/deeplink/{id}");

            return await ServiceClient.SendRequestAsync<WofDeeplinkBridge>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<PullRequest> EditAndSubmitDeeplinkTile(string id, [FromBody] WofDeeplinkBridge wofTileBridge)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/welcomecenter/worldofforza/deeplink/{id}");

            return await ServiceClient.SendRequestAsync<PullRequest>(HttpMethod.Post, path, this.authKey, Version, wofTileBridge, headers: this.headers).ConfigureAwait(false);
        }
    }
}
