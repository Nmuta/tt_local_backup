using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Apollo
{
    public sealed class ApolloStewardTestingClient
    {
        private const string Version = "1";
        private const string TitlePath = "api/v1/title/apollo/";

        private readonly Uri baseUri;
        private readonly string authKey;

        public ApolloStewardTestingClient(Uri baseUri, string authKey)
        {
            baseUri.ShouldNotBeNull(nameof(baseUri));
            authKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(authKey));

            this.baseUri = baseUri;
            this.authKey = authKey;
        }

        private static ServiceClient ServiceClient => new ServiceClient(60, 60);

        public async Task<ApolloPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var path = new Uri(this.baseUri, $"{TitlePath}player/gamertag({gamertag})/details");

            return await ServiceClient.SendRequestAsync<ApolloPlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<ApolloPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/details");

            return await ServiceClient.SendRequestAsync<ApolloPlayerDetails>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<IList<ApolloBanResult>> BanPlayersAsync(IList<ApolloBanParameters> banParameters, Dictionary<string, string> headersToSend)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));

            var path = new Uri(this.baseUri, $"{TitlePath}players/ban");

            return await ServiceClient.SendRequestAsync<IList<ApolloBanResult>>(HttpMethod.Post, path, this.authKey, Version, banParameters, headersToSend).ConfigureAwait(false);
        }

        public async Task<ResponseWithHeaders<IList<ApolloBanResult>>> BanPlayersWithHeaderResponseAsync(IList<ApolloBanParameters> banParameters, IList<string> headersToValidate, Dictionary<string, string> headersToSend)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));

            var path = new Uri(this.baseUri, $"{TitlePath}players/ban?useBackgroundProcessing=true");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<IList<ApolloBanResult>>(HttpMethod.Post, path, this.authKey, Version, headersToValidate, banParameters, headersToSend).ConfigureAwait(false);
        }

        public async Task<IList<ApolloBanSummary>> GetBanSummariesAsync(IList<ulong> xuids)
        {
            xuids.ShouldNotBeNull(nameof(xuids));

            var path = new Uri(this.baseUri, $"{TitlePath}players/banSummaries");

            return await ServiceClient.SendRequestAsync<IList<ApolloBanSummary>>(HttpMethod.Post, path, this.authKey, Version, xuids).ConfigureAwait(false);
        }

        public async Task<ApolloBanHistory> GetBanHistoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/banHistory");

            return await ServiceClient.SendRequestAsync<ApolloBanHistory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<ApolloBanHistory> GetBanHistoryAsync(string gamertag)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/gamertag({gamertag})/banHistory");

            return await ServiceClient.SendRequestAsync<ApolloBanHistory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<IList<ApolloConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/consoleDetails?maxResults={maxResults}");

            return await ServiceClient.SendRequestAsync<List<ApolloConsoleDetails>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}console/consoleId({consoleId})/consoleBanStatus/isBanned({isBanned})");

            await ServiceClient.SendRequestAsync(HttpMethod.Put, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<IList<ApolloSharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/sharedConsoleUsers?startIndex={startIndex}&maxResults={maxResults}");

            return await ServiceClient.SendRequestAsync<List<ApolloSharedConsoleUser>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<ApolloUserFlags> GetUserFlagsAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/userFlags");

            return await ServiceClient.SendRequestAsync<ApolloUserFlags>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<ApolloUserFlags> SetUserFlagsAsync(ulong xuid, ApolloUserFlags userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));

            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/userFlags");

            return await ServiceClient.SendRequestAsync<ApolloUserFlags>(HttpMethod.Put, path, this.authKey, Version, userFlags).ConfigureAwait(false);
        }

        public async Task<ApolloPlayerInventory> GetPlayerInventoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventory");

            return await ServiceClient.SendRequestAsync<ApolloPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<ApolloPlayerInventory> GetPlayerInventoryAsync(int profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/profileId({profileId})/inventory");

            return await ServiceClient.SendRequestAsync<ApolloPlayerInventory>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<IList<ApolloInventoryProfile>> GetInventoryProfilesAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventoryProfiles");

            return await ServiceClient.SendRequestAsync<IList<ApolloInventoryProfile>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<IList<ApolloLspGroup>> GetGroupsAsync()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}groups");

            return await ServiceClient.SendRequestAsync<IList<ApolloLspGroup>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<ApolloPlayerInventory> UpdatePlayerInventoryAsync(ApolloPlayerInventory playerInventory, Dictionary<string, string> headersToSend)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid/inventory");

            return await ServiceClient.SendRequestAsync<ApolloPlayerInventory>(HttpMethod.Post, path, this.authKey, Version, playerInventory, headersToSend).ConfigureAwait(false);
        }

        public async Task<ResponseWithHeaders<ApolloPlayerInventory>> UpdatePlayerInventoryWithHeaderResponseAsync(ApolloPlayerInventory playerInventory, IList<string> headersToValidate, Dictionary<string, string> headersToSend)
        {
            playerInventory.ShouldNotBeNull(nameof(playerInventory));

            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid/inventory?useBackgroundProcessing=true");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<ApolloPlayerInventory>(HttpMethod.Post, path, this.authKey, Version, headersToValidate, playerInventory, headersToSend).ConfigureAwait(false);
        }

        public async Task<ApolloPlayerInventory> UpdateGroupInventoriesByXuidAsync(ApolloGroupGift groupGift, Dictionary<string, string> headersToSend)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}group/xuids/inventory");

            return await ServiceClient.SendRequestAsync<ApolloPlayerInventory>(HttpMethod.Post, path, this.authKey, Version, groupGift, headersToSend).ConfigureAwait(false);
        }

        public async Task<ApolloPlayerInventory> UpdateGroupInventoriesByGamertagAsync(ApolloGroupGift groupGift, Dictionary<string, string> headersToSend)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}group/gamertags/inventory");

            return await ServiceClient.SendRequestAsync<ApolloPlayerInventory>(HttpMethod.Post, path, this.authKey, Version, groupGift, headersToSend).ConfigureAwait(false);
        }

        public async Task<ApolloPlayerInventory> UpdateGroupInventoriesByLspGroupId(int groupId, ApolloPlayerInventory playerInventory, Dictionary<string, string> headersToSend)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}group/groupId({groupId})/inventory");

            return await ServiceClient.SendRequestAsync<ApolloPlayerInventory>(HttpMethod.Post, path, this.authKey, Version, playerInventory, headersToSend).ConfigureAwait(false);
        }

        public async Task<IList<ApolloGiftHistory>> GetGiftHistoriesAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/giftHistory");

            return await ServiceClient.SendRequestAsync<IList<ApolloGiftHistory>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<IList<ApolloGiftHistory>> GetGiftHistoriesAsync(int groupId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}group/id({groupId})/giftHistory");

            return await ServiceClient.SendRequestAsync<IList<ApolloGiftHistory>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task<BackgroundJob> GetJobStatusAsync(string jobId)
        {
            jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));

            var path = new Uri(this.baseUri, $"Jobs/{jobId}");

            return await ServiceClient.SendRequestAsync<BackgroundJob>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }
    }
}
