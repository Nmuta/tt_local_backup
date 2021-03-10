using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <inheritdoc />
    public sealed class ObligationAuthoringClient : IObligationAuthoringClient
    {
        private const string WebHost = "https://343Harvester.azurewebsites.net/";
        private const string RedirectUrl = "http://localhost";
        private const string Authority = "https://login.windows.net/microsoft.onmicrosoft.com";
        private const string HarvesterResourceId = "4426548c-d0c8-4d31-ad64-00e4fc49e9a4";
        private const string T10ObligationClientId = "dd9dfc49-54ba-4c2d-936b-98f0d9858aad";

        private static readonly HttpClient HttpClient = new HttpClient();

        private readonly IConfidentialClientApplication confidentialClientApplication;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ObligationAuthoringClient"/> class.
        /// </summary>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        /// <param name="configuration">The configuration.</param>
        public ObligationAuthoringClient(IKeyVaultProvider keyVaultProvider, IConfiguration configuration)
        {
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            configuration.ShouldNotBeNull(nameof(configuration));

            var keyVaultName = configuration[ConfigurationKeyConstants.KeyVaultUrl];

            var secret = keyVaultProvider.GetSecretAsync(keyVaultName, "obligation-aad-client-secret").GetAwaiter().GetResult();

            this.confidentialClientApplication = ConfidentialClientApplicationBuilder
                                                    .Create(T10ObligationClientId)
                                                    .WithAuthority(Authority)
                                                    .WithRedirectUri(RedirectUrl)
                                                    .WithClientSecret(secret)
                                                    .Build();
        }

        /// <inheritdoc />
        public async Task<Guid> SafeUpdatePipelineAsync(ObligationPipeline pipeline)
        {
            var existing = await this.GetPipelineAsync(pipeline.Name).ConfigureAwait(false);
            if (existing == null)
            {
                throw new InvalidOperationException("Attempting to update non-existent pipeline");
            }

            pipeline.Etag = existing.Etag;
            foreach (var existingDataActivity in existing.DataActivities)
            {
                if (existingDataActivity.Name.StartsWith("#orphaned_", StringComparison.OrdinalIgnoreCase))
                {
                    throw new InvalidOperationException($"Found an orphaned data activity: {existingDataActivity.Name}. There is nothing safe about this anymore...");
                }

                if (pipeline.DataActivities.All(ds => ds.Name != existingDataActivity.Name))
                {
                    throw new InvalidOperationException($"Attempting to remove a dataActivity '{existingDataActivity.Name}' isn't allowed in SafeUpdate.");
                }
            }

            return await this.UpsertPipelineAsync(pipeline).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<Guid> RenamePipelineAsync(PatchOperation patchOperation)
        {
            patchOperation.ShouldNotBeNull(nameof(patchOperation));

            var renamePipelineRequest = new RenamePipelineRequest
            {
                OldPipelineName = patchOperation.Path,
                NewPipelineName = patchOperation.Value
            };

            using var httpRequestMessage =
                new HttpRequestMessage(HttpMethod.Post, new Uri($"{WebHost}obligation/authoring/pipelines/rename"))
                {
                    Content = new StringContent(JsonConvert.SerializeObject(renamePipelineRequest), Encoding.UTF8, "application/json")
                };

            var response = await this.SendRequestAsync(httpRequestMessage).ConfigureAwait(false);

            var workItemId = JsonConvert.DeserializeObject<IDictionary<string, string>>(response)["work_item_id"];

            return Guid.Parse(workItemId);
        }

        /// <inheritdoc />
        public async Task<Guid> UpsertPipelineAsync(ObligationPipeline pipeline)
        {
            if (string.IsNullOrWhiteSpace(pipeline.Etag))
            {
                pipeline.Etag = await this.GetEtag(pipeline.Name).ConfigureAwait(false);
            }

            var pipelineResponse = new PipelineAuthoringModel
            {
                Etag = pipeline.Etag,
                Pipeline = pipeline
            };

            using var httpRequestMessage =
                new HttpRequestMessage(HttpMethod.Post, new Uri($"{WebHost}obligation/authoring/pipelines"))
                {
                    Content = new StringContent(JsonConvert.SerializeObject(pipelineResponse), Encoding.UTF8, "application/json")
                };

            var response = await this.SendRequestAsync(httpRequestMessage).ConfigureAwait(false);

            var workItemId = JsonConvert.DeserializeObject<IDictionary<string, string>>(response)["work_item_id"];

            return Guid.Parse(workItemId);
        }

        /// <inheritdoc />
        public async Task<Guid> DeletePipelineAsync(string pipelineName)
        {
            using var httpRequestMessage =
                new HttpRequestMessage(HttpMethod.Delete, new Uri($"{WebHost}obligation/authoring/pipelines?name={pipelineName}"));

            var response = await this.SendRequestAsync(httpRequestMessage).ConfigureAwait(false);

            var workItemId = JsonConvert.DeserializeObject<IDictionary<string, string>>(response)["work_item_id"];

            return Guid.Parse(workItemId);
        }

        /// <inheritdoc />
        public async Task<ObligationPipeline> GetPipelineAsync(string pipelineName)
        {
            using var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, new Uri($"{WebHost}obligation/authoring/pipelines?name={pipelineName}"));

            try
            {
                var response = await this.SendRequestAsync(httpRequestMessage).ConfigureAwait(false);

                var pipelineAuthoringModel = JsonConvert.DeserializeObject<PipelineAuthoringModel>(response);
                pipelineAuthoringModel.Pipeline.Etag = pipelineAuthoringModel.Etag;

                return pipelineAuthoringModel.Pipeline;
            }
            catch (Exception ex)
            {
                Debug.Write(ex);
                throw;
            }
        }

        private async Task<string> GetEtag(string pipelineName)
        {
            using var httpRequestMessage =
                new HttpRequestMessage(HttpMethod.Get, new Uri($"{WebHost}obligation/authoring/pipelines?name={pipelineName}"));

            var response = await this.SendRequestAsync(httpRequestMessage).ConfigureAwait(false);

            var etag = response == null ? null : JsonConvert.DeserializeObject<dynamic>(response).etag;

            return etag;
        }

        private async Task<string> SendRequestAsync(HttpRequestMessage httpRequestMessage)
        {
            httpRequestMessage.Headers.Authorization = await this.GetAuthenticationHeaderValueAsync().ConfigureAwait(false);

            using var response = await HttpClient.SendAsync(httpRequestMessage).ConfigureAwait(false);

            var responseBody = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            if (response.IsSuccessStatusCode)
            {
                return responseBody;
            }

            if (httpRequestMessage.Method == HttpMethod.Get && response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }

            throw new InvalidOperationException(responseBody);
        }

        private async Task<AuthenticationHeaderValue> GetAuthenticationHeaderValueAsync()
        {
            var scopes = new[] { HarvesterResourceId + "/.default" };

            var response = await this.confidentialClientApplication.AcquireTokenForClient(scopes).ExecuteAsync().ConfigureAwait(false);

            return new AuthenticationHeaderValue("Bearer", response.AccessToken);
        }
    }
}