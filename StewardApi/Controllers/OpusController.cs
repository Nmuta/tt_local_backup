using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Opus;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
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
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.MediaTeam,
        UserRole.MotorsportDesigner,
        UserRole.HorizonDesigner)]
    [LogTagTitle(TitleLogTags.Opus)]
    public sealed class OpusController : ControllerBase
    {
        private readonly IMemoryCache memoryCache;
        private readonly IOpusPlayerDetailsProvider opusPlayerDetailsProvider;
        private readonly IOpusPlayerInventoryProvider opusPlayerInventoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="OpusController"/> class.
        /// </summary>
        public OpusController(
            IMemoryCache memoryCache,
            IOpusPlayerDetailsProvider opusPlayerDetailsProvider,
            IOpusPlayerInventoryProvider opusPlayerInventoryProvider)
        {
            memoryCache.ShouldNotBeNull(nameof(memoryCache));
            opusPlayerDetailsProvider.ShouldNotBeNull(nameof(opusPlayerDetailsProvider));
            opusPlayerInventoryProvider.ShouldNotBeNull(nameof(opusPlayerInventoryProvider));

            this.memoryCache = memoryCache;
            this.opusPlayerDetailsProvider = opusPlayerDetailsProvider;
            this.opusPlayerInventoryProvider = opusPlayerInventoryProvider;
        }

        /// <summary>
        ///     Gets the player identity.
        /// </summary>
        [HttpPost("players/identities")]
        [SwaggerResponse(200, type: typeof(List<IdentityResultAlpha>))]
        [ResponseCache(Duration = CacheSeconds.PlayerIdentity, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetPlayerIdentity([FromBody] IList<IdentityQueryAlpha> identityQueries)
        {
            static string MakeKey(IdentityQueryAlpha identityQuery)
            {
                return OpusCacheKey.MakeIdentityLookupKey(identityQuery.Gamertag, identityQuery.Xuid);
            }

            var results = new List<IdentityResultAlpha>();
            var queries = new List<Task<IdentityResultAlpha>>();

            foreach (var query in identityQueries)
            {
                queries.Add(
                    this.memoryCache.GetOrCreateAsync(
                        MakeKey(query),
                        (entry) =>
                        {
                            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(CacheSeconds.PlayerIdentity);
                            return this.RetrieveIdentityAsync(query);
                        }));
            }

            await Task.WhenAll(queries).ConfigureAwait(true);

            foreach (var query in queries)
            {
                results.Add(await query.ConfigureAwait(true));
            }

            return this.Ok(results);
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        [HttpGet("player/gamertag({gamertag})/details")]
        [SwaggerResponse(200, type: typeof(OpusPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var playerDetails = await this.opusPlayerDetailsProvider.GetPlayerDetailsAsync(gamertag).ConfigureAwait(true);

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        [HttpGet("player/xuid({xuid})/details")]
        [SwaggerResponse(200, type: typeof(OpusPlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(ulong xuid)
        {
            var playerDetails = await this.opusPlayerDetailsProvider.GetPlayerDetailsAsync(xuid).ConfigureAwait(true);

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet("player/xuid({xuid})/inventory")]
        [SwaggerResponse(200, type: typeof(OpusPlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(ulong xuid)
        {
            var playerExists = await this.opusPlayerDetailsProvider.DoesPlayerExistAsync(xuid).ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var inventory = await this.opusPlayerInventoryProvider.GetPlayerInventoryAsync(xuid).ConfigureAwait(true);

            if (inventory == null)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            return this.Ok(inventory);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet("player/profileId({profileId})/inventory")]
        [SwaggerResponse(200, type: typeof(OpusPlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(int profileId)
        {
            var inventory = await this.opusPlayerInventoryProvider.GetPlayerInventoryAsync(profileId).ConfigureAwait(true);

            if (inventory == null || (!inventory.Cars.Any() && (inventory.CreditRewards == null || inventory.CreditRewards[0].Quantity <= 0)))
            {
                throw new NotFoundStewardException($"No inventory found for Profile ID: {profileId}");
            }

            return this.Ok(inventory);
        }

        /// <summary>
        ///     Gets the player inventory profiles.
        /// </summary>
        [HttpGet("player/xuid({xuid})/inventoryProfiles")]
        [SwaggerResponse(200, type: typeof(IList<OpusInventoryProfile>))]
        public async Task<IActionResult> GetPlayerInventoryProfiles(ulong xuid)
        {
            var inventory = await this.opusPlayerInventoryProvider.GetInventoryProfilesAsync(xuid).ConfigureAwait(true);

            return this.Ok(inventory);
        }

        private async Task<IdentityResultAlpha> RetrieveIdentityAsync(IdentityQueryAlpha query)
        {
            try
            {
                return await this.opusPlayerDetailsProvider.GetPlayerIdentityAsync(query).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                if (ex is ArgumentException)
                {
                    return new IdentityResultAlpha
                    {
                        Error = new InvalidArgumentsStewardError(ex.Message, ex),
                        Query = query
                    };
                }

                if (ex is NotFoundStewardException)
                {
                    return new IdentityResultAlpha
                    {
                        Error = new NotFoundStewardError(ex.Message, ex),
                        Query = query
                    };
                }

                throw;
            }
        }
    }
}
