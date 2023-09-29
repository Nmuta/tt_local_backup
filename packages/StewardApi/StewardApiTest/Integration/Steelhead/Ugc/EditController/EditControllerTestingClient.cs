using System;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Microsoft.AspNetCore.Mvc;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class EditControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public EditControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task EditUgcTitleAndDescription(string ugcId, [FromBody] UgcEditInput ugcEditInput)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/{ugcId}/edit");

            await ServiceClient.SendRequestAsync(HttpMethod.Post, path, this.authKey, Version, ugcEditInput, headers: this.headers).ConfigureAwait(false);
        }

        public async Task EditUgcStats(string ugcId, [FromBody] UgcEditStatsInput ugcEditStatsInput)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/{ugcId}/edit/stats");

            await ServiceClient.SendRequestAsync(HttpMethod.Post, path, this.authKey, Version, ugcEditStatsInput, headers: this.headers).ConfigureAwait(false);
        }
    }
}
