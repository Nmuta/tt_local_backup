using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Microsoft.AspNetCore.Mvc;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class PlayerMessagesControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public PlayerMessagesControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<Notification>> GetPlayerMessages(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/messages");

            return await ServiceClient.SendRequestAsync<IList<Notification>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<OkResult> DeletePlayerMessages(ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/messages");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Delete, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<Notification> GetPlayerMessage(ulong xuid, string messageId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/messages/{messageId}");

            return await ServiceClient.SendRequestAsync<Notification>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<OkResult> PostEditPlayerMessage(ulong xuid, string messageId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/messages/{messageId}");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<OkResult> DeletePlayerMessage(ulong xuid, string messageId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/player/{xuid}/messages/{messageId}");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Delete, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
