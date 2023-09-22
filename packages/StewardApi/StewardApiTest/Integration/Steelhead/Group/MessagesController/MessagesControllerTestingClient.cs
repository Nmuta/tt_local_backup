using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Microsoft.AspNetCore.Mvc;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class MessagesControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public MessagesControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<UserGroupNotification>> GetUserGroupMessages(ulong groupId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/group/{groupId}/messages");

            return await ServiceClient.SendRequestAsync<IList<UserGroupNotification>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<MessageSendResult<int>> PostUserGroupMessage(ulong groupId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/group/{groupId}/messages");

            return await ServiceClient.SendRequestAsync<MessageSendResult<int>>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<OkResult> PostEditUserGroupMessage(ulong groupId, ulong messageId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/group/{groupId}/messages/{messageId}");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<OkResult> DeleteUserGroupMessage(ulong groupId, ulong messageId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/group/{groupId}/messages/{messageId}");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Delete, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
