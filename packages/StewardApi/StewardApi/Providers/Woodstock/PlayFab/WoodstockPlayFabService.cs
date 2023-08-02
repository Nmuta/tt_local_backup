using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using PlayFab;
using PlayFab.AuthenticationModels;
using PlayFab.EconomyModels;
using PlayFab.Internal;
using PlayFab.MultiplayerModels;
using PlayFab.ServerModels;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Helpers;
using EntityKey = PlayFab.EconomyModels.EntityKey;
using AuthEntityKey = PlayFab.AuthenticationModels.EntityKey;
using ProfileEntityKey = PlayFab.ProfilesModels.EntityKey;
using PlayFab.ProfilesModels;
using Newtonsoft.Json.Linq;

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
        public async Task<Dictionary<ulong, PlayFabProfile>> GetPlayerEntityIdsAsync(IList<ulong> xuids, WoodstockPlayFabEnvironment environment)
        {
            var config = this.GetPlayFabConfig(environment);
            var authContext = await this.GeneratePlayFabAuthContextAsync(config).ConfigureAwait(false);
            var instanceSettings = new PlayFabApiSettings() { TitleId = config.TitleId };

            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            async Task<GetPlayFabIDsFromXboxLiveIDsResult> GetPlayFabMasterEntityAsync(WoodstockPlayFabEnvironment environment, GetPlayFabIDsFromXboxLiveIDsRequest request)
            {
                // GetPlayFabIDsFromXboxLiveIDs DOES NOT support EntityToken. Must use secret key with PlayFabServerAPI
                object obj = await PlayFabHttp.DoPost("/Server/GetPlayFabIDsFromXboxLiveIDs", request, "X-SecretKey", config.Key, null, instanceSettings).ConfigureAwait(false);
                if (obj is PlayFabError)
                {
                    PlayFabError error = (PlayFabError)obj;
                    throw new UnknownFailureStewardException($"Failed to get player entity ids. ${error.ErrorMessage}");
                }

                string serialized = (string)obj;
                return PluginManager.GetPlugin<ISerializerPlugin>(PluginContract.PlayFab_Serializer).DeserializeObject<PlayFabJsonSuccess<GetPlayFabIDsFromXboxLiveIDsResult>>(serialized).data;
            }

            async Task<GetTitlePlayersFromMasterPlayerAccountIdsResponse> GetPlayFabTitleEntityAsync(WoodstockPlayFabEnvironment environment, GetTitlePlayersFromMasterPlayerAccountIdsRequest request)
            {
                // GetPlayFabIDsFromXboxLiveIDs DOES NOT support EntityToken. Must use secret key with PlayFabServerAPI
                object obj = await PlayFabHttp.DoPost("/Profile/GetTitlePlayersFromMasterPlayerAccountIds", request, "X-EntityToken", authContext.EntityToken, null, instanceSettings).ConfigureAwait(false);
                if (obj is PlayFabError)
                {
                    PlayFabError error = (PlayFabError)obj;
                    throw new UnknownFailureStewardException($"Failed to get title entity ids. ${error.ErrorMessage}");
                }

                string serialized = (string)obj;
                return PluginManager.GetPlugin<ISerializerPlugin>(PluginContract.PlayFab_Serializer).DeserializeObject<PlayFabJsonSuccess<GetTitlePlayersFromMasterPlayerAccountIdsResponse>>(serialized).data;
            }

            var xuidsAsStrings = xuids.Select(xuid => xuid.ToString()).ToList();
            var masterResponse = await GetPlayFabMasterEntityAsync(environment, new GetPlayFabIDsFromXboxLiveIDsRequest()
            {
                XboxLiveAccountIDs = xuidsAsStrings,
                Sandbox = environment == WoodstockPlayFabEnvironment.Retail ? "RETAIL" : "TURN.1",
            }).ConfigureAwait(false);

            var masterIds = masterResponse.Data.Where(masterAccount => masterAccount.PlayFabId != null).Select(masterAccount => masterAccount.PlayFabId).ToList();
            var titleDictionary = new Dictionary<string, ProfileEntityKey>();
            if (masterIds.Count > 0)
            {
                var titleResponse = await GetPlayFabTitleEntityAsync(environment, new GetTitlePlayersFromMasterPlayerAccountIdsRequest()
                {
                    MasterPlayerAccountIds = masterIds,
                    TitleId = config.TitleId,
                }).ConfigureAwait(false);

                titleDictionary = titleResponse.TitlePlayerAccounts;
            }

            var resultDictionary = new Dictionary<ulong, PlayFabProfile>();
            masterResponse.Data.ForEach(player =>
            {
                string titleId = null;
                if (player.PlayFabId != null)
                {
                    titleId = titleDictionary.GetValueOrDefault(player.PlayFabId)?.Id ?? null;
                }

                var profile = new PlayFabProfile()
                { 
                    Master = player.PlayFabId,
                    Title = titleId,
                };
                resultDictionary.Add(Convert.ToUInt64(player.XboxLiveAccountId), profile);
            });

            return resultDictionary;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<PlayFabTransaction>> GetTransactionHistoryAsync(string playfabEntityId, WoodstockPlayFabEnvironment environment)
        {
            var entity = new EntityKey()
            {
                Type = "title_player_account",
                Id = playfabEntityId,
            };

            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            async Task<GetTransactionHistoryResponse> GetPlayFabTransactionHistoryAsync(WoodstockPlayFabEnvironment environment, GetTransactionHistoryRequest request)
            {
                //PlayFabEconomyAPI.GetTransactionHistoryAsync();

                var config = this.GetPlayFabConfig(environment);
                var authContext = await this.GeneratePlayFabAuthContextAsync(config).ConfigureAwait(false);
                var instanceSettings = new PlayFabApiSettings() { TitleId = config.TitleId };

                object obj = await PlayFabHttp.DoPost("/Inventory/GetTransactionHistory", request, "X-EntityToken", authContext.EntityToken, null, instanceSettings).ConfigureAwait(false);
                if (obj is PlayFabError)
                {
                    PlayFabError error = (PlayFabError)obj;
                    throw new UnknownFailureStewardException($"Failed to get vouchers. ${error.ErrorMessage}");
                }

                string serialized = (string)obj;
                return PluginManager.GetPlugin<ISerializerPlugin>(PluginContract.PlayFab_Serializer).DeserializeObject<PlayFabJsonSuccess<GetTransactionHistoryResponse>>(serialized).data;
            }

            var response = await GetPlayFabTransactionHistoryAsync(environment, new GetTransactionHistoryRequest()
            {
                Entity = entity,
                CollectionId = "default",
                Count = 10,
            }).ConfigureAwait(false);

            return this.mapper.SafeMap<IEnumerable<PlayFabTransaction>>(response.Transactions);
        }

        /// <inheritdoc />
        public async Task AddInventoryItemToPlayerAsync(string playfabEntityId, string itemId, int amount, WoodstockPlayFabEnvironment environment)
        {
            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            async Task<AddInventoryItemsResponse> AddPlayFabInventoryItemsAsync(WoodstockPlayFabEnvironment environment, AddInventoryItemsRequest request)
            {
                var config = this.GetPlayFabConfig(environment);
                var authContext = await this.GeneratePlayFabAuthContextAsync(config).ConfigureAwait(false);
                var instanceSettings = new PlayFabApiSettings() { TitleId = config.TitleId };

                object obj = await PlayFabHttp.DoPost("/Inventory/AddInventoryItems", request, "X-EntityToken", authContext.EntityToken, null, instanceSettings).ConfigureAwait(false);
                if (obj is PlayFabError)
                {
                    PlayFabError error = (PlayFabError)obj;
                    throw new UnknownFailureStewardException(error.ErrorMessage);
                }

                string serialized = (string)obj;
                return PluginManager.GetPlugin<ISerializerPlugin>(PluginContract.PlayFab_Serializer).DeserializeObject<PlayFabJsonSuccess<AddInventoryItemsResponse>>(serialized).data;
            }

            await AddPlayFabInventoryItemsAsync(environment, new AddInventoryItemsRequest()
            {
                Entity = new EntityKey()
                {
                    Type = "title_player_account",
                    Id = playfabEntityId,
                },
                Amount = amount,
                Item = new InventoryItemReference()
                {
                    Id = itemId,
                },
            }).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task RemoveInventoryItemFromPlayerAsync(string playfabEntityId, string itemId, int amount, WoodstockPlayFabEnvironment environment)
        {
            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            async Task<SubtractInventoryItemsResponse> SubtractPlayFabInventoryItemsAsync(WoodstockPlayFabEnvironment environment, SubtractInventoryItemsRequest request)
            {
                var config = this.GetPlayFabConfig(environment);
                var authContext = await this.GeneratePlayFabAuthContextAsync(config).ConfigureAwait(false);
                var instanceSettings = new PlayFabApiSettings() { TitleId = config.TitleId };

                object obj = await PlayFabHttp.DoPost("/Inventory/SubtractInventoryItems", request, "X-EntityToken", authContext.EntityToken, null, instanceSettings).ConfigureAwait(false);
                if (obj is PlayFabError)
                {
                    PlayFabError error = (PlayFabError)obj;
                    throw new UnknownFailureStewardException(error.ErrorMessage);
                }

                string serialized = (string)obj;
                return PluginManager.GetPlugin<ISerializerPlugin>(PluginContract.PlayFab_Serializer).DeserializeObject<PlayFabJsonSuccess<SubtractInventoryItemsResponse>>(serialized).data;
            }

            await SubtractPlayFabInventoryItemsAsync(environment, new SubtractInventoryItemsRequest()
            {
                Entity = new EntityKey()
                {
                    Type = "title_player_account",
                    Id = playfabEntityId,
                },
                Amount = amount,
                Item = new InventoryItemReference()
                {
                    Id = itemId,
                },
            }).ConfigureAwait(false);
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
