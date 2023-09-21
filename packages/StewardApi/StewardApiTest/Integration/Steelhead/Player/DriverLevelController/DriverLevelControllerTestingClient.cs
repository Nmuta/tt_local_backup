using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class DriverLevelControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public DriverLevelControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<SteelheadDriverLevel> GetDriverLevel(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/driverLevel");

            return await ServiceClient.SendRequestAsync<SteelheadDriverLevel>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadDriverLevel> SetDriverLevel(ulong xuid, SteelheadDriverLevel newDriverLevel)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/driverLevel");

            return await ServiceClient.SendRequestAsync<SteelheadDriverLevel>(HttpMethod.Post, path, this.authKey, Version, requestBody: newDriverLevel, headers: this.headers).ConfigureAwait(false);
        }
    }
}
