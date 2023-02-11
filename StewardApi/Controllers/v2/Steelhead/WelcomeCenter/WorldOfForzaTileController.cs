﻿using System;
using System.Collections.Generic;
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

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Controller for steelhead Welcome Center's World of Forza Tile.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/welcomecenter/worldofforza")]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.Pegasus)]
    public class WorldOfForzaTileController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService steelheadPegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WorldOfForzaTileController"/> class.
        /// </summary>
        public WorldOfForzaTileController(ISteelheadPegasusService steelheadPegasusService)
        {
            steelheadPegasusService.ShouldNotBeNull(nameof(steelheadPegasusService));

            this.steelheadPegasusService = steelheadPegasusService;
        }

        /// <summary>
        ///     Gets all World of Forza entries to select.
        /// </summary>
        [HttpGet("options")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetWorldOfForzaSelectionOptionsAsync()
        {
            Dictionary<Guid, string> choices = await this.steelheadPegasusService.GetWorldOfForzaSelectionsAsync().ConfigureAwait(true);

            return this.Ok(choices);
        }

        /// <summary>
        ///     Gets current World of Forza values for the entry
        ///     with matching id.
        /// </summary>
        [HttpGet("{id}")]
        [SwaggerResponse(200, type: typeof(WofBridge))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetWorldOfForzaCurrentValuesAsync(string id)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                throw new BadRequestStewardException($"ID could not be parsed as GUID. (id: {id})");
            }

            WofBridge wofbridge = await this.steelheadPegasusService.GetWorldOfForzaCurrentValuesAsync(parsedId).ConfigureAwait(true);

            return this.Ok(wofbridge);
        }

        /// <summary>
        ///     Edits and submit World of Forza.
        /// </summary>
        [HttpPost("{id}")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(PullRequest))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.WelcomeCenter)]
        [Authorize(Policy = UserAttribute.UpdateWelcomeCenterTiles)]
        public async Task<IActionResult> EditAndSubmitWorldOfForza(string id, [FromBody] WofBridge wofTileBridge)
        {
            wofTileBridge.ShouldNotBeNull(nameof(wofTileBridge));

            if (!Guid.TryParse(id, out var parsedId))
            {
                throw new BadRequestStewardException($"ID could not be parsed as GUID. (id: {id})");
            }

            var commitComment = "StewardApi: Edits WorldOfForzaTileImage";
            CommitRefProxy change = await this.steelheadPegasusService.EditWorldOfForzaTileAsync(wofTileBridge, parsedId, commitComment).ConfigureAwait(true);

            GitPush pushed = await this.steelheadPegasusService.CommitAndPushAsync(new CommitRefProxy[] { change }).ConfigureAwait(true);
            await this.steelheadPegasusService.RunFormatPipelineAsync(pushed).ConfigureAwait(true);

            var user = this.User.UserClaims();
            var pullRequestTitle = $"Edits WorldOfForzaTileImage from Steward. Author: {user.EmailAddress}";
            var pullRequestDescription = $"- Autogenerated pull request\n\t- Edited on {DateTime.UtcNow:u} (UTC)";

            var pullrequest = await this.steelheadPegasusService.CreatePullRequestAsync(pushed, pullRequestTitle, pullRequestDescription).ConfigureAwait(true);

            return this.Ok(pullrequest);
        }
    }
}