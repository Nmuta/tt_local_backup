using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Data;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Player
{
    /// <summary>
    ///     Handles requests for Woodstock credit updates.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/player/{xuid}/creditUpdates")]
    [ApiVersion("2.0")]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.HorizonDesigner,
        UserRole.MotorsportDesigner,
        UserRole.MediaTeam)]
    [SuppressMessage(
        "Microsoft.Maintainability",
        "CA1506:AvoidExcessiveClassCoupling",
        Justification = "This can't be avoided.")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [StandardTags(Title.Woodstock, Target.Player, Topic.CreditUpdates)]
    public sealed class CreditUpdatesController : V2WoodstockControllerBase
    {
        private const int DefaultMaxResults = 100;

        private readonly IKustoProvider kustoProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="CreditUpdatesController"/> class.
        /// </summary>
        public CreditUpdatesController(IKustoProvider kustoProvider)
        {
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));

            this.kustoProvider = kustoProvider;
        }

        /// <summary>
        ///     Gets credit updates.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(List<CreditUpdate>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCreditUpdates(
            ulong xuid,
            [FromQuery] string sortDirection = "Asc",
            [FromQuery] string column = "Timestamp",
            [FromQuery] int startIndex = 0,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1);
            maxResults.ShouldBeGreaterThanValue(0);

            if (!Enum.TryParse(sortDirection, out SortDirection sortEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(sortDirection)} provided: {sortDirection}");
            }

            if (!Enum.TryParse(column, out CreditUpdateColumn columnEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(column)} provided: {column}");
            }

            var result = await this.kustoProvider.GetCreditUpdatesAsync(xuid, Contracts.Common.TitleCodeName.Woodstock, sortEnum, columnEnum, startIndex, maxResults).ConfigureAwait(true);

            return this.Ok(result);
        }
    }
}