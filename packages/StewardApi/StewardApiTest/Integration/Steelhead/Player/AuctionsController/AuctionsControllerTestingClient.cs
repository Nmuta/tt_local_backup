using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class AuctionsControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public AuctionsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<PlayerAuction>> GetPlayerAuctions(
            ulong xuid,
            [FromQuery] short carId = short.MaxValue,
            [FromQuery] short makeId = short.MaxValue,
            [FromQuery] string status = "Any",
            [FromQuery] string sort = "ClosingDateDescending")
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/auctions");

            return await ServiceClient.SendRequestAsync<IList<PlayerAuction>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<AuctionHistoryEntry>> GetPlayerAuctionLog(ulong xuid, [FromQuery] string skipToken = null)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/auctions");

            return await ServiceClient.SendRequestAsync<IList<AuctionHistoryEntry>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
