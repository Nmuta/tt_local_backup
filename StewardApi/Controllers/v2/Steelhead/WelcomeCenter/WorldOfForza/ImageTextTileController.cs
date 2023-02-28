using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using StewardGitApi;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Git;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.WelcomeCenter.WorldOfForza
{
    /// <summary>
    ///     Controller for steelhead World of Forza Image Text Tile.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/welcomecenter/worldofforza/imagetext")]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.Pegasus)]
    public class ImageTextTileController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService steelheadPegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ImageTextTileController"/> class.
        /// </summary>
        public ImageTextTileController(ISteelheadPegasusService steelheadPegasusService)
        {
            steelheadPegasusService.ShouldNotBeNull(nameof(steelheadPegasusService));

            this.steelheadPegasusService = steelheadPegasusService;
        }

        /// <summary>
        ///     Gets all image text tile entries to select.
        /// </summary>
        [HttpGet("options")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetImageTextTileSelectionOptionsAsync()
        {
            Dictionary<Guid, string> choices = await this.steelheadPegasusService.GetWorldOfForzaImageTextTileSelectionsAsync().ConfigureAwait(true);

            return this.Ok(choices);
        }

        /// <summary>
        ///     Gets current values for the tile
        ///     with matching id.
        /// </summary>
        [HttpGet("{id}")]
        [SwaggerResponse(200, type: typeof(WofImageTextBridge))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetImageTextTileCurrentValuesAsync(string id)
        {
            var parsedId = id.TryParseGuidElseThrow(nameof(id));

            WofImageTextBridge wofbridge = await this.steelheadPegasusService.GetWorldOfForzaImageTextTileAsync(parsedId).ConfigureAwait(true);

            return this.Ok(wofbridge);
        }

        /// <summary>
        ///     Edits and submit an image text tile.
        /// </summary>
        [HttpPost("{id}")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(PullRequest))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.WelcomeCenter)]
        [Authorize(Policy = UserAttribute.UpdateWelcomeCenterTiles)]
        public async Task<IActionResult> EditAndSubmitImageTextTile(string id, [FromBody] WofImageTextBridge wofTileBridge)
        {
            var parsedId = id.TryParseGuidElseThrow(nameof(id));

            CommitRefProxy change = await this.steelheadPegasusService.EditWorldOfForzaImageTextTileAsync(wofTileBridge, parsedId).ConfigureAwait(true);
            change.CommitComment = string.Format(CultureInfo.InvariantCulture, WelcomeCenterHelpers.StandardCommitMessage, "WoFTileImageText");

            GitPush pushed = await this.steelheadPegasusService.CommitAndPushAsync(new CommitRefProxy[] { change }).ConfigureAwait(true);
            await this.steelheadPegasusService.RunFormatPipelineAsync(pushed).ConfigureAwait(true);

            var user = this.User.UserClaims();
            var pullRequestTitle = string.Format(CultureInfo.InvariantCulture, WelcomeCenterHelpers.StandardPullRequestTitle, "WoFTileImageText", user.EmailAddress);
            var pullRequestDescription = string.Format(CultureInfo.InvariantCulture, WelcomeCenterHelpers.StandardPullRequestDescription, DateTime.UtcNow);

            var pullrequest = await this.steelheadPegasusService.CreatePullRequestAsync(pushed, pullRequestTitle, pullRequestDescription).ConfigureAwait(true);

            return this.Ok(pullrequest);
        }
    }
}