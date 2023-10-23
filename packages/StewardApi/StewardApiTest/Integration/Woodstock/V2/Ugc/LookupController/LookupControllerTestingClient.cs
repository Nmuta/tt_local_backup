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
    public sealed class LookupControllerTestingClient : WoodstockStewardBaseTestingClient
    {
        public LookupControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Woodstock", nameof(WoodstockEndpoint.Retail));
        }
        public async Task<IList<ThumbnailLookupOutput>> PostSearchUgcItems(IList<string> ugcIds)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/lookup/photos/thumbnails");
            return await ServiceClient.SendRequestAsync<IList<ThumbnailLookupOutput>>(HttpMethod.Post, path, this.authKey, Version, requestBody: ugcIds, headers: this.headers).ConfigureAwait(false);
        }
    }
}
