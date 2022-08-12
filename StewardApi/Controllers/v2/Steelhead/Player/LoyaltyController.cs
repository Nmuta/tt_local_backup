using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Test controller for testing Steelhead LSP APIs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/loyalty")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags("LoyaltyRewards", "Steelhead")]
    public class LoyaltyController : V2SteelheadControllerBase
    {
        private const int DefaultMaxResults = 500;
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LoyaltyController"/> class.
        /// </summary>
        public LoyaltyController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the user's profile notes.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<ProfileNote>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetHasPlayedRecordAsync(
            ulong xuid,
            [FromQuery] string externalProfileId)
        {
            externalProfileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(externalProfileId));
            //xuid.IsValidXuid();

            if (!Guid.TryParse(externalProfileId, out var externalProfileIdGuid))
            {
                throw new InvalidArgumentsStewardException($"External Profile ID provided is not a valid Guid: {externalProfileId}");
            }

            try
            {
                var response = await this.Services.UserManagementService.GetHasPlayedRecord(xuid, externalProfileIdGuid).ConfigureAwait(true);
                var result = this.mapper.Map<IList<HasPlayedRecord>>(response.records);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"No record of legacy titles played found. (XUID: {xuid})", ex);
            }
        }

        /// <summary>
        ///    Sends Loyalty Rewards for selected titles.
        /// </summary>
        [HttpPost("rewards/send")]
        [SwaggerResponse(200)]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.CommunityManager)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.Player)]
        public async Task<IActionResult> ResendLoyaltyRewards(ulong xuid, [FromQuery] string externalProfileId, [FromBody] string[] gameTitles)
        {
            //xuid.IsValidXuid();
            externalProfileId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(externalProfileId));
            gameTitles.ShouldNotBeNull(nameof(gameTitles));

            if (!Guid.TryParse(externalProfileId, out var externalProfileIdGuid))
            {
                throw new InvalidArgumentsStewardException($"External Profile ID provided is not a valid Guid: {externalProfileId}");
            }

            var gameTitleIds = new List<int>();
            var unparsedGameTitles = new StringBuilder();

            foreach (var gameTitle in gameTitles)
            {
                if (!Enum.TryParse(typeof(Turn10.UGC.Contracts.GameTitle), gameTitle, true, out var gameTitleEnum))
                {
                    unparsedGameTitles.Append(gameTitle);
                }
                else
                {
                    gameTitleIds.Add((int)gameTitleEnum);
                }
            }

            if (unparsedGameTitles.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Game titles: {unparsedGameTitles} were not found.");
            }

            try
            {
                await this.Services.UserManagementService.ResendProfileHasPlayedNotification(xuid, externalProfileIdGuid, gameTitleIds.ToArray())
                    .ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to send loyalty rewards. (XUID: {xuid})", ex);
            }

            return this.Ok();
        }
    }
}
