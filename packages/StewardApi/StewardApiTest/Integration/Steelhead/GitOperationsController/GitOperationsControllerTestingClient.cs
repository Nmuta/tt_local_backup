using Microsoft.TeamFoundation.SourceControl.WebApi;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Git;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class GitOperationsControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public GitOperationsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<List<PullRequest>> GetPullRequests(PullRequestStatus status)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/gitops/pullrequest/{status}");

            return await ServiceClient.SendRequestAsync<List<PullRequest>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<List<GitRef>> GetAllBranches()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/gitops/refs");

            return await ServiceClient.SendRequestAsync<List<GitRef>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
