using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using static Forza.WebServices.FH5_main.Generated.LiveOpsService;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock.V2
{
    public sealed class CloneToDevControllerTestingClient : WoodstockStewardBaseTestingClient
    {
        public CloneToDevControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Woodstock", nameof(WoodstockEndpoint.Retail));
        }

        public async Task<CloneUgcFileOutput> PostCloneToDev(string ugcId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/{ugcId}/clone");

            return await ServiceClient.SendRequestAsync<CloneUgcFileOutput>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
