using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Opus;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Opus
{
    public sealed class OpusStewardTestingClient
    {
        private const string Version = "1";
        private const string TitlePath = "api/v1/title/opus/";

        private readonly Uri baseUri;
        private readonly string authKey;

        public OpusStewardTestingClient(Uri baseUri, string authKey)
        {
            baseUri.ShouldNotBeNull(nameof(baseUri));
            authKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(authKey));

            this.baseUri = baseUri;
            this.authKey = authKey;
        }

        private static ServiceClient ServiceClient => new ServiceClient(60, 60);

        public async Task<IList<IdentityResultAlpha>> GetPlayerIdentitiesAsync(IList<IdentityQueryAlpha> query)
        {
            query.ShouldNotBeNull(nameof(query));

            var path = new Uri(this.baseUri, $"{TitlePath}players/identities");

            return await ServiceClient.SendRequestAsync<IList<IdentityResultAlpha>>(HttpMethod.Post, path, this.authKey, Version, query).ConfigureAwait(false);
        }

        public async Task<OpusPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var path = new Uri(this.baseUri, $"{TitlePath}player/gamertag({gamertag})/details");

            return await ServiceClient.SendRequestAsync<OpusPlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<OpusPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/details");

            return await ServiceClient.SendRequestAsync<OpusPlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<OpusPlayerInventory> GetPlayerInventoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventory");

            return await ServiceClient.SendRequestAsync<OpusPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<OpusPlayerInventory> GetPlayerInventoryAsync(int profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/profileId({profileId})/inventory");

            return await ServiceClient.SendRequestAsync<OpusPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<IList<OpusInventoryProfile>> GetInventoryProfilesAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventoryProfiles");

            return await ServiceClient.SendRequestAsync<IList<OpusInventoryProfile>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }
    }
}
