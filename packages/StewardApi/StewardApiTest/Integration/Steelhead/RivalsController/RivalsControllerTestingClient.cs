using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class RivalsControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public RivalsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IEnumerable<RivalsEvent>> GetRivalsEvents()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/rivals/events");

            return await ServiceClient.SendRequestAsync<IEnumerable<RivalsEvent>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<RivalsEvent>> GetRivalsEvents(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/rivals/player/{xuid}/events");

            return await ServiceClient.SendRequestAsync<IEnumerable<RivalsEvent>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<Dictionary<Guid, string>> GetRivalsEventsReference()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/rivals/reference");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<Dictionary<Guid, string>> GetRivalsEventsCategories()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/rivals/categories");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
