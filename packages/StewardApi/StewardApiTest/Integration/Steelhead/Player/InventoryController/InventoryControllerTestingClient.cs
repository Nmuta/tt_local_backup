using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class InventoryControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public InventoryControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<SteelheadPlayerInventory> GetPlayerInventory(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/inventory");

            return await ServiceClient.SendRequestAsync<SteelheadPlayerInventory>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadPlayerInventory> GetPlayerInventoryByProfileId(ulong xuid, ulong profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/inventory/profile/{profileId}");

            return await ServiceClient.SendRequestAsync<SteelheadPlayerInventory>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<PlayerInventoryCarItem> GetPlayerInventorySpecificCar(ulong xuid, ulong profileId, string vin)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/inventory/profile/{profileId}/car/{vin}");

            return await ServiceClient.SendRequestAsync<PlayerInventoryCarItem>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<SteelheadInventoryProfile>> GetPlayerInventoryProfiles(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/inventory/profiles");

            return await ServiceClient.SendRequestAsync<IList<SteelheadInventoryProfile>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadPlayerInventory> PostEditPlayerInventory(ulong xuid, string externalProfileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/inventory/externalProfileId/{externalProfileId}/items");

            return await ServiceClient.SendRequestAsync<SteelheadPlayerInventory>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadPlayerInventory>DeletePlayerInventoryItems(ulong xuid, string externalProfileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/inventory/externalProfileId/{externalProfileId}/items");

            return await ServiceClient.SendRequestAsync<SteelheadPlayerInventory>(HttpMethod.Delete, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
