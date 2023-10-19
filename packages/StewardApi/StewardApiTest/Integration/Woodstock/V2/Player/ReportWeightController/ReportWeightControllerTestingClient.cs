using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock.V2
{
    public sealed class ReportWeightControllerTestingClient : WoodstockStewardBaseTestingClient
    {
        public ReportWeightControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(WoodstockEndpoint.Retail));
        }

        public async Task<UserReportWeight> GetReportWeight(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/reportWeight");

            return await ServiceClient.SendRequestAsync<UserReportWeight>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<UserReportWeight> SetReportWeight(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/reportWeight");

            return await ServiceClient.SendRequestAsync<UserReportWeight>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
