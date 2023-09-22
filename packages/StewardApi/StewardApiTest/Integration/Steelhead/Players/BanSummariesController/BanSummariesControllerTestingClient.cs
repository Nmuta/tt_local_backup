using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class BanSummariesControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public BanSummariesControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<BanSummary>> GetBanSummaries([FromBody] IList<ulong> xuids)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/players/banSummaries");

            return await ServiceClient.SendRequestAsync<IList<BanSummary>>(HttpMethod.Post, path, this.authKey, Version, xuids, headers: this.headers).ConfigureAwait(false);
        }
    }
}
