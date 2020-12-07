using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Gravity.Settings;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Gravity
{
    /// <summary>
    ///     Gravity test client for sending requests to Steward.
    /// </summary>
    public sealed class GravityStewardTestingClient
    {
        private const string Version = "1";
        private const string TitlePath = "api/v1/title/gravity/";

        private readonly Uri baseUri;
        private readonly string authKey;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GravityStewardTestingClient"/> class.
        /// </summary>
        /// <param name="baseUri">The base URI.</param>
        /// <param name="authKey">The auth key.</param>
        public GravityStewardTestingClient(Uri baseUri, string authKey)
        {
            baseUri.ShouldNotBeNull(nameof(baseUri));
            authKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(authKey));

            this.baseUri = baseUri;
            this.authKey = authKey;
        }

        private static ServiceClient ServiceClient => new ServiceClient(90, 90);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerDetails"/>.
        /// </returns>
        public async Task<GravityPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var path = new Uri(this.baseUri, $"{TitlePath}player/gamertag({gamertag})/details");

            return await ServiceClient.SendRequestAsync<GravityPlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets player details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerDetails"/>.
        /// </returns>
        public async Task<GravityPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/details");

            return await ServiceClient.SendRequestAsync<GravityPlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets player details.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerDetails"/>.
        /// </returns>
        public async Task<GravityPlayerDetails> GetPlayerDetailsByTurn10IdAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id({t10Id})/details");

            return await ServiceClient.SendRequestAsync<GravityPlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        public async Task<GravityPlayerInventory> GetPlayerInventoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        public async Task<GravityPlayerInventory> GetPlayerInventoryAsync(ulong xuid, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/profileId({profileId})/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        public async Task<GravityPlayerInventory> GetPlayerInventoryAsync(string t10Id)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id({t10Id})/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        public async Task<GravityPlayerInventory> GetPlayerInventoryAsync(string t10Id, string profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id({t10Id})/profileId({profileId})/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Create or replace player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        public async Task<GravityPlayerInventory> CreateOrReplacePlayerInventoryByXuidAsync(GravityPlayerInventory playerInventory, Dictionary<string, string> headersToSend)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));

            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Put, path, this.authKey, Version, playerInventory, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Create or replace player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="headersToValidate">The headers to validate.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="ResponseWithHeaders{SunrisePlayerInventory}"/>.
        /// </returns>
        public async Task<ResponseWithHeaders<GravityPlayerInventory>> CreateOrReplacePlayerInventoryByXuidWithHeaderResponseAsync(GravityPlayerInventory playerInventory, IList<string> headersToValidate, Dictionary<string, string> headersToSend)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));

            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid/inventory?useBackgroundProcessing=true");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<GravityPlayerInventory>(HttpMethod.Put, path, this.authKey, Version, headersToValidate, playerInventory, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Create or replace player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        public async Task<GravityPlayerInventory> CreateOrReplacePlayerInventoryByT10IdAsync(GravityPlayerInventory playerInventory, Dictionary<string, string> headersToSend)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));

            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Put, path, this.authKey, Version, playerInventory, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Create or replace player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="headersToValidate">The headers to validate.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="ResponseWithHeaders{SunrisePlayerInventory}"/>.
        /// </returns>
        public async Task<ResponseWithHeaders<GravityPlayerInventory>> CreateOrReplacePlayerInventoryByT10IdWithHeaderResponseAsync(GravityPlayerInventory playerInventory, IList<string> headersToValidate, Dictionary<string, string> headersToSend)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));

            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id/inventory?useBackgroundProcessing=true");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<GravityPlayerInventory>(HttpMethod.Put, path, this.authKey, Version, headersToValidate, playerInventory, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Update player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        public async Task<GravityPlayerInventory> UpdatePlayerInventoryByXuidAsync(GravityPlayerInventory playerInventory, Dictionary<string, string> headersToSend)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));

            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Post, path, this.authKey, Version, playerInventory, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Updates player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="headersToValidate">The headers to validate.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="ResponseWithHeaders{SunrisePlayerInventory}"/>.
        /// </returns>
        public async Task<ResponseWithHeaders<GravityPlayerInventory>> UpdatePlayerInventoryByXuidWithHeaderResponseAsync(GravityPlayerInventory playerInventory, IList<string> headersToValidate, Dictionary<string, string> headersToSend)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));

            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid/inventory?useBackgroundProcessing=true");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<GravityPlayerInventory>(HttpMethod.Post, path, this.authKey, Version, headersToValidate, playerInventory, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Update player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        public async Task<GravityPlayerInventory> UpdatePlayerInventoryByT10IdAsync(GravityPlayerInventory playerInventory, Dictionary<string, string> headersToSend)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));

            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Post, path, this.authKey, Version, playerInventory, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Updates player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="headersToValidate">The headers to validate.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="ResponseWithHeaders{SunrisePlayerInventory}"/>.
        /// </returns>
        public async Task<ResponseWithHeaders<GravityPlayerInventory>> UpdatePlayerInventoryByT10IdWithHeaderResponseAsync(GravityPlayerInventory playerInventory, IList<string> headersToValidate, Dictionary<string, string> headersToSend)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));

            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id/inventory?useBackgroundProcessing=true");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<GravityPlayerInventory>(HttpMethod.Post, path, this.authKey, Version, headersToValidate, playerInventory, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Resets player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        public async Task<GravityPlayerInventory> ResetPlayerInventoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Delete, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Resets player inventory.
        /// </summary>
        /// <param name="t10Id">The Turn 10 ID.</param>
        /// <returns>
        ///     The <see cref="GravityPlayerInventory"/>.
        /// </returns>
        public async Task<GravityPlayerInventory> ResetPlayerInventoryAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var path = new Uri(this.baseUri, $"{TitlePath}player/t10Id({t10Id})/inventory");

            return await ServiceClient.SendRequestAsync<GravityPlayerInventory>(HttpMethod.Delete, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Get game settings.
        /// </summary>
        /// <param name="gameSettingsId">The game settings ID.</param>
        /// <returns>
        ///     The <see cref="GameSettings"/>.
        /// </returns>
        public async Task<GameSettings> GetGameSettingsAsync(string gameSettingsId)
        {
            gameSettingsId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gameSettingsId));

            var path = new Uri(this.baseUri, $"{TitlePath}data/gameSettingsId({gameSettingsId})");

            return await ServiceClient.SendRequestAsync<GameSettings>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets gift histories.
        /// </summary>
        /// <param name="giftHistoryAntecedent">The gift history antecedent.</param>
        /// <param name="giftRecipientId">The gift recipient ID.</param>
        /// <returns>
        ///     The list of <see cref="GiftHistory"/>.
        /// </returns>
        public async Task<IList<GravityGiftHistory>> GetGiftHistoriesAsync(GiftHistoryAntecedent giftHistoryAntecedent, string giftRecipientId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}giftHistory/giftRecipientId({giftRecipientId})/giftHistoryAntecedent({giftHistoryAntecedent})");

            return await ServiceClient.SendRequestAsync<IList<GravityGiftHistory>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets job status.
        /// </summary>
        /// <param name="jobId">The job ID.</param>
        /// <returns>
        ///     The <see cref="BackgroundJob"/>.
        /// </returns>
        public async Task<BackgroundJob> GetJobStatusAsync(string jobId)
        {
            jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));

            var path = new Uri(this.baseUri, $"Jobs/{jobId}");

            return await ServiceClient.SendRequestAsync<BackgroundJob>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }
    }
}
