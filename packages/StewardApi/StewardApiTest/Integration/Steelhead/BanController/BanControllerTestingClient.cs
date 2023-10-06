using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.BuildersCup;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class SteelheadBanControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public SteelheadBanControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<UnbanResult> PostExpireBan(string banEntryId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ban/{banEntryId}");

            return await ServiceClient.SendRequestAsync<UnbanResult>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<UnbanResult> DeleteBan(string banEntryId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ban/{banEntryId}");

            return await ServiceClient.SendRequestAsync<UnbanResult>(HttpMethod.Delete, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
