using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class VisibilityControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public VisibilityControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<Guid>> MakeUgcPrivate(string[] ugcIds)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/visibility/private?useBackgroundProcessing=false");

            return await ServiceClient.SendRequestAsync<IList<Guid>>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<Guid>> MakeUgcPrivateBackground(string[] ugcIds)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/visibility/private?useBackgroundProcessing=true");

            return await ServiceClient.SendRequestAsync<IList<Guid>>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<Guid>> MakeUgcPublic(string[] ugcIds)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/visibility/public?useBackgroundProcessing=false");

            return await ServiceClient.SendRequestAsync<IList<Guid>>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<Guid>> MakeUgcPublicBackground(string[] ugcIds)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/visibility/public?useBackgroundProcessing=true");

            return await ServiceClient.SendRequestAsync<IList<Guid>>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
