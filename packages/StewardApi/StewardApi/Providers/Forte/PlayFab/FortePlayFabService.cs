﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using PlayFab;
using PlayFab.AuthenticationModels;
using PlayFab.EconomyModels;
using PlayFab.Internal;
using PlayFab.MultiplayerModels;
using PlayFab.ProfilesModels;
using PlayFab.ServerModels;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Forte;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;
using Turn10.LiveOps.StewardApi.Helpers;
using EntityKey = PlayFab.EconomyModels.EntityKey;
using ProfileEntityKey = PlayFab.ProfilesModels.EntityKey;

namespace Turn10.LiveOps.StewardApi.Providers.Forte.PlayFab
{
    /// <inheritdoc />
    public sealed class FortePlayFabService : IFortePlayFabService
    {
        private readonly FortePlayFabConfig playFabConfig;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="FortePlayFabService"/> class.
        /// </summary>
        public FortePlayFabService(FortePlayFabConfig playFabConfig, IMapper mapper)
        {
            playFabConfig.ShouldNotBeNull(nameof(playFabConfig));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.playFabConfig = playFabConfig;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<PlayFabBuildSummary>> GetBuildsAsync(FortePlayFabEnvironment environment)
        {
            var builds = new List<BuildSummary>();
            string skipToken = null;
            var finished = false;

            while (!finished)
            {
                // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
                // Taken from: PlayFabEconomyAPI.PlayFabMultiplayerAPI.ListBuildSummariesV2Async();
                var response = await this.MakePlayFabEntityTokenRequestAsync<ListBuildSummariesResponse>(environment, "/MultiplayerServer/ListBuildSummariesV2", new ListBuildSummariesRequest()
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
        public async Task<PlayFabBuildSummary> GetBuildAsync(Guid buildId, FortePlayFabEnvironment environment)
        {
            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            // Taken from: PlayFabMultiplayerAPI.GetBuildAsync();
            var response = await this.MakePlayFabEntityTokenRequestAsync<GetBuildResponse>(environment, "/MultiplayerServer/GetBuild", new GetBuildRequest()
            {
                BuildId = buildId.ToString(),
            }).ConfigureAwait(false);

            return this.mapper.SafeMap<PlayFabBuildSummary>(response);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<PlayFabVoucher>> GetVouchersAsync(FortePlayFabEnvironment environment)
        {
            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            // Taken from: PlayFabEconomyAPI.SearchItemsAsync();
            var response = await this.MakePlayFabEntityTokenRequestAsync<SearchItemsResponse>(environment, "/Catalog/SearchItems", new SearchItemsRequest()
            {
                Filter = "type eq 'currency'",
            }).ConfigureAwait(false);

            return this.mapper.SafeMap<IEnumerable<PlayFabVoucher>>(response.Items);
        }

        /// <inheritdoc />
        public async Task<Dictionary<ulong, PlayFabProfile>> GetPlayerEntityIdsAsync(IList<ulong> xuids, FortePlayFabEnvironment environment)
        {
            var xuidsAsStrings = xuids.Select(xuid => xuid.ToInvariantString()).ToList();
            var config = this.GetPlayFabConfig(environment);

            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            // Taken from: PlayFabServerAPI.GetPlayFabIDsFromXboxLiveIDsAsync();
            var masterResponse = await this.MakePlayFabSecretTokenRequestAsync<GetPlayFabIDsFromXboxLiveIDsResult>(environment, "/Server/GetPlayFabIDsFromXboxLiveIDs", new GetPlayFabIDsFromXboxLiveIDsRequest()
            {
                XboxLiveAccountIDs = xuidsAsStrings,
                Sandbox = "TURN.1",

                // TODO: determine sandbox based on environment. e.g.-> Sandbox = environment == FortePlayFabEnvironment.Retail ? "RETAIL" : "TURN.1",
            }).ConfigureAwait(false);

            var masterIds = masterResponse.Data.Where(masterAccount => masterAccount.PlayFabId != null).Select(masterAccount => masterAccount.PlayFabId).ToList();
            var titleDictionary = new Dictionary<string, ProfileEntityKey>();
            if (masterIds.Count > 0)
            {
                // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
                // Taken from: PlayFabProfilesAPI.GetTitlePlayersFromMasterPlayerAccountIdsAsync();
                var titleResponse = await this.MakePlayFabEntityTokenRequestAsync<GetTitlePlayersFromMasterPlayerAccountIdsResponse>(environment, "/Profile/GetTitlePlayersFromMasterPlayerAccountIds", new GetTitlePlayersFromMasterPlayerAccountIdsRequest()
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
                resultDictionary.Add(Convert.ToUInt64(player.XboxLiveAccountId, CultureInfo.InvariantCulture), profile);
            });

            return resultDictionary;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<PlayFabTransaction>> GetTransactionHistoryAsync(string playfabEntityId, PlayFabCollectionId collectionId, FortePlayFabEnvironment environment)
        {
            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            // Taken from: PlayFabEconomyAPI.GetTransactionHistoryAsync();
            var response = await this.MakePlayFabEntityTokenRequestAsync<GetTransactionHistoryResponse>(environment, "/Inventory/GetTransactionHistory", new GetTransactionHistoryRequest()
            {
                Entity = new EntityKey()
                {
                    Type = "title_player_account",
                    Id = playfabEntityId,
                },
                CollectionId = collectionId.GetDescription(),
            }).ConfigureAwait(false);

            return this.mapper.SafeMap<IEnumerable<PlayFabTransaction>>(response.Transactions);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<PlayFabInventoryItem>> GetPlayerCurrencyInventoryAsync(string playfabEntityId, PlayFabCollectionId collectionId, FortePlayFabEnvironment environment)
        {
            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            // Taken from: PlayFabEconomyAPI.GetInventoryItemsAsync();
            var response = await this.MakePlayFabEntityTokenRequestAsync<GetInventoryItemsResponse>(environment, "/Inventory/GetInventoryItems", new GetInventoryItemsRequest()
            {
                Entity = new EntityKey()
                {
                    Type = "title_player_account",
                    Id = playfabEntityId,
                },
                CollectionId = collectionId.GetDescription(),
                Filter = "Type eq 'currency'",
            }).ConfigureAwait(false);

            return this.mapper.SafeMap<IEnumerable<PlayFabInventoryItem>>(response.Items);
        }

        /// <inheritdoc />
        public async Task AddInventoryItemToPlayerAsync(string playfabEntityId, PlayFabCollectionId collectionId, string itemId, int amount, FortePlayFabEnvironment environment)
        {
            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            // Taken from: PlayFabEconomyAPI.AddInventoryItemsAsync();
            await this.MakePlayFabEntityTokenRequestAsync<AddInventoryItemsResponse>(environment, "/Inventory/AddInventoryItems", new AddInventoryItemsRequest()
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
                CollectionId = collectionId.GetDescription(),
            }).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task RemoveInventoryItemFromPlayerAsync(string playfabEntityId, PlayFabCollectionId collectionId, string itemId, int amount, FortePlayFabEnvironment environment)
        {
            // We have to create our own PlayFab SDK wrapper as their's doesn't have options to use instanceSettings
            // Taken from: PlayFabEconomyAPI.SubtractInventoryItemsAsync();
            await this.MakePlayFabEntityTokenRequestAsync<SubtractInventoryItemsResponse>(environment, "/Inventory/SubtractInventoryItems", new SubtractInventoryItemsRequest()
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
                CollectionId = collectionId.GetDescription(),
            }).ConfigureAwait(false);
        }

        /// <summary>
        ///     Gets the PlayFab config based on provided environment.
        /// </summary>
        private PlayFabConfig GetPlayFabConfig(FortePlayFabEnvironment environment)
        {
            if (!this.playFabConfig.Environments.TryGetValue(environment, out var config))
            {
                throw new UnknownFailureStewardException($"Failed to get PlayFab config. Invalid {nameof(FortePlayFabEnvironment)} provided: {environment}");
            }

            return config;
        }

        /// <summary>
        ///     Generates a PlayFab auth context to be passed into PlayFab SDK requests.
        /// </summary>
        private async Task<PlayFabAuthenticationContext> GeneratePlayFabAuthContextAsync(FortePlayFabEnvironment environment)
        {
            var config = this.GetPlayFabConfig(environment);

            // We need to manage auth outside of static settings and handle it per request as multiple people could be making requests on different titles are the same time
            var response = await this.MakePlayFabSecretTokenRequestAsync<GetEntityTokenResponse>(environment, "/Authentication/GetEntityToken", new GetEntityTokenRequest()).ConfigureAwait(false);
            var authContext = new PlayFabAuthenticationContext()
            {
                PlayFabId = config.TitleId,
                EntityToken = response.EntityToken,
            };

            return authContext;
        }

        private async Task<T> MakePlayFabEntityTokenRequestAsync<T>(FortePlayFabEnvironment environment, string path, PlayFabRequestCommon request)
            where T : PlayFabResultCommon
        {
            var config = this.GetPlayFabConfig(environment);
            var authContext = await this.GeneratePlayFabAuthContextAsync(environment).ConfigureAwait(false);
            var instanceSettings = new PlayFabApiSettings() { TitleId = config.TitleId };

            var response = await PlayFabHttp.DoPost(path, request, "X-EntityToken", authContext.EntityToken, null, instanceSettings).ConfigureAwait(false);
            this.VerifyPlayFabResponseElseThrow(response);

            var serialized = (string)response;
            return PluginManager.GetPlugin<ISerializerPlugin>(PluginContract.PlayFab_Serializer).DeserializeObject<PlayFabJsonSuccess<T>>(serialized).data;
        }

        private async Task<T> MakePlayFabSecretTokenRequestAsync<T>(FortePlayFabEnvironment environment, string path, PlayFabRequestCommon request)
            where T : PlayFabResultCommon
        {
            var config = this.GetPlayFabConfig(environment);
            var instanceSettings = new PlayFabApiSettings() { TitleId = config.TitleId };

            // GetPlayFabIDsFromXboxLiveIDs DOES NOT support EntityToken. Must use secret key with PlayFabServerAPI
            var response = await PlayFabHttp.DoPost(path, request, "X-SecretKey", config.Key, null, instanceSettings).ConfigureAwait(false);
            this.VerifyPlayFabResponseElseThrow(response);

            var serialized = (string)response;
            return PluginManager.GetPlugin<ISerializerPlugin>(PluginContract.PlayFab_Serializer).DeserializeObject<PlayFabJsonSuccess<T>>(serialized).data;
        }

        private void VerifyPlayFabResponseElseThrow(object playFabApiResponse)
        {
            if (playFabApiResponse is PlayFabError)
            {
                var error = (PlayFabError)playFabApiResponse;
                throw new UnknownFailureStewardException(error.ErrorMessage);
            }
        }
    }
}
