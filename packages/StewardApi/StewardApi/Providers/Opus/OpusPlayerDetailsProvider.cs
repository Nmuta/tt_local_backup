using AutoMapper;
using System;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Opus;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Opus.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Opus
{
    /// <inheritdoc/>
    public sealed class OpusPlayerDetailsProvider : IOpusPlayerDetailsProvider
    {
        private readonly IOpusService opusService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="OpusPlayerDetailsProvider"/> class.
        /// </summary>
        public OpusPlayerDetailsProvider(IOpusService opusService, IMapper mapper)
        {
            opusService.ShouldNotBeNull(nameof(opusService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.opusService = opusService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query)
        {
            query.ShouldNotBeNull(nameof(query));

            OpusPlayerDetails result = null;

            try
            {
                result = new OpusPlayerDetails();

                if (!query.Xuid.HasValue && string.IsNullOrWhiteSpace(query.Gamertag))
                {
                    throw new ArgumentException("Gamertag or Xuid must be provided.");
                }

                if (query.Xuid.HasValue)
                {
                    var playerDetails = await this.GetPlayerDetailsAsync(query.Xuid.Value).ConfigureAwait(false);

                    result = playerDetails ??
                             throw new NotFoundStewardException($"No profile found for XUID: {query.Xuid}.");
                }
                else if (!string.IsNullOrWhiteSpace(query.Gamertag))
                {
                    var playerDetails = await this.GetPlayerDetailsAsync(query.Gamertag).ConfigureAwait(false);

                    result = playerDetails ??
                             throw new NotFoundStewardException($"No profile found for Gamertag: {query.Gamertag}.");
                }
            }
            catch (Exception ex)
            {
                if (ex is StewardBaseException)
                {
                    throw;
                }

                throw new UnknownFailureStewardException("Identity lookup has failed for an unknown reason.", ex);
            }

            var identity = this.mapper.SafeMap<IdentityResultAlpha>(result);
            identity.Query = query;
            identity.SetErrorForInvalidXuid();

            return identity;
        }

        /// <inheritdoc />
        public async Task<OpusPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            Forza.WebServices.FH3.Generated.UserService.GetUserMasterDataByGamerTagOutput response = null;

            try
            {
                response = await this.opusService.GetUserMasterDataByGamerTagAsync(gamertag).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for Gamertag: {gamertag}.", ex);
            }

            return this.mapper.SafeMap<OpusPlayerDetails>(response.userMasterData);
        }

        /// <inheritdoc />
        public async Task<OpusPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            Forza.WebServices.FH3.Generated.UserService.GetUserMasterDataByXuidOutput response = null;

            try
            {
                response = await this.opusService.GetUserMasterDataByXuidAsync(xuid).ConfigureAwait(false);

                if (response.userMasterData.Region <= 0)
                {
                    throw new NotFoundStewardException($"No player found for XUID: {xuid}.");
                }
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }

            return this.mapper.SafeMap<OpusPlayerDetails>(response.userMasterData);
        }

        /// <inheritdoc />
        public async Task<bool> DoesPlayerExistAsync(ulong xuid)
        {
            try
            {
                var result = await this.opusService.GetUserMasterDataByXuidAsync(xuid).ConfigureAwait(false);

                return result.userMasterData.Region > 0;
            }
            catch
            {
                return false;
            }
        }
    }
}
