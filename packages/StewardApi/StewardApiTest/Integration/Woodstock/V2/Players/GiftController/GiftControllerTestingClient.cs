using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock.V2
{
    public sealed class GiftControllerTestingClient : WoodstockStewardBaseTestingClient
    {
        public GiftControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Woodstock", nameof(WoodstockEndpoint.Retail));
        }

        public async Task<BackgroundJob> PostGiftItemBackgroundJob()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/players/gift/useBackgroundProcessing");

            return await ServiceClient.SendRequestAsync<BackgroundJob>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<BackgroundJob> PostGiftLiveryBackgroundJob()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/players/gift/livery/useBackgroundProcessing");

            return await ServiceClient.SendRequestAsync<BackgroundJob>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
