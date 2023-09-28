using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class IdentitiesControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public IdentitiesControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<IdentityResultAlpha>> PostSearchPlayersIdentitiesByXuid(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/players/identities");
            IList<IdentityQueryAlpha> requestBody = new List<IdentityQueryAlpha>() { new IdentityQueryAlpha() { Xuid = xuid} };

            return await ServiceClient.SendRequestAsync<IList<IdentityResultAlpha>>(HttpMethod.Post, path, this.authKey, Version, requestBody, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<IdentityResultAlpha>> PostSearchPlayersIdentitiesByGamerTag(string gamerTag)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/players/identities");
            IList<IdentityQueryAlpha> requestBody = new List<IdentityQueryAlpha>() { new IdentityQueryAlpha() { Gamertag = gamerTag } };

            return await ServiceClient.SendRequestAsync<IList<IdentityResultAlpha>>(HttpMethod.Post, path, this.authKey, Version, requestBody, headers: this.headers).ConfigureAwait(false);
        }
    }
}
