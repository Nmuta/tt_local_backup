using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class TestProxiesControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public TestProxiesControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
        }

        public async Task TestServiceProxies()
        {

            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
