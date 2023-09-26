using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class SafetyRatingControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public SafetyRatingControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<SafetyRating> GetSafetyRating(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/safetyRating");

            return await ServiceClient.SendRequestAsync<SafetyRating>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SafetyRating> DeleteSafetyRating(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/safetyRating");

            return await ServiceClient.SendRequestAsync<SafetyRating>(HttpMethod.Delete, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SafetyRating> PostSetSafetyRating(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/safetyRating");

            return await ServiceClient.SendRequestAsync<SafetyRating>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
