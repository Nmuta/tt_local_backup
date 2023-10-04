using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;
using Turn10.LiveOps.StewardApi.Contracts.Git;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class ImageTextTileControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public ImageTextTileControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<Dictionary<Guid, string>> GetAllImageTextTileEntries()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/welcomecenter/worldofforza/imagetext/options");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<WofImageTextBridge> GetImageTextTileEntry(string id)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/welcomecenter/worldofforza/imagetext/{id}");

            return await ServiceClient.SendRequestAsync<WofImageTextBridge>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<PullRequest> PostEditImageTextTileEntry(string id)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/welcomecenter/worldofforza/imagetext/{id}");

            return await ServiceClient.SendRequestAsync<PullRequest>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
