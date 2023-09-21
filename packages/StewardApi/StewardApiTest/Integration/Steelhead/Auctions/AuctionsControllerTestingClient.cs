using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead.Auctions
{
    public sealed class AuctionsControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public AuctionsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<AuctionData> GetAuctionDetails(string auctionId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/auctions/{auctionId}");

            return await ServiceClient.SendRequestAsync<AuctionData>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<Dictionary<Guid, string>> DeleteAuctionAsync(string auctionId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/auctions/{auctionId}");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Delete, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
