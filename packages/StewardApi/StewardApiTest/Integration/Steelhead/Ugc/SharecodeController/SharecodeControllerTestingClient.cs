using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class SharecodeControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public SharecodeControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<BulkGenerateSharecodeResponse>> PostGenerateSharecodes()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/sharecode");

            return await ServiceClient.SendRequestAsync<IList<BulkGenerateSharecodeResponse>>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

    }
}
