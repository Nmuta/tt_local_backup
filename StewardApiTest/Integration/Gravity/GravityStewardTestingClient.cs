using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Gravity
{
    public sealed class GravityStewardTestingClient
    {
        private const string Version = "1";
        private const string TitlePath = "api/v1/title/gravity/";

        private readonly Uri baseUri;
        private readonly string authKey;

        public GravityStewardTestingClient(Uri baseUri, string authKey)
        {
            baseUri.ShouldNotBeNull(nameof(baseUri));
            authKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(authKey));

            this.baseUri = baseUri;
            this.authKey = authKey;
        }

        private static ServiceClient ServiceClient => new ServiceClient(90, 90);

        public async Task<IList<IdentityResultBeta>> GetPlayerIdentitiesAsync(IList<IdentityQueryBeta> query)
        {
            query.ShouldNotBeNull(nameof(query));

            var path = new Uri(this.baseUri, $"{TitlePath}players/identities");

            return await ServiceClient.SendRequestAsync<IList<IdentityResultBeta>>(HttpMethod.Post, path, this.authKey, Version, query).ConfigureAwait(false);
        }

        public async Task<GravityPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var path = new Uri(this.baseUri, $"{TitlePath}player/gamertag({gamertag})/details");

            return await ServiceClient.SendRequestAsync<GravityPlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<GravityPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/details");

            return await ServiceClient.SendRequestAsync<GravityPlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<GravityPlayerDetails> GetPlayerDetailsByTurn10IdAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id({t10Id})/details");

            return await ServiceClient.SendRequestAsync<GravityPlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<GravityPlayerInventory> GetPlayerInventoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<GravityPlayerInventory> GetPlayerInventoryAsync(ulong xuid, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/profileId({profileId})/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<GravityPlayerInventory> GetPlayerInventoryAsync(string t10Id)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id({t10Id})/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<GravityPlayerInventory> GetPlayerInventoryAsync(string t10Id, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id({t10Id})/profileId({profileId})/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<GiftResponse<string>> UpdatePlayerInventoryByT10IdAsync(string t10Id, GravityGift gift)
        {
            t10Id.ShouldNotBeNull(nameof(t10Id));
            gift.ShouldNotBeNull(nameof(gift));

            var path = new Uri(this.baseUri, $"{TitlePath}gifting/t10Id({t10Id})");

            return await ServiceClient.SendRequestAsync<GiftResponse<string>>(HttpMethod.Post, path, this.authKey, Version, gift).ConfigureAwait(false);
        }

        public async Task<ResponseWithHeaders<BackgroundJob>> UpdatePlayerInventoryWithHeaderResponseAsync(string t10Id, GravityGift giftInventory, IList<string> headersToValidate)
        {
            giftInventory.ShouldNotBeNull(nameof(giftInventory));

            var path = new Uri(this.baseUri, $"{TitlePath}gifting/t10Id({t10Id})/useBackgroundProcessing");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<BackgroundJob>(HttpMethod.Post, path, this.authKey, Version, headersToValidate, giftInventory).ConfigureAwait(false);
        }

        public async Task<GameSettings> GetGameSettingsAsync(string gameSettingsId)
        {
            gameSettingsId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gameSettingsId));

            var path = new Uri(this.baseUri, $"{TitlePath}masterInventory/gameSettingsId({gameSettingsId})");

            return await ServiceClient.SendRequestAsync<GameSettings>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<IList<GravityGiftHistory>> GetGiftHistoriesAsync(string t10Id)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id({t10Id})/giftHistory");

            return await ServiceClient.SendRequestAsync<IList<GravityGiftHistory>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<BackgroundJob> GetJobStatusAsync(string jobId)
        {
            jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));

            var path = new Uri(this.baseUri, $"api/v1/jobs/jobId({jobId})");

            return await ServiceClient.SendRequestAsync<BackgroundJob>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }
    }
}
