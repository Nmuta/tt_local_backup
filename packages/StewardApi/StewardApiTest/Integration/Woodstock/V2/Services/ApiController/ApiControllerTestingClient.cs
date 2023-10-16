using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock.V2
{
    public sealed class ApiControllerTestingClient : WoodstockStewardBaseTestingClient
    {
        public ApiControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Woodstock", nameof(WoodstockEndpoint.Retail));
        }

        public async Task<PermissionsManagementService.GetApiPermissionsOutput> GetApiPermissions()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/services/apiPermissions");

            return await ServiceClient.SendRequestAsync<PermissionsManagementService.GetApiPermissionsOutput>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        //We DO NOT want to run the Post endpoint in testing for safety reasons
    }
}
