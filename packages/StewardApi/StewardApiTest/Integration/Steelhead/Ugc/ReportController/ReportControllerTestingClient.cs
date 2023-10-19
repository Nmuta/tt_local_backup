using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class ReportControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public ReportControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<UgcReportReason>> GetUgcReportReasons()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/reportReasons");

            return await ServiceClient.SendRequestAsync<IList<UgcReportReason>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<BulkReportUgcResponse>> PostUgcReport()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/report");

            return await ServiceClient.SendRequestAsync<IList<BulkReportUgcResponse>>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
