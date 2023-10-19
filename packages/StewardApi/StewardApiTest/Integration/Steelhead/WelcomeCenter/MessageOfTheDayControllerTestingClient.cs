using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.MessageOfTheDay;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class MessageOfTheDayControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public MessageOfTheDayControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<Dictionary<Guid, string>> GetMotDSelectionOptionsAsync()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/welcomecenter/messageoftheday/options");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<MotdBridge> GetMotDCurrentValuesAsync(string id)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/welcomecenter/messageoftheday/{id}");

            return await ServiceClient.SendRequestAsync<MotdBridge>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
