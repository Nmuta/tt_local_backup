using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class FlagsControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public FlagsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<SteelheadUserFlags> GetFlags(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/flags");

            return await ServiceClient.SendRequestAsync<SteelheadUserFlags>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadUserFlags> SetFlags(ulong xuid, SteelheadUserFlagsInput newFlags)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/flags");

            return await ServiceClient.SendRequestAsync<SteelheadUserFlags>(HttpMethod.Put, path, this.authKey, Version, requestBody: newFlags, headers: this.headers).ConfigureAwait(false);
        }
    }
}
