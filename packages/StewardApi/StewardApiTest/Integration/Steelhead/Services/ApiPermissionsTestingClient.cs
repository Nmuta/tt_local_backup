using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;
using Turn10.Services.LiveOps.FM8.Generated;
using PermissionsManagementService = Turn10.Services.LiveOps.FM8.Generated.PermissionsManagementService;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class ApiPermissionsTestingClient : SteelheadStewardBaseTestingClient
    {
        public ApiPermissionsTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<PermissionsManagementService.GetApiPermissionsOutput> GetServicesApiPermissions([FromQuery] int deviceRegion, [FromQuery] int startAt, [FromQuery] int maxResults)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/services/apiPermissions");

            return await ServiceClient.SendRequestAsync<PermissionsManagementService.GetApiPermissionsOutput>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
        public async Task<PermissionsManagementService.GetApiPermissionsOutput> SetServicesApiPermissions([FromBody] ForzaLiveOpsPermissionsUpdateParameters[] parametersList)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/services/apiPermissions");

            return await ServiceClient.SendRequestAsync<PermissionsManagementService.GetApiPermissionsOutput>(HttpMethod.Post, path, this.authKey, Version, parametersList, headers: this.headers).ConfigureAwait(false);
        }
    }
}
