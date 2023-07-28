using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public class SteelheadStewardBaseTestingClient
    {
        protected const string Version = "1";
        protected const string TitlePath = "api/v2/title/steelhead";

        protected readonly Uri baseUri;
        protected readonly string authKey;
        protected readonly Dictionary<string, string> headers;

        public SteelheadStewardBaseTestingClient(Uri baseUri, string authKey)
        {
            baseUri.ShouldNotBeNull(nameof(baseUri));
            authKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(authKey));

            this.baseUri = baseUri;
            this.authKey = authKey;
            this.headers = new Dictionary<string, string>()
            {
                { "endpointKey", SteelheadEndpoint.V1Default }
            };
        }

        protected static ServiceClient ServiceClient => new ServiceClient(60, 60);
    }
}
