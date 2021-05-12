﻿using System;
using System.Threading.Tasks;
using AutoMapper;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Providers.Gravity.ServiceConnections;
using static Forza.WebServices.FMG.Generated.GameSettingsService;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <inheritdoc />
    public sealed class GravityGameSettingsProvider : IGravityGameSettingsProvider
    {
        private readonly IGravityService gravityService;
        private readonly IMapper mapper;
        private readonly IRefreshableCacheStore refreshableCacheStore;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GravityGameSettingsProvider"/> class.
        /// </summary>
        public GravityGameSettingsProvider(
            IGravityService gravityService,
            IMapper mapper,
            IRefreshableCacheStore refreshableCacheStore)
        {
            gravityService.ShouldNotBeNull(nameof(gravityService));
            mapper.ShouldNotBeNull(nameof(mapper));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));

            this.gravityService = gravityService;
            this.mapper = mapper;
            this.refreshableCacheStore = refreshableCacheStore;
        }

        /// <inheritdoc />
        public async Task<GravityMasterInventory> GetGameSettingsAsync(Guid gameSettingsId)
        {
            gameSettingsId.ToString().ShouldNotBeNull(nameof(gameSettingsId));

            try
            {
                var gameSettingsOutput = this.refreshableCacheStore.GetItem<LiveOpsGetGameSettingsOutput>(gameSettingsId.ToString())
                                         ?? await this.gravityService.GetGameSettingsAsync(gameSettingsId).ConfigureAwait(false);
                this.refreshableCacheStore.PutItem(gameSettingsId.ToString(), TimeSpan.FromDays(3), gameSettingsOutput);

                return this.mapper.Map<GravityMasterInventory>(gameSettingsOutput);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"Failed to find Master Inventory List for Game Settings ID: {gameSettingsId}.", ex);
            }
        }
    }
}
