using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Microsoft.AspNetCore.Mvc;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class UserGroupControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public UserGroupControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<LspGroup>> GetUserGroups()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/usergroup");

            return await ServiceClient.SendRequestAsync<IList<LspGroup>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<bool> GetUserIsInGroup(ulong groupId, ulong xuid)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/usergroup/{groupId}/membership/{xuid}");

            return await ServiceClient.SendRequestAsync<bool>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<UserGroupBulkOperationStatusOutput> GetBulkOperationStatus(ulong groupId, ulong opId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/usergroup/{groupId}/bulkOperationStatus/{opId}");

            return await ServiceClient.SendRequestAsync<UserGroupBulkOperationStatusOutput>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<GetUserGroupUsersResponse> GetUsersInGroup(ulong groupId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/usergroup/{groupId}");

            return await ServiceClient.SendRequestAsync<GetUserGroupUsersResponse>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<LspGroup> PostCreateUserGroup(string groupName)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/usergroup/{groupName}");

            return await ServiceClient.SendRequestAsync<LspGroup>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<BasicPlayer>> PostAddUsersToGroup(ulong groupId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/usergroup/{groupId}/add");

            return await ServiceClient.SendRequestAsync<IList<BasicPlayer>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<BasicPlayer>> PostRemoveUsersFromGroup(ulong groupId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/usergroup/{groupId}/remove");

            return await ServiceClient.SendRequestAsync<IList<BasicPlayer>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<OkResult> PostRemoveAllUsersFromGroup(ulong groupId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/usergroup/{groupId}/removeAllUsers");

            return await ServiceClient.SendRequestAsync<OkResult>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
