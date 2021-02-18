using System;
using System.Threading.Tasks;
using AutoMapper;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Opus;

namespace Turn10.LiveOps.StewardApi.Providers.Opus
{
    /// <inheritdoc/>
    public sealed class OpusPlayerDetailsProvider : IOpusPlayerDetailsProvider
    {
        private readonly IOpusUserService opusUserService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="OpusPlayerDetailsProvider"/> class.
        /// </summary>
        /// <param name="opusUserService">The Opus user service.</param>
        /// <param name="mapper">The mapper.</param>
        public OpusPlayerDetailsProvider(IOpusUserService opusUserService, IMapper mapper)
        {
            opusUserService.ShouldNotBeNull(nameof(opusUserService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.opusUserService = opusUserService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query)
        {
            query.ShouldNotBeNull(nameof(query));

            var result = new OpusPlayerDetails();

            if (!query.Xuid.HasValue && string.IsNullOrWhiteSpace(query.Gamertag))
            {
                throw new ArgumentException("Gamertag or Xuid must be provided.");
            }
            else if (query.Xuid.HasValue)
            {
                var playerDetails = await this.GetPlayerDetailsAsync(query.Xuid.Value).ConfigureAwait(false);

                result = playerDetails ?? throw new ProfileNotFoundException($"No profile found for XUID: {query.Xuid}.");
            }
            else if (!string.IsNullOrWhiteSpace(query.Gamertag))
            {
                var playerDetails = await this.GetPlayerDetailsAsync(query.Gamertag).ConfigureAwait(false);

                result = playerDetails ?? throw new ProfileNotFoundException($"No profile found for Gamertag: {query.Gamertag}.");
            }

            var identity = this.mapper.Map<IdentityResultAlpha>(result);
            identity.Query = query;

            return identity;
        }

        /// <inheritdoc />
        public async Task<OpusPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                var response = await this.opusUserService.GetUserMasterDataByGamerTagAsync(gamertag).ConfigureAwait(false);

                return this.mapper.Map<OpusPlayerDetails>(response.userMasterData);
            }
            catch (Exception ex)
            {
                throw new ProfileNotFoundException($"Player {gamertag} was not found.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<OpusPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            try
            {
                var response = await this.opusUserService.GetUserMasterDataByXuidAsync(xuid).ConfigureAwait(false);

                return this.mapper.Map<OpusPlayerDetails>(response.userMasterData);
            }
            catch (Exception ex)
            {
                throw new ProfileNotFoundException($"Player {xuid} was not found.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<bool> EnsurePlayerExistsAsync(ulong xuid)
        {
            try
            {
                await this.opusUserService.GetUserMasterDataByXuidAsync(xuid).ConfigureAwait(false);

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
