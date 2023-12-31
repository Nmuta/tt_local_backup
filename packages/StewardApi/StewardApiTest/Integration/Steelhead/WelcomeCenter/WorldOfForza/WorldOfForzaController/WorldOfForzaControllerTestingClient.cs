﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Output;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class WorldOfForzaControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public WorldOfForzaControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<Dictionary<Guid, string>> GetDisplayConditions()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/welcomeCenter/worldofforza/displayconditions");

            return await ServiceClient.SendRequestAsync<Dictionary<Guid, string>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
