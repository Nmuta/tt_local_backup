using System;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Microsoft.AspNetCore.Mvc;
using Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class CmsOverrideControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public CmsOverrideControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<ForzaCMSOverride> GetPlayerCmsOverride(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/cmsOverride");

            return await ServiceClient.SendRequestAsync<ForzaCMSOverride>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<OkResult> SetPlayerCmsOverride(ulong xuid, [FromBody] ForzaCMSOverride cmsOverride)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/cmsOverride");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Post, path, this.authKey, Version, cmsOverride, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<OkResult> DeletePlayerCmsOverride(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/cmsOverride");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Delete, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
