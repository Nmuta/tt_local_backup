using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.BuildersCup;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class AcLogReaderControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public AcLogReaderControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<AcLogReaderResponse> PostDecodeCrashLogs()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/acLogReader");

            return await ServiceClient.SendRequestAsync<AcLogReaderResponse>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
