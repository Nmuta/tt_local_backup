using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardTest.Utilities.TestingClient
{
    /// <summary>
    ///     Represents a service client.
    /// </summary>
    public class ServiceClient
    {
        private const string VersionHeaderName = "X-Contract-Version";
        private const string AuthorizationHeaderName = "Authorization";
        private const string ContentType = "application/json";
        private const int DefaultHttpClientLifetimeSeconds = 60;
        private const int DefaultRequestTimeoutSeconds = 30;


        private readonly int httpClientLifetimeSeconds;
        private readonly int requestTimeoutSeconds;
        private readonly object lockObj = new object();
        private readonly Encoding encoding = Encoding.UTF8;

        private Lazy<HttpClient> client;
        private DateTime clientCreateTime = DateTime.MinValue;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ServiceClient"/> class.
        /// </summary>
        public ServiceClient(int httpClientLifetimeSeconds = DefaultHttpClientLifetimeSeconds, int requestTimeoutSeconds = DefaultRequestTimeoutSeconds)
        {
            this.httpClientLifetimeSeconds = httpClientLifetimeSeconds;

            this.requestTimeoutSeconds = requestTimeoutSeconds;
        }

        public async Task SendRequestAsync(
            HttpMethod method,
            Uri uri,
            string authToken,
            string contractVersion,
            object requestBody = null,
            IDictionary<string, string> headers = null)
        {
            uri.ShouldNotBeNull(nameof(uri));

            EnsureSecurityProtocolSet();
            using (var request = this.CreateRequestMessage(method, uri, authToken, contractVersion, requestBody, headers))
            {
                await this.SendRequestAsync(request).ConfigureAwait(false);
            }
        }

        public async Task<T> SendRequestAsync<T>(
            HttpMethod method,
            Uri uri,
            string authToken,
            string contractVersion,
            object requestBody = null,
            IDictionary<string, string> headers = null)
        {
            uri.ShouldNotBeNull(nameof(uri));

            EnsureSecurityProtocolSet();
            using (var request = this.CreateRequestMessage(method, uri, authToken, contractVersion, requestBody, headers))
            {
                return await this.SendRequestAsync<T>(request).ConfigureAwait(false);
            }
        }

        public async Task<ResponseWithHeaders<T>> SendRequestWithHeaderResponseAsync<T>(
            HttpMethod method,
            Uri uri,
            string authToken,
            string contractVersion,
            IList<string> headersToValidate,
            object requestBody = null,
            IDictionary<string, string> headers = null)
        {
            uri.ShouldNotBeNull(nameof(uri));

            EnsureSecurityProtocolSet();
            using (var request = this.CreateRequestMessage(method, uri, authToken, contractVersion, requestBody, headers))
            {
                return await this.SendWithHeaderResponseAsync<T>(request, headersToValidate).ConfigureAwait(false);
            }
        }

        /// <summary>
        ///     Creates the HttpClient to use.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Reliability", "CA2000:Dispose objects before losing scope")]
        private HttpClient CreateClient()
        {
            var handler = new HttpClientHandler { AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate };
            return new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(this.requestTimeoutSeconds) };
        }

        private async Task SendRequestAsync(HttpRequestMessage request)
        {
            using (var response = await this.GetClient().SendAsync(request).ConfigureAwait(false))
            {
                if (!response.IsSuccessStatusCode)
                {
                    throw new ServiceException(response.StatusCode, await this.GetResponseBodyAsync(response).ConfigureAwait(false));
                }
            }
        }

        private async Task<ResponseWithHeaders<T>> SendWithHeaderResponseAsync<T>(HttpRequestMessage request, IList<string> headersToValidate)
        {
            using (var response = await this.GetClient().SendAsync(request).ConfigureAwait(false))
            {
                var responseHeaders = new Dictionary<string, string>();

                foreach (var header in headersToValidate)
                {
                    response.Headers.TryGetValues(header, out var values);

                    responseHeaders[header] = values.First();
                }

                var responseBody = await this.ReadResponseBodyAsync<T>(response).ConfigureAwait(false);

                return new ResponseWithHeaders<T>
                {
                    ResponseBody = responseBody,
                    Headers = responseHeaders
                };
            }
        }

        private async Task<T> SendRequestAsync<T>(HttpRequestMessage request)
        {
            using (var response = await this.GetClient().SendAsync(request).ConfigureAwait(false))
            {
                return await this.ReadResponseBodyAsync<T>(response).ConfigureAwait(false);
            }
        }

        private async Task<T> ReadResponseBodyAsync<T>(HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
            {
                throw new ServiceException(
                    response.StatusCode,
                    await this.GetResponseBodyAsync(response).ConfigureAwait(false));
            }

            using (var stream = await response.Content.ReadAsStreamAsync().ConfigureAwait(false))
            {
                return this.Deserialize<T>(stream);
            }

        }

        private async Task<string> GetResponseBodyAsync(HttpResponseMessage response)
        {
            using (var stream = await response.Content.ReadAsStreamAsync().ConfigureAwait(false))
            {
                using (var streamReader = new StreamReader(stream))
                {
                    return await streamReader.ReadToEndAsync().ConfigureAwait(false);
                }
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Reliability", "CA2000:Dispose objects before losing scope")]
        private HttpRequestMessage CreateRequestMessage(HttpMethod method, Uri uri, string authToken, string contractVersion, object requestBody = null, IDictionary<string, string> headers = null)
        {
            var request = new HttpRequestMessage(method, uri);
            if (!string.IsNullOrEmpty(authToken))
            {
                request.Headers.TryAddWithoutValidation(AuthorizationHeaderName, authToken);
            }

            if (!string.IsNullOrEmpty(contractVersion))
            {
                request.Headers.Add(VersionHeaderName, contractVersion);
            }

            if (headers != null)
            {
                foreach (var (key, value) in headers)
                {
                    request.Headers.Add(key, value);
                }
            }

            if (requestBody == null) { return request; }

            var content = this.Serialize(requestBody);
            request.Content = new StringContent(content, this.encoding, ContentType);

            return request;
        }

        public static string CreateQueryString(IDictionary<string, string> queryParameters)
        {
            queryParameters.ShouldNotBeNull(nameof(queryParameters));

            return string.Join(
                "&",
                queryParameters.Select(p => $"{HttpUtility.UrlEncode(p.Key)}={HttpUtility.UrlEncode(p.Value)}"));
        }

        private T Deserialize<T>(Stream stream)
        {
            using (var textReader = new StreamReader(stream))
            {
                var jsonPayload = textReader.ReadToEnd();

                return JsonConvert.DeserializeObject<T>(jsonPayload);
            }
        }

        private string Serialize(object o)
        {
            return JsonConvert.SerializeObject(o);
        }

        private static void EnsureSecurityProtocolSet()
        {
            ServicePointManager.SecurityProtocol =
                SecurityProtocolType.Tls |
                SecurityProtocolType.Tls11 |
                SecurityProtocolType.Tls12;
        }

        private HttpClient GetClient()
        {
            if (this.clientCreateTime >= (DateTime.UtcNow - TimeSpan.FromSeconds(this.httpClientLifetimeSeconds)))
            {
                return this.client.Value;
            }

            lock (this.lockObj)
            {
                if (this.clientCreateTime >= DateTime.UtcNow - TimeSpan.FromSeconds(this.httpClientLifetimeSeconds))
                {
                    return this.client.Value;
                }

                this.client = new Lazy<HttpClient>(this.CreateClient, LazyThreadSafetyMode.ExecutionAndPublication);
                this.clientCreateTime = DateTime.UtcNow;
            }

            return this.client.Value;
        }
    }
}
