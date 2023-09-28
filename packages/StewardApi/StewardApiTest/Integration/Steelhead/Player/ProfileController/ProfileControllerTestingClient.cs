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

        public async Task PostSavePlayerProfile(ulong xuid, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/profile/{profileId}/save");

            await ServiceClient.SendRequestAsync(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task PostLoadPlayerProfile(ulong xuid, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/profile/{profileId}/load");

            await ServiceClient.SendRequestAsync(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task PostResetPlayerProfile(ulong xuid, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/profile/{profileId}/reset");

            await ServiceClient.SendRequestAsync(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
