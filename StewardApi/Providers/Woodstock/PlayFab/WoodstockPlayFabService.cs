using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Azure.Identity;
using Microsoft.Azure.Documents;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using PlayFab;
using PlayFab.AuthenticationModels;
using PlayFab.ClientModels;
using PlayFab.MultiplayerModels;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab
{
    /// <inheritdoc />
    public sealed class WoodstockPlayFabService : IWoodstockPlayFabService
    {
        private readonly WoodstockPlayFabConfig playerFabConfig;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockPlayFabService"/> class.
        /// </summary>
        public WoodstockPlayFabService(WoodstockPlayFabConfig playerFabConfig)
        {
            playerFabConfig.ShouldNotBeNull(nameof(playerFabConfig));

            this.playerFabConfig = playerFabConfig;
        }

        /// <inheritdoc />
        public async Task<IList<BuildSummary>> GetBuildsAsync(WoodstockPlayFabEnvironment environment)
        {
            await this.InitialisePlayFabSdkAsync(environment).ConfigureAwait(true);

            var builds = new List<BuildSummary>();
            string skipToken = null;
            var finished = false;

            while (!finished)
            {
                var response = await PlayFabMultiplayerAPI.ListBuildSummariesV2Async(new ListBuildSummariesRequest()
                {
                    SkipToken = skipToken,
                }).ConfigureAwait(true);

                if (response.Error != null)
                {
                    throw new UnknownFailureStewardException(response.Error.ErrorMessage);
                }

                builds.AddRange(response.Result.BuildSummaries);
                skipToken = response.Result.SkipToken;
                finished = skipToken == null;
            }

            return builds;
        }

        /// <summary>
        ///  Gets the provided PlayFab title's API.
        /// </summary>
        private async Task InitialisePlayFabSdkAsync(WoodstockPlayFabEnvironment environment) {
            if (!this.playerFabConfig.Environments.TryGetValue(environment, out var environmentConfig))
            {
                throw new UnknownFailureStewardException($"Failed to initialize PlayFab SDK. Invalid {nameof(WoodstockPlayFabEnvironment)} provided: {environment}");
            }

            PlayFabSettings.staticSettings.TitleId = environmentConfig.TitleId;
            PlayFabSettings.staticSettings.DeveloperSecretKey = environmentConfig.Key;

            await PlayFabAuthenticationAPI.GetEntityTokenAsync(new GetEntityTokenRequest()).ConfigureAwait(true);
        }
    }
}
