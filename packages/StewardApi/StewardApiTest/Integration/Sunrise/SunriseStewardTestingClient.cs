using Kusto.Cloud.Platform.Utils;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Sunrise
{
    public sealed class SunriseStewardTestingClient
    {
        private const string Version = "1";
        private const string TitlePath = "api/v1/title/sunrise/";
        private const string V2TitlePath = "api/v2/title/sunrise/";

        private readonly Uri baseUri;
        private readonly string authKey;
        private readonly Dictionary<string, string> headers;

        public SunriseStewardTestingClient(Uri baseUri, string authKey)
        {
            baseUri.ShouldNotBeNull(nameof(baseUri));
            authKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(authKey));

            this.baseUri = baseUri;
            this.authKey = authKey;
            this.headers = new Dictionary<string, string>()
            {
                { "endpointKey", SunriseEndpoint.V1Default }
            };
        }

        private static ServiceClient ServiceClient => new ServiceClient(60, 60);

        public async Task<IList<IdentityResultAlpha>> GetPlayerIdentitiesAsync(IList<IdentityQueryAlpha> query)
        {
            query.ShouldNotBeNull(nameof(query));

            var path = new Uri(this.baseUri, $"{TitlePath}players/identities");

            return await ServiceClient.SendRequestAsync<IList<IdentityResultAlpha>>(HttpMethod.Post, path, this.authKey, Version, query, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SunrisePlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var path = new Uri(this.baseUri, $"{TitlePath}player/gamertag({gamertag})/details");

            return await ServiceClient.SendRequestAsync<SunrisePlayerDetails>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SunrisePlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/details");

            return await ServiceClient.SendRequestAsync<SunrisePlayerDetails>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<ConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/consoleDetails?maxResults={maxResults}");

            return await ServiceClient.SendRequestAsync<List<ConsoleDetails>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<SharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/sharedConsoleUsers?startIndex={startIndex}&maxResults={maxResults}");

            return await ServiceClient.SendRequestAsync<List<SharedConsoleUser>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SunriseUserFlags> GetUserFlagsAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/userFlags");

            return await ServiceClient.SendRequestAsync<SunriseUserFlags>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SunriseUserFlags> SetUserFlagsAsync(ulong xuid, SunriseUserFlagsInput userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));

            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/userFlags");

            return await ServiceClient.SendRequestAsync<SunriseUserFlags>(HttpMethod.Put, path, this.authKey, Version, userFlags, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<ProfileSummary> GetProfileSummaryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/profileSummary");

            return await ServiceClient.SendRequestAsync<ProfileSummary>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<CreditUpdate>> GetCreditUpdatesAsync(ulong xuid, int startIndex, int maxResults)
        {
            var path = new Uri(this.baseUri, $"{V2TitlePath}player/{xuid}/creditUpdates?startIndex={startIndex}&maxResults={maxResults}");

            return await ServiceClient.SendRequestAsync<List<CreditUpdate>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<BackstagePassUpdate>> GetBackstagePassUpdatesAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/backstagePassUpdates");

            return await ServiceClient.SendRequestAsync<List<BackstagePassUpdate>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<BanResult>> BanPlayersAsync(IList<SunriseBanParametersInput> banParameters)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));

            var path = new Uri(this.baseUri, $"{TitlePath}players/ban");

            return await ServiceClient.SendRequestAsync<IList<BanResult>>(HttpMethod.Post, path, this.authKey, Version, banParameters, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<ResponseWithHeaders<BackgroundJob>> BanPlayersWithHeaderResponseAsync(IList<SunriseBanParametersInput> banParameters, IList<string> headersToValidate)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));

            var path = new Uri(this.baseUri, $"{TitlePath}players/ban/useBackgroundProcessing");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<BackgroundJob>(HttpMethod.Post, path, this.authKey, Version, headersToValidate, banParameters, headers: this.headers).ConfigureAwait(false);
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

        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}console/consoleId({consoleId})/consoleBanStatus/isBanned({isBanned})");

            await ServiceClient.SendRequestAsync(HttpMethod.Put, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SunriseMasterInventory> GetPlayerInventoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventory");

            return await ServiceClient.SendRequestAsync<SunriseMasterInventory>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SunriseMasterInventory> GetPlayerInventoryAsync(int profileId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/profileId({profileId})/inventory");

            return await ServiceClient.SendRequestAsync<SunriseMasterInventory>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<SunriseInventoryProfile>> GetInventoryProfilesAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/inventoryProfiles");

            return await ServiceClient.SendRequestAsync<IList<SunriseInventoryProfile>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SunriseAccountInventory> GetAccountInventoryAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/accountInventory");

            return await ServiceClient.SendRequestAsync<SunriseAccountInventory>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<LspGroup>> GetGroupsAsync()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}groups");

            return await ServiceClient.SendRequestAsync<IList<LspGroup>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<ResponseWithHeaders<BackgroundJobInternal>> UpdatePlayerInventoriesWithHeaderResponseAsync(SunriseGroupGift groupGift, IList<string> headersToValidate)
        {
            groupGift.ShouldNotBeNull(nameof(groupGift));

            var path = new Uri(this.baseUri, $"{TitlePath}gifting/players/useBackgroundProcessing");

            return await ServiceClient.SendRequestWithHeaderResponseAsync<BackgroundJobInternal>(HttpMethod.Post, path, this.authKey, Version, headersToValidate, groupGift, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesAsync(SunriseGroupGift groupGift)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}gifting/players");

            return await ServiceClient.SendRequestAsync<IList<GiftResponse<ulong>>>(HttpMethod.Post, path, this.authKey, Version, groupGift, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<GiftResponse<int>> GiftInventoryByLspGroupId(int groupId, SunriseGift gift)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}gifting/groupId({groupId})");

            return await ServiceClient.SendRequestAsync<GiftResponse<int>>(HttpMethod.Post, path, this.authKey, Version, gift, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<SunriseGiftHistory>> GetGiftHistoriesAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/giftHistory");

            return await ServiceClient.SendRequestAsync<IList<SunriseGiftHistory>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<SunriseGiftHistory>> GetGiftHistoriesAsync(int groupId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}group/groupId({groupId})/giftHistory");

            return await ServiceClient.SendRequestAsync<IList<SunriseGiftHistory>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<Notification>> GetNotificationsAsync(ulong xuid, int maxResults)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/notifications?maxResults={maxResults}");

            return await ServiceClient.SendRequestAsync<IList<Notification>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<MessageSendResult<ulong>>> SendNotificationsAsync(BulkCommunityMessage message)
        {
            message.ShouldNotBeNull(nameof(message));

            var path = new Uri(this.baseUri, $"{TitlePath}notifications/send");

            return await ServiceClient.SendRequestAsync<IList<MessageSendResult<ulong>>>(HttpMethod.Post, path, this.authKey, Version, message, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<MessageSendResult<int>> SendGroupNotificationsAsync(int groupId, LspGroupCommunityMessage message)
        {
            message.ShouldNotBeNull(nameof(message));

            var path = new Uri(this.baseUri, $"{TitlePath}notifications/send/groupId({groupId})");

            return await ServiceClient.SendRequestAsync<MessageSendResult<int>>(HttpMethod.Post, path, this.authKey, Version, message, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<ProfileNote>> GetProfileNotesAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{V2TitlePath}player/{xuid}/profileNotes");

            return await ServiceClient.SendRequestAsync<IList<ProfileNote>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }


        public async Task<IList<ProfileNote>> SendProfileNotesAsync(ulong xuid, ProfileNote message)
        {
            message.ShouldNotBeNull(nameof(message));

            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/profileNotes");

            return await ServiceClient.SendRequestAsync<IList<ProfileNote>>(HttpMethod.Post, path, this.authKey, Version, message, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<PlayerAuction>> GetPlayerAuctionsAsync(ulong xuid, short carId, short makeId, string status, string sort)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}player/xuid({xuid})/auctions?carId={carId}&makeId={makeId}&status={status}&sort={sort}");

            return await ServiceClient.SendRequestAsync<IList<PlayerAuction>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<AuctionBlockListEntry>> GetAuctionBlockListAsync()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}auctions/blocklist");

            return await ServiceClient.SendRequestAsync<IList<AuctionBlockListEntry>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task PostAuctionBlockListEntriesAsync(IList<AuctionBlockListEntry> entries)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}auctions/blocklist");

            await ServiceClient.SendRequestAsync(HttpMethod.Post, path, this.authKey, Version, entries, headers: this.headers).ConfigureAwait(false);
        }

        public async Task DeleteAuctionBlockListEntryAsync(int carId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}auctions/blocklist/carId({carId})");

            await ServiceClient.SendRequestAsync(HttpMethod.Delete, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<BackgroundJob> GetJobStatusAsync(string jobId)
        {
            jobId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(jobId));

            var path = new Uri(this.baseUri, $"api/v1/jobs/jobId({jobId})");

            return await ServiceClient.SendRequestAsync<BackgroundJob>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<UgcItem>> GetUGCItemsAsync(ulong xuid, string ugcType)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}storefront/xuid({xuid})?ugcType={ugcType}");

            return await ServiceClient.SendRequestAsync<IList<UgcItem>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<HideableUgc>> GetPlayerHiddenUGCAsync(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}storefront/xuid({xuid})/hidden");

            return await ServiceClient.SendRequestAsync<IList<HideableUgc>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task HideUGCAsync(Guid ugcId, bool useBackgroundJob)
        {
            var path = new Uri(this.baseUri, $"{V2TitlePath}ugc/hide?useBackgroundProcessing={useBackgroundJob.ToStringLowercase()}");

            await ServiceClient.SendRequestAsync(HttpMethod.Post, path, this.authKey, Version, new[] { ugcId }, headers: this.headers).ConfigureAwait(false);
        }

        public async Task UnhideUGCAsync(ulong xuid, string fileType, Guid ugcId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}storefront/{xuid}/ugc/{fileType}/{ugcId}/unhide");

            await ServiceClient.SendRequestAsync(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
