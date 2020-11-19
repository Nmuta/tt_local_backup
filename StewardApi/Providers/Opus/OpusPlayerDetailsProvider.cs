using System.Threading.Tasks;
using AutoMapper;
using Turn10.Data.Common;
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
        public async Task<OpusPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                var response = await this.opusUserService.GetUserMasterDataByGamerTagAsync(gamertag).ConfigureAwait(false);

                return this.mapper.Map<OpusPlayerDetails>(response.userMasterData);
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound) { return null; }

                throw;
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
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound) { return null; }

                throw;
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
