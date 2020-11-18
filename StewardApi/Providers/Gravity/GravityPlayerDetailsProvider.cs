using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Turn10.Data.Common;
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
        public async Task<GravityPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                var response = await this.gravityUserService.LiveOpsGetUserDetailsByGamerTagAsync(gamertag, MaxLookupResults).ConfigureAwait(false);
                if (response.userDetails == null)
                {
                    throw new ProfileNotFoundException($"No profile found for Gamertag: {gamertag}.");
                }

                var details = response.userDetails.OrderByDescending(e => e.LastLogin).FirstOrDefault();
                if (details == null)
                {
                    throw new ProfileNotFoundException($"No profile found for Gamertag: {gamertag}.");
                }

                return this.mapper.Map<GravityPlayerDetails>(details);
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task<GravityPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            try
            {
                var response = await this.gravityUserService.LiveOpsGetUserDetailsByXuidAsync(xuid, MaxLookupResults).ConfigureAwait(false);
                if (response.userDetails == null)
                {
                    throw new ProfileNotFoundException($"No profile found for Xuid: {xuid}.");
                }

                var details = response.userDetails.OrderByDescending(e => e.LastLogin).FirstOrDefault();
                if (details == null)
                {
                    throw new ProfileNotFoundException($"No profile found for Xuid: {xuid}.");
                }

                return this.mapper.Map<GravityPlayerDetails>(details);
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task<GravityPlayerDetails> GetPlayerDetailsByT10IdAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            try
            {
                var response = await this.gravityUserService.LiveOpsGetUserDetailsByT10IdAsync(t10Id).ConfigureAwait(false);

                return this.mapper.Map<GravityPlayerDetails>(response.userDetails);
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
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
    }
}
