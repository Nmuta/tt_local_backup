﻿using System;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Microsoft.AspNetCore.Mvc;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class FeaturedStatusControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public FeaturedStatusControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<GenerateSharecodeResponse> SetUgcFeaturedStatus(string ugcId, [FromBody] UgcFeaturedStatus status)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/{ugcId}/featuredStatus");

            return await ServiceClient.SendRequestAsync<GenerateSharecodeResponse>(
                HttpMethod.Post,
                path,
                this.authKey,
                Version,
                status,
                headers: this.headers
            ).ConfigureAwait(false);
        }
    }
}
