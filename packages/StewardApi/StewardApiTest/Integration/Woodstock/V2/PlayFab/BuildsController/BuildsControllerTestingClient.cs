using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock.V2
{
    public sealed class BuildsControllerTestingClient : WoodstockStewardBaseTestingClient
    {
        public BuildsControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Woodstock", nameof(WoodstockEndpoint.Retail));
        }

        public async Task<IList<PlayFabBuildSummary>> GetPlayFabBuilds()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/playfab/builds");

            return await ServiceClient.SendRequestAsync<IList<PlayFabBuildSummary>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<PlayFabBuildSummary> GetPlayFabBuild(string buildId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/playfab/builds/{buildId}");

            return await ServiceClient.SendRequestAsync<PlayFabBuildSummary>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<PlayFabBuildLock>> GetPlayFabBuildLocks()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/playfab/builds/locks");

            return await ServiceClient.SendRequestAsync<IList<PlayFabBuildLock>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<PlayFabBuildLock> PostLockPlayFabBuild(string buildId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/playfab/builds/{buildId}/lock");

            return await ServiceClient.SendRequestAsync<PlayFabBuildLock>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<PlayFabBuildLock> DeleteLockedPlayFabBuild(string buildId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/playfab/builds/{buildId}/lock");

            return await ServiceClient.SendRequestAsync<PlayFabBuildLock>(HttpMethod.Delete, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
