using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Opus;
using Turn10.LiveOps.StewardApi.Providers.Opus;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for Opus.
    /// </summary>
    [Route("api/v1/title/Opus")]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew)]
    public sealed class OpusController : ControllerBase
    {
        private readonly IOpusPlayerDetailsProvider opusPlayerDetailsProvider;
        private readonly IOpusPlayerInventoryProvider opusPlayerInventoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="OpusController"/> class.
        /// </summary>
        /// <param name="opusPlayerDetailsProvider">The Opus player details provider.</param>
        /// <param name="opusPlayerInventoryProvider">The Opus player inventory provider.</param>
        public OpusController(
                              IOpusPlayerDetailsProvider opusPlayerDetailsProvider,
                              IOpusPlayerInventoryProvider opusPlayerInventoryProvider)
        {
            opusPlayerDetailsProvider.ShouldNotBeNull(nameof(opusPlayerDetailsProvider));
            opusPlayerInventoryProvider.ShouldNotBeNull(nameof(opusPlayerInventoryProvider));

            this.opusPlayerDetailsProvider = opusPlayerDetailsProvider;
            this.opusPlayerInventoryProvider = opusPlayerInventoryProvider;
        }

        /// <summary>
        ///     Gets the player identity.
        /// </summary>
        /// <param name="identityQueries">The identity queries.</param>
        /// <returns>
        ///     The list of <see cref="IdentityResultAlpha"/>.
        /// </returns>
        [HttpPost("players/identities")]
        [SwaggerResponse(200, type: typeof(List<IdentityResultAlpha>))]
        public async Task<IActionResult> GetPlayerIdentity([FromBody] IList<IdentityQueryAlpha> identityQueries)
        {
            var results = new List<IdentityResultAlpha>();
            var queries = new List<Task<IdentityResultAlpha>>();

            foreach (var query in identityQueries)
            {
                queries.Add(this.RetrieveIdentity(query));
            }

            await Task.WhenAll(queries).ConfigureAwait(true);

            foreach (var query in queries)
            {
                results.Add(await query.ConfigureAwait(true));
            }

            return this.Ok(results);
        }

        /// <summary>
        ///     Get the player details.
        /// </summary>
        /// <param name="gamertag">The gamertag.</param>
        /// <returns>
        ///     The <see cref="OpusPlayerDetails"/>.
        /// </returns>
        [HttpGet("player/gamertag({gamertag})/details")]
        [SwaggerResponse(200, type: typeof(OpusPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var playerDetails = await this.opusPlayerDetailsProvider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(true);

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Get the player details.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The <see cref="OpusPlayerDetails"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/details")]
        [SwaggerResponse(200, type: typeof(OpusPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(ulong xuid)
        {
            var playerDetails = await this.opusPlayerDetailsProvider.GetPlayerDetailsAsync(xuid).ConfigureAwait(true);

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Get the player inventory.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     A <see cref="OpusMasterInventory"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/inventory")]
        [SwaggerResponse(200, type: typeof(OpusMasterInventory))]
        public async Task<IActionResult> GetPlayerInventory(ulong xuid)
        {
            if (!await this.opusPlayerDetailsProvider.EnsurePlayerExistsAsync(xuid).ConfigureAwait(true))
            {
                return this.NotFound($"No profile found for XUID: {xuid}.");
            }

            var inventory = await this.opusPlayerInventoryProvider.GetPlayerInventoryAsync(xuid).ConfigureAwait(true);

            if (inventory == null)
            {
                return this.NotFound($"No inventory found for XUID: {xuid}");
            }

            return this.Ok(inventory);
        }

        /// <summary>
        ///     Get the player inventory.
        /// </summary>
        /// <param name="profileId">The profile ID.</param>
        /// <returns>
        ///     A <see cref="OpusMasterInventory"/>.
        /// </returns>
        [HttpGet("player/profileId({profileId})/inventory")]
        [SwaggerResponse(200, type: typeof(OpusMasterInventory))]
        public async Task<IActionResult> GetPlayerInventory(int profileId)
        {
            var inventory = await this.opusPlayerInventoryProvider.GetPlayerInventoryAsync(profileId).ConfigureAwait(true);

            if (inventory == null || (!inventory.Cars.Any() && (inventory.CreditRewards == null || inventory.CreditRewards[0].Quantity <= 0)))
            {
                return this.NotFound($"No inventory found for Profile ID: {profileId}");
            }

            return this.Ok(inventory);
        }

        /// <summary>
        ///     Gets the player inventory profiles.
        /// </summary>
        /// <param name="xuid">The xuid.</param>
        /// <returns>
        ///     The list of <see cref="OpusInventoryProfile"/>.
        /// </returns>
        [HttpGet("player/xuid({xuid})/inventoryProfiles")]
        [SwaggerResponse(200, type: typeof(IList<OpusInventoryProfile>))]
        public async Task<IActionResult> GetPlayerInventoryProfiles(ulong xuid)
        {
            var inventory = await this.opusPlayerInventoryProvider.GetInventoryProfilesAsync(xuid).ConfigureAwait(true);

            return this.Ok(inventory);
        }

        private async Task<IdentityResultAlpha> RetrieveIdentity(IdentityQueryAlpha query)
        {
            try
            {
                return await this.opusPlayerDetailsProvider.GetPlayerIdentityAsync(query).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                if (ex is ArgumentException)
                {
                    return new IdentityResultAlpha
                    {
                        Error = new IdentityLookupError(StewardErrorCode.RequiredParameterMissing, ex.Message),
                        Query = query
                    };
                }

                if (ex is NotFoundStewardException)
                {
                    return new IdentityResultAlpha
                    {
                        Error = new IdentityLookupError(StewardErrorCode.DocumentNotFound, ex.Message),
                        Query = query
                    };
                }

                throw;
            }
        }
    }
}
