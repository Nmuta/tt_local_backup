using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Data
{
    public sealed class KustoStewardTestingClient
    {
        private const string Version = "1";
        private const string TitlePath = "api/v1/kusto/";

        private readonly Uri baseUri;
        private readonly string authKey;

        public KustoStewardTestingClient(Uri baseUri, string authKey)
        {
            baseUri.ShouldNotBeNull(nameof(baseUri));
            authKey.ShouldNotBeNullEmptyOrWhiteSpace(nameof(authKey));

            this.baseUri = baseUri;
            this.authKey = authKey;
        }

        private static ServiceClient ServiceClient => new ServiceClient(60, 60);

        public async Task<IList<JObject>> RunQueryAsync(string query)
        {
            query.ShouldNotBeNullEmptyOrWhiteSpace(nameof(query));

            var path = new Uri(this.baseUri, $"{TitlePath}query/run");

            return await ServiceClient.SendRequestAsync<IList<JObject>>(HttpMethod.Post, path, this.authKey, Version, query).ConfigureAwait(false);
        }

        public async Task<IList<JObject>> SaveQueryAsync(IList<KustoQuery> queries)
        {
            queries.ShouldNotBeNull(nameof(queries));

            var path = new Uri(this.baseUri, $"{TitlePath}queries");

            return await ServiceClient.SendRequestAsync<IList<JObject>>(HttpMethod.Post, path, this.authKey, Version, queries).ConfigureAwait(false);
        }

        public async Task<IList<KustoQuery>> RetrieveQueriesAsync()
        {
            var path = new Uri(this.baseUri, $"{TitlePath}queries");

            return await ServiceClient.SendRequestAsync<IList<KustoQuery>>(HttpMethod.Get, path, this.authKey, Version).ConfigureAwait(false);
        }

        public async Task DeleteQueriesAsync(string name)
        {
            name.ShouldNotBeNullEmptyOrWhiteSpace(nameof(name));

            var path = new Uri(this.baseUri, $"{TitlePath}queries/name({name})");

            await ServiceClient.SendRequestAsync(HttpMethod.Delete, path, this.authKey, Version).ConfigureAwait(false);
        }
    }
}
