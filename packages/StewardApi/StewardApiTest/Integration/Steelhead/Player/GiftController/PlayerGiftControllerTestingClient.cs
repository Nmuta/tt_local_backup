using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Antlr4.Runtime.Atn;
using Microsoft.AspNetCore.Mvc;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class PlayerGiftControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public PlayerGiftControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<BackgroundJobInternal> UpdateGroupInventoriesUseBackgroundProcessing(SteelheadGroupGift groupGift)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/players/gift/useBackgroundProcessing");

         return await ServiceClient.SendRequestAsync<BackgroundJobInternal>(HttpMethod.Post, path, this.authKey, Version, groupGift, headers: this.headers).ConfigureAwait(false);
    }

        public async Task<BackgroundJobInternal> GiftLiveryToPlayersUseBackgroundProcessing(BulkLiveryGift<LocalizedMessageExpirableGroupGift> gift)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/players/gift/useBackgroundProcessing");

            return await ServiceClient.SendRequestAsync<BackgroundJobInternal>(HttpMethod.Post, path, this.authKey, Version, gift, headers: this.headers).ConfigureAwait(false);
        }
    }
}
