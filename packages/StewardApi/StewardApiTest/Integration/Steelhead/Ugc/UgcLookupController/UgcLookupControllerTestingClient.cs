using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    public sealed class UgcLookupControllerTestingClient : SteelheadStewardBaseTestingClient
    {
        public UgcLookupControllerTestingClient(Uri baseUri, string authKey) : base(baseUri, authKey)
        {
            this.headers.Add("Endpoint-Steelhead", nameof(SteelheadEndpoint.Retail));
        }

        public async Task<IList<SteelheadUgcItem>> PostSearchUgc(string ugcType)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/lookup/{ugcType}");

            return await ServiceClient.SendRequestAsync<IList<SteelheadUgcItem>>(HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<SteelheadUgcItem>> GetSearchCuratedUgc(string ugcType, string curationType)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/lookup/{ugcType}/curated/{curationType}");

            return await ServiceClient.SendRequestAsync<IList<SteelheadUgcItem>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadUgcLiveryItem> GetLiveryUgc(string ugcId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/lookup/livery/{ugcId}");

            return await ServiceClient.SendRequestAsync<SteelheadUgcLiveryItem>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadUgcItem> GetPhotoUgc(string ugcId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/lookup/photo/{ugcId}");

            return await ServiceClient.SendRequestAsync<SteelheadUgcItem>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<List<ThumbnailLookupOutput>> PostPhotoThumbnail()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/lookup/photos/thumbnails");

            return await ServiceClient.SendRequestAsync<List<ThumbnailLookupOutput>> (HttpMethod.Post, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadUgcTuneBlobItem> GetTuneBlobUgc(string ugcId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/lookup/tuneblob/{ugcId}");

            return await ServiceClient.SendRequestAsync<SteelheadUgcTuneBlobItem>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadUgcItem> GetLayerGroupUgc(string ugcId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/lookup/layerGroup/{ugcId}");

            return await ServiceClient.SendRequestAsync<SteelheadUgcItem>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadUgcItem> GetGameOptionsUgc(string ugcId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/lookup/gameOptions/{ugcId}");

            return await ServiceClient.SendRequestAsync<SteelheadUgcItem>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<SteelheadUgcItem> GetReplayUgc(string ugcId)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/lookup/replay/{ugcId}");

            return await ServiceClient.SendRequestAsync<SteelheadUgcItem>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }

        public async Task<IList<SteelheadUgcItem>> GetSharecodeUgc(string shareCode, string ugcType)
        {
            var path = new Uri(this.baseUri, $"{TitlePath}/ugc/lookup/sharecode/{shareCode}?ugcType={ugcType}");

            return await ServiceClient.SendRequestAsync<IList<SteelheadUgcItem>>(HttpMethod.Get, path, this.authKey, Version, headers: this.headers).ConfigureAwait(false);
        }
    }
}
