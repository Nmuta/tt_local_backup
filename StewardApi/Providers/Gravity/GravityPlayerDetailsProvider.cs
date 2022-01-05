using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FMG.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Gravity.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Gravity
{
    /// <inheritdoc />
    public sealed class GravityPlayerDetailsProvider : IGravityPlayerDetailsProvider
    {
        private const int MaxLookupResults = 5;

        private readonly IGravityService gravityService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GravityPlayerDetailsProvider"/> class.
        /// </summary>
        public GravityPlayerDetailsProvider(IGravityService gravityService, IMapper mapper)
        {
            gravityService.ShouldNotBeNull(nameof(gravityService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.gravityService = gravityService;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IdentityResultBeta> GetPlayerIdentityAsync(IdentityQueryBeta query)
        {
            query.ShouldNotBeNull(nameof(query));

            try
            {
                var result = new IdentityResultBeta();

                if (!query.Xuid.HasValue && string.IsNullOrWhiteSpace(query.Gamertag) && string.IsNullOrWhiteSpace(query.T10Id))
                {
                    result.Error = new InvalidArgumentsStewardError("T10ID, Gamertag, or XUID must be provided.");
                }
                else if (!string.IsNullOrWhiteSpace(query.T10Id))
                {
                    var details = await this.GetUserDetailsByT10IdAsync(query.T10Id).ConfigureAwait(false);

                    result = this.mapper.Map<IdentityResultBeta>(details);
                }
                else if (query.Xuid != null)
                {
                    // XUID lookup of 0 always results in a timeout with LSP. (9/9/21) (lugeiken)
                    if (query.Xuid.Value != 0UL)
                    {
                        var details = await this.GetUserDetailsByXuidAsync(query.Xuid.Value).ConfigureAwait(false);

                        result.T10Ids = details;

                        var activePlayer = details.OrderByDescending(e => e.LastLogin).FirstOrDefault();
                        if (activePlayer != null)
                        {
                            result.Xuid = activePlayer.Xuid;
                            result.Gamertag = activePlayer.GamerTag;
                            result.T10Id = activePlayer.Turn10Id;
                        }
                    }
                    else
                    {
                        result.Error = new InvalidArgumentsStewardError($"Invalid XUID provided for lookup: {query.Xuid.Value}.");
                    }
                }
                else if (!string.IsNullOrWhiteSpace(query.Gamertag))
                {
                    var details = await this.GetUserDetailsByGamertagAsync(query.Gamertag).ConfigureAwait(false);

                    result.T10Ids = details;

                    var activePlayer = details.OrderByDescending(e => e.LastLogin).FirstOrDefault();
                    if (activePlayer != null)
                    {
                        result.Xuid = activePlayer.Xuid;
                        result.Gamertag = activePlayer.GamerTag;
                        result.T10Id = activePlayer.Turn10Id;
                    }
                }

                result.Query = query;
                result.SetErrorForInvalidXuid();

                return result;
            }
            catch (Exception ex)
            {
                if (ex is StewardBaseException)
                {
                    throw;
                }

                throw new UnknownFailureStewardException("Identity lookup has failed for an unknown reason.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<GravityPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                var response = await this.GetUserDetailsByGamertagAsync(gamertag).ConfigureAwait(false);
                var details = response.OrderByDescending(e => e.LastLogin).FirstOrDefault();

                return this.mapper.Map<GravityPlayerDetails>(details);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for Gamertag: {gamertag}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<GravityPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            try
            {
                var response = await this.GetUserDetailsByXuidAsync(xuid).ConfigureAwait(false);
                var details = response.OrderByDescending(e => e.LastLogin).FirstOrDefault();

                return this.mapper.Map<GravityPlayerDetails>(details);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }
}

        /// <inheritdoc />
        public async Task<GravityPlayerDetails> GetPlayerDetailsByT10IdAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            try
            {
                var response = await this.GetUserDetailsByT10IdAsync(t10Id).ConfigureAwait(false);

                return this.mapper.Map<GravityPlayerDetails>(response);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for Turn 10 ID: {t10Id}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<bool> DoesPlayerExistAsync(ulong xuid)
        {
            try
            {
                await this.gravityService.LiveOpsGetUserDetailsByXuidAsync(xuid, MaxLookupResults).ConfigureAwait(false);

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc />
        public async Task<bool> DoesPlayerExistAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                await this.gravityService.LiveOpsGetUserDetailsByGamerTagAsync(gamertag, MaxLookupResults).ConfigureAwait(false);

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc />
        public async Task<bool> DoesPlayerExistByT10IdAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            try
            {
                await this.gravityService.LiveOpsGetUserDetailsByT10IdAsync(t10Id).ConfigureAwait(false);

                return true;
            }
            catch
            {
                return false;
            }
        }

        private async Task<LiveOpsUserDetails> GetUserDetailsByT10IdAsync(string t10Id)
        {
            t10Id.ShouldNotBeNullEmptyOrWhiteSpace(nameof(t10Id));

            try
            {
                var response = await this.gravityService
                    .LiveOpsGetUserDetailsByT10IdAsync(t10Id).ConfigureAwait(false);

                return response.userDetails;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No profile found for Turn 10 ID: {t10Id}.", ex);
            }
        }

        private async Task<LiveOpsUserDetails[]> GetUserDetailsByXuidAsync(ulong xuid)
        {
            try
            {
                var response = await this.gravityService
                    .LiveOpsGetUserDetailsByXuidAsync(xuid, MaxLookupResults).ConfigureAwait(false);

                return response.userDetails;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.", ex);
            }
        }

        private async Task<LiveOpsUserDetails[]> GetUserDetailsByGamertagAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                var response = await this.gravityService
                .LiveOpsGetUserDetailsByGamerTagAsync(gamertag, MaxLookupResults).ConfigureAwait(false);

                return response.userDetails;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No profile found for Gamertag: {gamertag}.", ex);
            }
        }
    }
}
