using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Forza.WebServices.FM8.Generated;
using Kusto.Cloud.Platform.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Output;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Tiles;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
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
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WelcomeCenterController"/> class for Steelhead.
        /// </summary>
        public WelcomeCenterController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets current Welcome Center configuration.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(WelcomeCenterOutput))]
        public async Task<IActionResult> GetWelcomeCenterConfiguration()
        {
            var welcomeCenterData = System.IO.File.ReadAllText(".\\Contracts\\Steelhead\\WelcomeCenter\\TestData\\LiveOps_WorldOfForzaConfigV3.json");
            var welcomeCenterTileData = System.IO.File.ReadAllText(".\\Contracts\\Steelhead\\WelcomeCenter\\TestData\\LiveOps_WorldOfForzaTileCMSDataV3-en-US.json");

            var welcomeCenter = Newtonsoft.Json.JsonConvert.DeserializeObject<Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WelcomeCenter>(welcomeCenterData);
            var welcomeCenterTiles = Newtonsoft.Json.JsonConvert.DeserializeObject<WelcomeCenterTiles>(welcomeCenterTileData);

            var response = new WelcomeCenterOutput
            {
                Left = welcomeCenter.TileColumnCollection[0].TileConfigCollection.Select(
                    column => this.mapper.SafeMap<WelcomeCenterTileOutput>(
                        (column, welcomeCenterTiles.TileCMSCollection.Where(x => x.CMSTileID == column.CMSTileDataID).FirstOrDefault()))).ToList(),

                Center = welcomeCenter.TileColumnCollection[1].TileConfigCollection.Select(
                    column => this.mapper.SafeMap<WelcomeCenterTileOutput>(
                        (column, welcomeCenterTiles.TileCMSCollection.Where(x => x.CMSTileID == column.CMSTileDataID).FirstOrDefault()))).ToList(),

                Right = welcomeCenter.TileColumnCollection[2].TileConfigCollection.Select(
                    column => this.mapper.SafeMap<WelcomeCenterTileOutput>(
                        (column, welcomeCenterTiles.TileCMSCollection.Where(x => x.CMSTileID == column.CMSTileDataID).FirstOrDefault()))).ToList(),
            };

            return this.Ok(response);
        }
    }
}
