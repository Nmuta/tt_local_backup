﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FMG.Generated;
using Turn10.Data.Common;
using Turn10.FMG.ForzaClient;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <inheritdoc />
    public sealed class GravityGameSettingsProvider : IGravityGameSettingsProvider
    {
        private readonly IGravityGameSettingsService gravityGameSettingsService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GravityGameSettingsProvider"/> class.
        /// </summary>
        /// <param name="gravityGameSettingsService">The Gravity game settings service.</param>
        /// <param name="mapper">The mapper.</param>
        public GravityGameSettingsProvider(
            IGravityGameSettingsService gravityGameSettingsService,
            IMapper mapper)
        {
            gravityGameSettingsService.ShouldNotBeNull(nameof(gravityGameSettingsService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.gravityGameSettingsService = gravityGameSettingsService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task GetGameSettingsAsync(Guid gameSettingsId)
        {
            try
            {
                await this.gravityGameSettingsService.GetGameSettingsAsync(gameSettingsId).ConfigureAwait(false);
            }
            catch (ForzaClientException ex)
            {
                throw ex;
            }

            return;
        }
    }
}
