using System;
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
    public sealed class GravityPlayerDetailsProvider : IGravityPlayerDetailsProvider
    {
        private const int MaxLookupResults = 5;

        private readonly IGravityUserService gravityUserService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GravityPlayerDetailsProvider"/> class.
        /// </summary>
        /// <param name="gravityUserService">The Gravity user service.</param>
        /// <param name="mapper">The mapper.</param>
        public GravityPlayerDetailsProvider(IGravityUserService gravityUserService, IMapper mapper)
        {
            gravityUserService.ShouldNotBeNull(nameof(gravityUserService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.gravityUserService = gravityUserService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IdentityResultBeta> GetPlayerIdentityAsync(IdentityQueryBeta query)
        {
            query.ShouldNotBeNull(nameof(query));

            var result = new IdentityResultBeta();

            if (!query.Xuid.HasValue && string.IsNullOrWhiteSpace(query.Gamertag) && string.IsNullOrWhiteSpace(query.T10Id))
            {
                result.Error = new StewardError(StewardErrorCode.RequiredParameterMissing, "T10ID, Gamertag, or XUID must be provided.");
            }
            else if (!string.IsNullOrWhiteSpace(query.T10Id))
            {
                var details = await this.GetUserDetailsByT10Id(query.T10Id).ConfigureAwait(false);

                result = details == null
                    ? throw new ProfileNotFoundException($"No profile found for Turn 10 ID: {query.T10Id}.")
                    : this.mapper.Map<IdentityResultBeta>(details);
            }
            else if (query.Xuid != null)
            {
                var details = await this.GetUserDetailsByXuid(query.Xuid.Value).ConfigureAwait(false);

                result.T10Ids = details ?? throw new ProfileNotFoundException($"No profile found for XUID: {query.Xuid}.");

                var activePlayer = details.OrderByDescending(e => e.LastLogin).FirstOrDefault();
                if (activePlayer != null)
                {
                    result.Xuid = activePlayer.Xuid;
                    result.Gamertag = activePlayer.GamerTag;
                    result.T10Id = activePlayer.Turn10Id;
                }
            }
            else if (!string.IsNullOrWhiteSpace(query.Gamertag))
            {
                var details = await this.GetUserDetailsByGamertag(query.Gamertag).ConfigureAwait(false);

                result.T10Ids = details ?? throw new ProfileNotFoundException($"No profile found for Gamertag: {query.Gamertag}.");

                var activePlayer = details.OrderByDescending(e => e.LastLogin).FirstOrDefault();
                if (activePlayer != null)
                {
                    result.Xuid = activePlayer.Xuid;
                    result.Gamertag = activePlayer.GamerTag;
                    result.T10Id = activePlayer.Turn10Id;
                }
            }

            result.Query = query;

            return result;
        }

        /// <inheritdoc />
        public async Task<GravityPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var response = await this.GetUserDetailsByGamertag(gamertag).ConfigureAwait(false);
            if (response == null) { return null; }

            var details = response.OrderByDescending(e => e.LastLogin).FirstOrDefault();
            if (details == null) { return null; }

            return this.mapper.Map<GravityPlayerDetails>(details);
        }

        /// <inheritdoc />
        public async Task<GravityPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            var response = await this.GetUserDetailsByXuid(xuid).ConfigureAwait(false);
            if (response == null) { return null; }

            var details = response.OrderByDescending(e => e.LastLogin).FirstOrDefault();
            if (details == null) { return null; }

            return this.mapper.Map<GravityPlayerDetails>(details);
        }

        /// <inheritdoc />
        public async Task<GravityPlayerDetails> GetPlayerDetailsByT10IdAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            var response = await this.GetUserDetailsByT10Id(t10Id).ConfigureAwait(false);
            if (response == null) { return null; }

            return this.mapper.Map<GravityPlayerDetails>(response);
        }

        /// <inheritdoc />
        public async Task<bool> EnsurePlayerExistsAsync(ulong xuid)
        {
            try
            {
                await this.gravityUserService.LiveOpsGetUserDetailsByXuidAsync(xuid, MaxLookupResults).ConfigureAwait(false);

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc />
        public async Task<bool> EnsurePlayerExistsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                await this.gravityUserService.LiveOpsGetUserDetailsByGamerTagAsync(gamertag, MaxLookupResults).ConfigureAwait(false);

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc />
        public async Task<bool> EnsurePlayerExistsByT10IdAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            try
            {
                await this.gravityUserService.LiveOpsGetUserDetailsByT10IdAsync(t10Id).ConfigureAwait(false);

                return true;
            }
            catch
            {
                return false;
            }
        }

        private async Task<LiveOpsUserDetails> GetUserDetailsByT10Id(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            try
            {
                var response = await this.gravityUserService.LiveOpsGetUserDetailsByT10IdAsync(t10Id).ConfigureAwait(false);

                return response.userDetails;
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    throw new ProfileNotFoundException($"Player {t10Id} was not found.", ex);
                }

                throw;
            }
        }

        private async Task<LiveOpsUserDetails[]> GetUserDetailsByXuid(ulong xuid)
        {
            try
            {
                var response = await this.gravityUserService.LiveOpsGetUserDetailsByXuidAsync(xuid, MaxLookupResults).ConfigureAwait(false);

                return response.userDetails;
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    throw new ProfileNotFoundException($"Player {xuid} was not found.", ex);
                }

                throw;
            }
        }

        private async Task<LiveOpsUserDetails[]> GetUserDetailsByGamertag(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                var response = await this.gravityUserService.LiveOpsGetUserDetailsByGamerTagAsync(gamertag, MaxLookupResults).ConfigureAwait(false);

                return response.userDetails;
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    throw new ProfileNotFoundException($"Player {gamertag} was not found.", ex);
                }

                throw;
            }
        }
    }
}
