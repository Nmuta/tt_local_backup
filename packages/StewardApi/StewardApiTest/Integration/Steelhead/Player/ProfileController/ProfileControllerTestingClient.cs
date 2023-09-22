using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Microsoft.AspNetCore.Mvc;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class ProfileControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public ProfileControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<OkResult> PostSavePlayerProfile(ulong xuid, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/profile/{profileId}/save");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<OkResult> PostLoadPlayerProfile(ulong xuid, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/profile/{profileId}/load");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<OkResult> PostResetPlayerProfile(ulong xuid, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/profile/{profileId}/reset");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
