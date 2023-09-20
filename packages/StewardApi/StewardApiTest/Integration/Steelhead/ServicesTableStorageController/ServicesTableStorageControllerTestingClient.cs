using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class ServicesTableStorageControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public ServicesTableStorageControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<ServicesTableStorageEntity>> GetTableStorage(ulong xuid, string externalProfileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/servicesTableStorage/player/{xuid}/externalProfileId/{externalProfileId}");

            return await ServiceClient.SendRequestAsync<IList<ServicesTableStorageEntity>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
