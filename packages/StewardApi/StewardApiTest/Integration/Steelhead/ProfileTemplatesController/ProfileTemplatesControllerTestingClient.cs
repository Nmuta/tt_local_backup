using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;
using System.Net.Http;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class ProfileTemplatesControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public ProfileTemplatesControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<string>> GetProfileTemplates()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/profileTemplates");

            return await ServiceClient.SendRequestAsync<IList<string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
