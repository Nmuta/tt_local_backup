using System;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class BanControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public BanControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<ForzaBanDuration> GetNextBanDuration(ulong xuid, Guid banconfig)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/ban/nextDuration/{banconfig}");

            return await ServiceClient.SendRequestAsync<ForzaBanDuration>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
