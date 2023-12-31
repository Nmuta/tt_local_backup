﻿using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Apollo
{
    public sealed class ApolloStewardTestingClient
    {
        private const string Version = "1";
        private const string TitlePath = "api/v1/title/apollo/";

        private readonly Uri baseUri;
        private readonly string authKey;
        private readonly Dictionary<string, string> headers;

        public ApolloStewardTestingClient(Uri baseUri, string authKey)
        {
            baseUri.ShouldNotBeNull(nameof(baseUri));
            authKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(authKey));

            this.baseUri = baseUri;
            this.authKey = authKey;
            this.headers = new Dictionary<string, string>()
            {
                { "endpointKey", ApolloEndpoint.V1Default }
            };
        }

        private static ServiceClient ServiceClient => new ServiceClient(60, 60);

        public async Task<IList<IdentityResultAlpha>> GetPlayerIdentitiesAsync(IList<IdentityQueryAlpha> query)
        {
            query.ShouldNotBeNull(nameof(query));

            var path = new Uri(this.baseUri, $"{TitlePath}players/identities");

            return await ServiceClient.SendRequestAsync<IList<IdentityResultAlpha>>(HttpMethod.Post, path, this.authKey, Version, query, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<ApolloPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var path = new Uri(this.baseUri, $"{TitlePath}player/gamertag({gamertag})/details");

            return await ServiceClient.SendRequestAsync<ApolloPlayerDetails>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<ApolloPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/details");

            return await ServiceClient.SendRequestAsync<ApolloPlayerDetails>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<BanResult>> BanPlayersAsync(IList<ApolloBanParametersInput> banParameters)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));

            var path = new Uri(this.baseUri, $"{TitlePath}players/ban");

            return await ServiceClient.SendRequestAsync<IList<BanResult>>(HttpMethod.Post, path, this.authKey, Version, banParameters, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<ResponseWithHeaders<BackgroundJobInternal>> BanPlayersWithHeaderResponseAsync(IList<ApolloBanParametersInput> banParameters, IList<string> headersToValidate)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));

            var path = new Uri(this.baseUri, $"{TitlePath}players/ban/useBackgroundProcessing");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<BackgroundJobInternal>(HttpMethod.Post, path, this.authKey, Version, headersToValidate, banParameters, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<BanSummary>> GetBanSummariesAsync(IList<ulong> xuids)
        {
            xuids.ShouldNotBeNull(nameof(xuids));

            var path = new Uri(this.baseUri, $"{TitlePath}players/banSummaries");

            return await ServiceClient.SendRequestAsync<IList<BanSummary>>(HttpMethod.Post, path, this.authKey, Version, xuids, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/banHistory");

            return await ServiceClient.SendRequestAsync<IList<LiveOpsBanHistory>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(string gamertag)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/gamertag({gamertag})/banHistory");

            return await ServiceClient.SendRequestAsync<IList<LiveOpsBanHistory>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<ConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/consoleDetails?maxResults={maxResults}");

            return await ServiceClient.SendRequestAsync<List<ConsoleDetails>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}console/consoleId({consoleId})/consoleBanStatus/isBanned({isBanned})");

            await ServiceClient.SendRequestAsync(HttpMethod.Put, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<SharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/sharedConsoleUsers?startIndex={startIndex}&maxResults={maxResults}");

            return await ServiceClient.SendRequestAsync<List<SharedConsoleUser>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<ApolloUserFlags> GetUserFlagsAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/userFlags");

            return await ServiceClient.SendRequestAsync<ApolloUserFlags>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<ApolloUserFlags> SetUserFlagsAsync(ulong xuid, ApolloUserFlagsInput userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));

            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/userFlags");

            return await ServiceClient.SendRequestAsync<ApolloUserFlags>(HttpMethod.Put, path, this.authKey, Version, userFlags, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<ApolloMasterInventory> GetPlayerInventoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventory");

            return await ServiceClient.SendRequestAsync<ApolloMasterInventory>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<ApolloMasterInventory> GetPlayerInventoryAsync(int profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/profileId({profileId})/inventory");

            return await ServiceClient.SendRequestAsync<ApolloMasterInventory>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<ApolloInventoryProfile>> GetInventoryProfilesAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventoryProfiles");

            return await ServiceClient.SendRequestAsync<IList<ApolloInventoryProfile>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<LspGroup>> GetGroupsAsync()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}groups");

            return await ServiceClient.SendRequestAsync<IList<LspGroup>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<ResponseWithHeaders<BackgroundJobInternal>> UpdatePlayerInventoriesWithHeaderResponseAsync(ApolloGroupGift groupGift, IList<string> headersToValidate)
        {
            groupGift.ShouldNotBeNull(nameof(groupGift));

            var path = new Uri(this.baseUri, $"{TitlePath}gifting/players/useBackgroundProcessing");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<BackgroundJobInternal>(HttpMethod.Post, path, this.authKey, Version, headersToValidate, groupGift, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(ApolloGroupGift groupGift)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}gifting/players");

            return await ServiceClient.SendRequestAsync<IList<GiftResponse<ulong>>>(HttpMethod.Post, path, this.authKey, Version, groupGift, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<GiftResponse<int>> UpdateGroupInventoriesByLspGroupId(int groupId, ApolloGift gift)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}gifting/groupId({groupId})");

            return await ServiceClient.SendRequestAsync<GiftResponse<int>>(HttpMethod.Post, path, this.authKey, Version, gift, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<ApolloGiftHistory>> GetGiftHistoriesAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/giftHistory");

            return await ServiceClient.SendRequestAsync<IList<ApolloGiftHistory>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<ApolloGiftHistory>> GetGiftHistoriesAsync(int groupId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}group/groupId({groupId})/giftHistory");

            return await ServiceClient.SendRequestAsync<IList<ApolloGiftHistory>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<BackgroundJob> GetJobStatusAsync(string jobId)
        {
            jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));

            var path = new Uri(this.baseUri, $"api/v1/jobs/jobId({jobId})");

            return await ServiceClient.SendRequestAsync<BackgroundJob>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
