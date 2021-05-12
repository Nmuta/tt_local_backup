using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Opus;
using Turn10.LiveOps.StewardApi.Providers.Opus.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Opus
{
    /// <inheritdoc/>
    public sealed class OpusPlayerInventoryProvider : IOpusPlayerInventoryProvider
    {
        private const int MaxProfileResults = 50;

        private readonly IOpusService opusService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="OpusPlayerInventoryProvider"/> class.
        /// </summary>
        public OpusPlayerInventoryProvider(IOpusService opusService, IMapper mapper)
        {
            opusService.ShouldNotBeNull(nameof(opusService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.opusService = opusService;
            this.mapper = mapper;
        }

        /// <inheritdoc/>
        public async Task<OpusMasterInventory> GetPlayerInventoryAsync(ulong xuid)
        {
            xuid.ShouldNotBeNull(nameof(xuid));

            try
            {
                var response = await this.opusService.GetAdminUserInventoryAsync(xuid).ConfigureAwait(false);

                return this.mapper.Map<OpusMasterInventory>(response.summary);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for XUID: {xuid}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<OpusMasterInventory> GetPlayerInventoryAsync(int profileId)
        {
            try
            {
                var response = await this.opusService.GetAdminUserInventoryByProfileIdAsync(profileId).ConfigureAwait(false);

                return this.mapper.Map<OpusMasterInventory>(response.summary);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for Profile ID: {profileId}", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<OpusInventoryProfile>> GetInventoryProfilesAsync(ulong xuid)
        {
            try
            {
                var response = await this.opusService.GetAdminUserProfilesAsync(xuid, MaxProfileResults)
                    .ConfigureAwait(false);

                return this.mapper.Map<IList<OpusInventoryProfile>>(response.profiles);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No inventory found for XUID: {xuid}", ex);
            }
        }
    }
}
