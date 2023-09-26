using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class ConsoleControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public ConsoleControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task SetConsoleBanStatus(ulong consoleId, bool isBanned)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/console/{consoleId}/banStatus");

            await ServiceClient.SendRequestAsync(HttpMethod.Put, path, this.authKey, Version, requestBody: isBanned, headers: this.headers).ConfigureAwait(false);
        }
    }
}
