﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class LspTaskControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public LspTaskControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IEnumerable<LspTask>> GetLspTaskList()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/lsp-task");

            return await ServiceClient.SendRequestAsync<IEnumerable<LspTask>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task SetLspTask()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/lsp-task/update-single");

            await ServiceClient.SendRequestAsync<object>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
