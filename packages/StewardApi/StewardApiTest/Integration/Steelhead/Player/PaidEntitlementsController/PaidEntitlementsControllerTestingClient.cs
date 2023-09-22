using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Microsoft.AspNetCore.Mvc;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class PaidEntitlementsControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public PaidEntitlementsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<ProfileNote>> GetPaidEntitlements(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/paidEntitlements");

            return await ServiceClient.SendRequestAsync<IList<ProfileNote>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<OkResult> PutPaidEntitlement(ulong xuid, string productId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/paidEntitlements/{productId}");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Put, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
