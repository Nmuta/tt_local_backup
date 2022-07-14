using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class SteelheadStewardTestingClient
    {
        private const string Version = "1";
        private const string TitlePath = "api/v2/title/steelhead";

        private readonly Uri baseUri;
        private readonly string authKey;

        public SteelheadStewardTestingClient(Uri baseUri, string authKey)
        {
            baseUri.ShouldNotBeNull(nameof(baseUri));
            authKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(authKey));

            this.baseUri = baseUri;
            this.authKey = authKey;
        }

        private static ServiceClient ServiceClient => new ServiceClient(60, 60);

        public async Task TestServiceProxies()
        {

            var path = new Uri(this.baseUri, $"{TitlePath}/test/proxies");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }
    }
}
