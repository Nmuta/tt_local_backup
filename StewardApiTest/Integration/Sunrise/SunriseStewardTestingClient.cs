using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Sunrise
{
    /// <summary>
    ///     Sunrise test client for sending requests to Steward.
    /// </summary>
    public sealed class SunriseStewardTestingClient
    {
        private const string Version = "1";
        private const string TitlePath = "api/v1/title/sunrise/";

        private readonly Uri baseUri;
        private readonly string authKey;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseStewardTestingClient"/> class.
        /// </summary>
        /// <param name="baseUri">The base URI.</param>
        /// <param name="authKey">The auth key.</param>
        public SunriseStewardTestingClient(Uri baseUri, string authKey)
        {
            baseUri.ShouldNotBeNull(nameof(baseUri));
            authKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(authKey));

            this.baseUri = baseUri;
            this.authKey = authKey;
        }

        private static ServiceClient ServiceClient => new ServiceClient(60, 60);

        /// <summary>
        ///     Gets player details.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerDetails"/>.
        /// </returns>
        public async Task<SunrisePlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var path = new Uri(this.baseUri, $"{TitlePath}player/gamertag({gamertag})/details");

            return await ServiceClient.SendRequestAsync<SunrisePlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets player details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerDetails"/>.
        /// </returns>
        public async Task<SunrisePlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/details");

            return await ServiceClient.SendRequestAsync<SunrisePlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Get consoles.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="SunriseConsoleDetails"/>.
        /// </returns>
        public async Task<IList<SunriseConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/consoleDetails?maxResults={maxResults}");

            return await ServiceClient.SendRequestAsync<List<SunriseConsoleDetails>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="SunriseSharedConsoleUser"/>.
        /// </returns>
        public async Task<IList<SunriseSharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/sharedConsoleUsers?startIndex={startIndex}&maxResults={maxResults}");

            return await ServiceClient.SendRequestAsync<List<SunriseSharedConsoleUser>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets user flags.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunriseUserFlags"/>.
        /// </returns>
        public async Task<SunriseUserFlags> GetUserFlagsAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/userFlags");

            return await ServiceClient.SendRequestAsync<SunriseUserFlags>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Sets user flags.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="userFlags">The user flags.</param>
        /// <returns>
        ///     The <see cref="SunriseUserFlags"/>.
        /// </returns>
        public async Task<SunriseUserFlags> SetUserFlagsAsync(ulong xuid, SunriseUserFlags userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));

            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/userFlags");

            return await ServiceClient.SendRequestAsync<SunriseUserFlags>(HttpMethod.Put, path, this.authKey, Version, userFlags).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets profile summary.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunriseProfileSummary"/>.
        /// </returns>
        public async Task<SunriseProfileSummary> GetProfileSummaryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/profileSummary");

            return await ServiceClient.SendRequestAsync<SunriseProfileSummary>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets credit updates.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <param name="startIndex">The start index.</param>
        /// <param name="maxResults">The max results.</param>
        /// <returns>
        ///     The list of <see cref="SunriseCreditUpdate"/>.
        /// </returns>
        public async Task<IList<SunriseCreditUpdate>> GetCreditUpdatesAsync(ulong xuid, int startIndex, int maxResults)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/creditUpdates?startIndex={startIndex}&maxResults={maxResults}");

            return await ServiceClient.SendRequestAsync<List<SunriseCreditUpdate>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        /// <param name="banParameters">The ban parameters.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The list of <see cref="SunriseBanResult"/>.
        /// </returns>
        public async Task<IList<SunriseBanResult>> BanPlayersAsync(SunriseBanParameters banParameters, Dictionary<string, string> headersToSend)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));

            var path = new Uri(this.baseUri, $"{TitlePath}players/ban");

            return await ServiceClient.SendRequestAsync<IList<SunriseBanResult>>(HttpMethod.Post, path, this.authKey, Version, banParameters, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Bans players with header response.
        /// </summary>
        /// <param name="banParameters">The ban parameters.</param>
        /// <param name="headersToValidate">The headers to validate.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The list of <see cref="SunriseBanResult"/> with response headers.
        /// </returns>
        public async Task<ResponseWithHeaders<IList<SunriseBanResult>>> BanPlayersWithHeaderResponseAsync(SunriseBanParameters banParameters, IList<string> headersToValidate, Dictionary<string, string> headersToSend)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));

            var path = new Uri(this.baseUri, $"{TitlePath}players/ban?useBackgroundProcessing=true");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<IList<SunriseBanResult>>(HttpMethod.Post, path, this.authKey, Version, headersToValidate, banParameters, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        /// <param name="xuids">The xuids.</param>
        /// <returns>
        ///     The list of <see cref="SunriseBanSummary"/>.
        /// </returns>
        public async Task<IList<SunriseBanSummary>> GetBanSummariesAsync(IList<ulong> xuids)
        {
            xuids.ShouldNotBeNull(nameof(xuids));

            var path = new Uri(this.baseUri, $"{TitlePath}players/banSummaries");

            return await ServiceClient.SendRequestAsync<IList<SunriseBanSummary>>(HttpMethod.Post, path, this.authKey, Version, xuids).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunriseBanHistory"/>.
        /// </returns>
        public async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/banHistory");

            return await ServiceClient.SendRequestAsync<IList<LiveOpsBanHistory>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="SunriseBanHistory"/>.
        /// </returns>
        public async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(string gamertag)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/gamertag({gamertag})/banHistory");

            return await ServiceClient.SendRequestAsync<IList<LiveOpsBanHistory>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Sets console ban status.
        /// </summary>
        /// <param name="consoleId">The console ID.</param>
        /// <param name="isBanned">A value that indicates whether the console is banned.</param>
        /// <returns>
        ///     A task with a status.
        /// </returns>
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}console/consoleId({consoleId})/consoleBanStatus/isBanned({isBanned})");

            await ServiceClient.SendRequestAsync(HttpMethod.Put, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        public async Task<SunrisePlayerInventory> GetPlayerInventoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventory");

            return await ServiceClient.SendRequestAsync<SunrisePlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets player inventory.
        /// </summary>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        public async Task<SunrisePlayerInventory> GetPlayerInventoryAsync(int profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/profileId({profileId})/inventory");

            return await ServiceClient.SendRequestAsync<SunrisePlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets inventory profiles.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The list of <see cref="SunriseInventoryProfile"/>.
        /// </returns>
        public async Task<IList<SunriseInventoryProfile>> GetInventoryProfilesAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventoryProfiles");

            return await ServiceClient.SendRequestAsync<IList<SunriseInventoryProfile>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets groups.
        /// </summary>
        /// <returns>
        ///     The list of <see cref="SunriseLspGroup"/>.
        /// </returns>
        public async Task<IList<SunriseLspGroup>> GetGroupsAsync()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}groups");

            return await ServiceClient.SendRequestAsync<IList<SunriseLspGroup>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        /// <summary>
        ///     Updates player inventory.
        /// </summary>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        public async Task<SunrisePlayerInventory> UpdatePlayerInventoryAsync(SunrisePlayerInventory playerInventory, Dictionary<string, string> headersToSend)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid/inventory");

            return await ServiceClient.SendRequestAsync<SunrisePlayerInventory>(HttpMethod.Post, path, this.authKey, Version, playerInventory, headersToSend).ConfigureAwait(false);
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
        public async Task<ResponseWithHeaders<SunrisePlayerInventory>> UpdatePlayerInventoryWithHeaderResponseAsync(SunrisePlayerInventory playerInventory, IList<string> headersToValidate, Dictionary<string, string> headersToSend)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));

            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid/inventory?useBackgroundProcessing=true");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<SunrisePlayerInventory>(HttpMethod.Post, path, this.authKey, Version, headersToValidate, playerInventory, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Update group inventories.
        /// </summary>
        /// <param name="groupGift">The group gift.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        public async Task<SunrisePlayerInventory> UpdateGroupInventoriesByXuidAsync(SunriseGroupGift groupGift, Dictionary<string, string> headersToSend)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}group/xuids/inventory");

            return await ServiceClient.SendRequestAsync<SunrisePlayerInventory>(HttpMethod.Post, path, this.authKey, Version, groupGift, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Update group inventories.
        /// </summary>
        /// <param name="groupGift">The group gift.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        public async Task<SunrisePlayerInventory> UpdateGroupInventoriesByGamertagAsync(SunriseGroupGift groupGift, Dictionary<string, string> headersToSend)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}group/gamertags/inventory");

            return await ServiceClient.SendRequestAsync<SunrisePlayerInventory>(HttpMethod.Post, path, this.authKey, Version, groupGift, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Update group inventories.
        /// </summary>
        /// <param name="groupId">The group ID.</param>
        /// <param name="playerInventory">The player inventory.</param>
        /// <param name="headersToSend">The headers to send.</param>
        /// <returns>
        ///     The <see cref="SunrisePlayerInventory"/>.
        /// </returns>
        public async Task<SunrisePlayerInventory> UpdateGroupInventoriesByLspGroupId(int groupId, SunrisePlayerInventory playerInventory, Dictionary<string, string> headersToSend)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}group/groupId({groupId})/inventory");

            return await ServiceClient.SendRequestAsync<SunrisePlayerInventory>(HttpMethod.Post, path, this.authKey, Version, playerInventory, headersToSend).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets gift histories.
        /// </summary>
        /// <param name="giftHistoryAntecedent">The gift history antecedent.</param>
        /// <param name="giftRecipientId">The gift recipient ID.</param>
        /// <returns>
        ///     The list of <see cref="SunriseGiftHistory"/>.
        /// </returns>
        public async Task<IList<SunriseGiftHistory>> GetGiftHistoriesAsync(GiftHistoryAntecedent giftHistoryAntecedent, string giftRecipientId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}giftHistory/giftRecipientId({giftRecipientId})/giftHistoryAntecedent({giftHistoryAntecedent})");

            return await ServiceClient.SendRequestAsync<IList<SunriseGiftHistory>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
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
