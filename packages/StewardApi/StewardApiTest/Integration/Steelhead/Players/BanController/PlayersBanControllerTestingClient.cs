using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;
using Turn10.Services.LiveOps.FH5_main.Generated;
using Xls.Security.FM8.Generated;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class PlayersBanControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public PlayersBanControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<BanReasonGroup<FeatureAreas>>> GetBanReasonGroups()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/players/ban/banReasonGroups");

            return await ServiceClient.SendRequestAsync<IList<BanReasonGroup<FeatureAreas>>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<BanConfiguration>> GetBanConfigurations()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/players/ban/banConfigurations");

            return await ServiceClient.SendRequestAsync<IList<BanConfiguration>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<BanConfiguration>> BanPlayers(IList<V2BanParametersInput> banInput)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/players/ban?useBackgroundProcessing=false");

            return await ServiceClient.SendRequestAsync<IList<BanConfiguration>>(HttpMethod.Post, path, this.authKey, Version, banInput, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<BanConfiguration>> BanPlayersBackground(IList<V2BanParametersInput> banInput)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/players/ban?useBackgroundProcessing=true");

            return await ServiceClient.SendRequestAsync<IList<BanConfiguration>>(HttpMethod.Post, path, this.authKey, Version, banInput, headers: this.headers).ConfigureAwait(false);
        }
    }
}
