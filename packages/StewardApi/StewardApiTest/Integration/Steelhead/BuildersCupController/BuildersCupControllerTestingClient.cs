using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.BuildersCup;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class BuildersCupControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public BuildersCupControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<BuildersCupFeaturedTour> GetCmsBuildersCupSchedule()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/buildersCup/schedule");

            return await ServiceClient.SendRequestAsync<BuildersCupFeaturedTour>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<Dictionary<Guid, string>> GetBuildersCupChampionships()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/buildersCup/championships");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<Dictionary<Guid, string>> GetBuildersCupLadders()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/buildersCup/ladders");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<Dictionary<Guid, string>> GetBuildersCupSeries()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/buildersCup/series");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
