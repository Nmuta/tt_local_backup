using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class SkillRatingControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public SkillRatingControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }
        public async Task<SkillRatingSummary> GetSkillRating(ulong xuid, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/profile/{profileId}/skillRating");
            return await ServiceClient.SendRequestAsync<SkillRatingSummary>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
        public async Task<SkillRatingSummary> DeleteSkillRating(ulong xuid, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/profile/{profileId}/skillRating");
            return await ServiceClient.SendRequestAsync<SkillRatingSummary>(HttpMethod.Delete, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
        public async Task<SkillRatingSummary> PostSetSkillRating(ulong xuid, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/profile/{profileId}/skillRating");
            return await ServiceClient.SendRequestAsync<SkillRatingSummary>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
