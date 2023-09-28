using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Microsoft.AspNetCore.Mvc;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class GeoFlagsControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public GeoFlagsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<OkResult> PostSetUgcGeoFlags(string ugcId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/{ugcId}/geoFlags");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
