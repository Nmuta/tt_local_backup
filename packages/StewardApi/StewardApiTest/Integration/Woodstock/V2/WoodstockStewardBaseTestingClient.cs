using System;
using System.Collections.Generic;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock.V2
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1051:Do not declare visible instance fields", Justification = "<Pending>")]
    public class WoodstockStewardBaseTestingClient
    {
        protected const string Version = "1";
        protected const string TitlePath = "api/v2/title/woodstock";

        protected readonly Uri baseUri;
        protected readonly string authKey;
        protected readonly Dictionary<string, string> headers;

        public WoodstockStewardBaseTestingClient(Uri baseUri, string authKey)
        {
            baseUri.ShouldNotBeNull(nameof(baseUri));
            authKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(authKey));

            this.baseUri = baseUri;
            this.authKey = authKey;
            this.headers = new Dictionary<string, string>()
            {
                { "endpointKey", WoodstockEndpoint.V2Default }
            };
        }

        protected static ServiceClient ServiceClient => new ServiceClient(60, 60);
    }
}
