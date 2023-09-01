using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SteelheadLiveOpsContent;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Output;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead Welcome Center.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/welcomeCenter")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Calendar, Topic.WelcomeCenter, Target.Details)]
    public class WelcomeCenterController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService pegasusService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WelcomeCenterController"/> class for Steelhead.
        /// </summary>
        public WelcomeCenterController(ISteelheadPegasusService pegasusService, IMapper mapper)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.pegasusService = pegasusService;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets current Welcome Center configuration.
        /// </summary>
        [HttpGet("configuration")]
        [SwaggerResponse(200, type: typeof(WelcomeCenterOutput))]
        public async Task<IActionResult> GetWelcomeCenterConfiguration([FromQuery] string environment, [FromQuery] string slot, [FromQuery] string snapshot)
        {
            var response = await this.GetWelcomeCenterConfigurationAsync(environment, slot, snapshot).ConfigureAwait(true);

            return this.Ok(response);
        }

        /// <summary>
        ///     Gets current Welcome Center configuration.
        /// </summary>
        [HttpGet("player/{xuid}/configuration")]
        [SwaggerResponse(200, type: typeof(WelcomeCenterOutput))]
        public async Task<IActionResult> GetWelcomeCenterConfiguration(ulong xuid)
        {
            var gameDetails = await this.Services.UserManagementService.GetUserDetails(xuid).ConfigureAwait(true);

            var response = await this.GetWelcomeCenterConfigurationAsync(
                gameDetails.forzaUser.CMSEnvironmentOverride,
                gameDetails.forzaUser.CMSSlotIdOverride,
                gameDetails.forzaUser.CMSSnapshotId).ConfigureAwait(true);

            return this.Ok(response);
        }

        private async Task<WelcomeCenterOutput> GetWelcomeCenterConfigurationAsync(string environment, string slot, string snapshot)
        {
            var welcomeCenterLookup = this.pegasusService.GetWelcomeCenterDataAsync();
            var welcomeCenterTilesLookup = this.pegasusService.GetWelcomeCenterTileDataAsync();

            await Task.WhenAll(welcomeCenterLookup, welcomeCenterTilesLookup).ConfigureAwait(true);

            var welcomeCenter = welcomeCenterLookup.GetAwaiter().GetResult();
            var welcomeCenterTiles = welcomeCenterTilesLookup.GetAwaiter().GetResult();

            var response = new WelcomeCenterOutput
            {
                Left = welcomeCenter.TileColumnCollection.ToList()[0].TileConfigCollection.Where(column => column is WoFTileConfigCMSDeeplink).Select(
                    column => this.mapper.SafeMap<WelcomeCenterTileOutput>(
                        (column, welcomeCenterTiles.TileCMSCollection.Where(x => x.CMSTileID == (column as WoFTileConfigCMSDeeplink).CMSTileDataID).FirstOrDefault()))).ToList(),

                Center = welcomeCenter.TileColumnCollection.ToList()[1].TileConfigCollection.Where(column => column is WoFTileConfigCMSDeeplink).Select(
                    column => this.mapper.SafeMap<WelcomeCenterTileOutput>(
                        (column, welcomeCenterTiles.TileCMSCollection.Where(x => x.CMSTileID == (column as WoFTileConfigCMSDeeplink).CMSTileDataID).FirstOrDefault()))).ToList(),

                Right = welcomeCenter.TileColumnCollection.ToList()[2].TileConfigCollection.Where(column => column is WoFTileConfigCMSDeeplink).Select(
                    column => this.mapper.SafeMap<WelcomeCenterTileOutput>(
                        (column, welcomeCenterTiles.TileCMSCollection.Where(x => x.CMSTileID == (column as WoFTileConfigCMSDeeplink).CMSTileDataID).FirstOrDefault()))).ToList(),
            };

            return response;
        }
    }
}
