using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Sunrise
{
    /// <summary>
    ///     Handles requests for Sunrise players.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/sunrise/player")]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.MediaTeam,
        UserRole.MotorsportDesigner,
        UserRole.HorizonDesigner)]
    [LogTagTitle(TitleLogTags.Sunrise)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Sunrise, Target.Player, Topic.Profile)]
    public class PlayerController : V2ControllerBase
    {
        private readonly IKustoProvider kustoProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PlayerController"/> class.
        /// </summary>
        public PlayerController(IKustoProvider kustoProvider)
        {
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));

            this.kustoProvider = kustoProvider;
        }

        /// <summary>
        ///     Gets a log of player save rollbacks.
        /// </summary>
        [HttpGet("{xuid}/saveRollbackLog")]
        [SwaggerResponse(200, type: typeof(IList<SaveRollbackHistory>))]
        [LogTagDependency(DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetSaveRollbackLog(ulong xuid)
        {
            xuid.EnsureValidXuid();

            var saveHistoryLog = await this.kustoProvider.GetSaveRollbackHistoryAsync(xuid).ConfigureAwait(true);

            return this.Ok(saveHistoryLog);
        }
    }
}
