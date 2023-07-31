using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PlayFab;
using PlayFab.AuthenticationModels;
using PlayFab.EconomyModels;
using PlayFab.Internal;
using PlayFab.MultiplayerModels;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab
{
    /// <inheritdoc />
    public sealed class WoodstockPlayFabService : IWoodstockPlayFabService
    {
        private readonly WoodstockPlayFabConfig playerFabConfig;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockPlayFabService"/> class.
        /// </summary>
        public WoodstockPlayFabService(WoodstockPlayFabConfig playerFabConfig, IMapper mapper)
        {
            playerFabConfig.ShouldNotBeNull(nameof(playerFabConfig));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.playerFabConfig = playerFabConfig;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<PlayFabBuildSummary>> GetBuildsAsync(WoodstockPlayFabEnvironment environment)
        {
            var builds = new List<BuildSummary>();
            string skipToken = null;
            var finished = false;

            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            async Task<ListBuildSummariesResponse> ListPlayFabBuildSummariesV2Async(WoodstockPlayFabEnvironment environment, ListBuildSummariesRequest request)
            {
                var config = this.GetPlayFabConfig(environment);
                var authContext = await this.GeneratePlayFabAuthContextAsync(config).ConfigureAwait(false);
                var instanceSettings = new PlayFabApiSettings() { TitleId = config.TitleId };

                request.AuthenticationContext = authContext;
                object obj = await PlayFabHttp.DoPost("/MultiplayerServer/ListBuildSummariesV2", request, "X-EntityToken", authContext.EntityToken, null, instanceSettings).ConfigureAwait(false);
                if (obj is PlayFabError)
                {
                    PlayFabError error = (PlayFabError)obj;
                    throw new UnknownFailureStewardException($"Failed to get PlayFab build summaries. ${error.ErrorMessage}");
                }

                string serialized = (string)obj;
                return PluginManager.GetPlugin<ISerializerPlugin>(PluginContract.PlayFab_Serializer).DeserializeObject<PlayFabJsonSuccess<ListBuildSummariesResponse>>(serialized).data; ;
            }

            while (!finished)
            {
                var response = await ListPlayFabBuildSummariesV2Async(environment, new ListBuildSummariesRequest()
                {
                    SkipToken = skipToken,
                }).ConfigureAwait(false);

                builds.AddRange(response.BuildSummaries);
                skipToken = response.SkipToken;
                finished = skipToken == null;
            }

            return this.mapper.SafeMap<IList<PlayFabBuildSummary>>(builds);
        }

        /// <inheritdoc />
        public async Task<PlayFabBuildSummary> GetBuildAsync(Guid buildId, WoodstockPlayFabEnvironment environment)
        {
            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            async Task<GetBuildResponse> GetPlayFabBuildAsync(WoodstockPlayFabEnvironment environment, GetBuildRequest request)
            {
                var config = this.GetPlayFabConfig(environment);
                var authContext = await this.GeneratePlayFabAuthContextAsync(config).ConfigureAwait(false);
                var instanceSettings = new PlayFabApiSettings() { TitleId = config.TitleId };
                object obj = await PlayFabHttp.DoPost("/MultiplayerServer/GetBuild", request, "X-EntityToken", authContext.EntityToken, null, instanceSettings).ConfigureAwait(false); ;
                if (obj is PlayFabError)
                {
                    PlayFabError error = (PlayFabError)obj;
                    throw new UnknownFailureStewardException($"Failed to get PlayFab build (buildId: {buildId}). ${error.ErrorMessage}");
                }

                string serialized = (string)obj;
                return PluginManager.GetPlugin<ISerializerPlugin>(PluginContract.PlayFab_Serializer).DeserializeObject<PlayFabJsonSuccess<GetBuildResponse>>(serialized).data;
            }

            var response = await GetPlayFabBuildAsync(environment, new GetBuildRequest()
            {
                BuildId = buildId.ToString(),
            }).ConfigureAwait(false);

            return this.mapper.SafeMap<PlayFabBuildSummary>(response);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<PlayFabVoucher>> GetVouchersAsync(WoodstockPlayFabEnvironment environment)
        {
            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            async Task<SearchItemsResponse> SearchPlayFabItemsAsync(WoodstockPlayFabEnvironment environment, SearchItemsRequest request)
            {
                var config = this.GetPlayFabConfig(environment);
                var authContext = await this.GeneratePlayFabAuthContextAsync(config).ConfigureAwait(false);
                var instanceSettings = new PlayFabApiSettings() { TitleId = config.TitleId };
                object obj = await PlayFabHttp.DoPost("/Catalog/SearchItems", request, "X-EntityToken", authContext.EntityToken, null, instanceSettings).ConfigureAwait(false);
                if (obj is PlayFabError)
                {
                    PlayFabError error = (PlayFabError)obj;
                    throw new UnknownFailureStewardException($"Failed to get vouchers. ${error.ErrorMessage}");
                }

                string serialized = (string)obj;
                return PluginManager.GetPlugin<ISerializerPlugin>(PluginContract.PlayFab_Serializer).DeserializeObject<PlayFabJsonSuccess<SearchItemsResponse>>(serialized).data;
            }

            var response = await SearchPlayFabItemsAsync(environment, new SearchItemsRequest()
            {
                Filter = "type eq 'currency'",
            }).ConfigureAwait(false);

            return this.mapper.SafeMap<IEnumerable<PlayFabVoucher>>(response.Items);
        }

        /// <inheritdoc />
        public async Task<object> GetPlayerEntityAsync(ulong xuid, WoodstockPlayFabEnvironment environment)
        {
            return null;
        }

        /// <inheritdoc />
        public async Task<object> GetTransactionHistoryAsync(object playerEntity, WoodstockPlayFabEnvironment environment)
        {
            return null;
        }

        /// <inheritdoc />
        public async Task<object> AddCurrencyToPlayerAsync(object playerEntity, object currency, int amount, WoodstockPlayFabEnvironment environment)
        {
            return null;
        }

        /// <inheritdoc />
        public async Task<object> RemoveCurrencyFromPlayerAsync(object playerEntity, object currency, int amount, WoodstockPlayFabEnvironment environment)
        {
            return null;
        }

        /// <summary>
        ///     Gets the PlayFab config based on provided environment.
        /// </summary>
        private PlayFabConfig GetPlayFabConfig(WoodstockPlayFabEnvironment environment)
        {
            if (!this.playerFabConfig.Environments.TryGetValue(environment, out var config))
            {
                throw new UnknownFailureStewardException($"Failed to get PlayFab config. Invalid {nameof(WoodstockPlayFabEnvironment)} provided: {environment}");
            }

            return config;
        }

        /// <summary>
        ///     Generates a PlayFab auth context to be passed into PlayFab SDK requests.
        /// </summary>
        private async Task<PlayFabAuthenticationContext> GeneratePlayFabAuthContextAsync(PlayFabConfig config)
        {
            // We need to manage auth outside of static settings and handle it per request as multiple people could be making requests on different titles are the same time
            var response = await this.GetEntityTokenAsync(config).ConfigureAwait(false);
            var authContext = new PlayFabAuthenticationContext()
            {
                PlayFabId = config.TitleId,
                EntityToken = response.EntityToken,
            };

            return authContext;
        }

        private async Task<GetEntityTokenResponse> GetEntityTokenAsync(PlayFabConfig config)
        {
            var instanceSettings = new PlayFabApiSettings() { TitleId = config.TitleId };
            object obj = await PlayFabHttp.DoPost("/Authentication/GetEntityToken", new GetEntityTokenRequest(), "X-SecretKey", config.Key, null, instanceSettings).ConfigureAwait(false);
            if (obj is PlayFabError)
            {
                PlayFabError error = (PlayFabError)obj;
                throw new UnknownFailureStewardException($"Failed to generate PlayFab entity token. ${error.ErrorMessage}");
            }

            string serialized = (string)obj;
            GetEntityTokenResponse data = PluginManager.GetPlugin<ISerializerPlugin>(PluginContract.PlayFab_Serializer).DeserializeObject<PlayFabJsonSuccess<GetEntityTokenResponse>>(serialized).data;
            return data;
        }

    }
}
