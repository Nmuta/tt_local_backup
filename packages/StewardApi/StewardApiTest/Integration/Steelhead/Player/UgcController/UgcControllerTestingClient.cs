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
    public sealed class UgcControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public UgcControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<SteelheadUgcItem>> GetUgcItems(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/{xuid}/ugc");

            return await ServiceClient.SendRequestAsync<IList<SteelheadUgcItem>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<UgcItem>> GetHiddenUgcItems(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/{xuid}/ugc/hidden");

            return await ServiceClient.SendRequestAsync<IList<UgcItem>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
