using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock.V2
{
    public sealed class GeoFlagsControllerTestingClient : WoodstockStewardBaseTestingClient
    {
        public GeoFlagsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Woodstock", nameof(WoodstockEndpoint.Retail));
        }
        public async Task PostSetGeoFlag(string ugcId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/{ugcId}/geoflags");
            await ServiceClient.SendRequestAsync(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
