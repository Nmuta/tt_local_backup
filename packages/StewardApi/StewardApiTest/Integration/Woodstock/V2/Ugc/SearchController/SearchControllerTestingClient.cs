using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock.V2
{
    public sealed class SearchControllerTestingClient : WoodstockStewardBaseTestingClient
    {
        public SearchControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Woodstock", nameof(WoodstockEndpoint.Retail));
        }

        public async Task<IList<WoodstockUgcItem>> Get(string ugcType, UgcSearchFilters searchFilters)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/search/{ugcType}");

            return await ServiceClient.SendRequestAsync<IList<WoodstockUgcItem>>(HttpMethod.Post, path, this.authKey, Version, searchFilters, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<WoodstockUgcItem>> GetCurated(string ugcType, string curatedType)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/search/{ugcType}/curated/{curatedType}");

            return await ServiceClient.SendRequestAsync<IList<WoodstockUgcItem>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
