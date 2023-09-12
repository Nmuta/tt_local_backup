using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class ItemsControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public ItemsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<SteelheadMasterInventory> GetMasterInventoryList()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/items");

            return await ServiceClient.SendRequestAsync<SteelheadMasterInventory>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IEnumerable<SimpleCar>> GetCarsAsync()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/items/cars");

            return await ServiceClient.SendRequestAsync<IEnumerable<SimpleCar>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
