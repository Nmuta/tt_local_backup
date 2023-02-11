using System;
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
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.MessageOfTheDay;
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
    ///     Controller for steelhead Welcome Center's Message of the Day.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/welcomecenter/messageoftheday")]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.Pegasus)]
    public class MessageOfTheDayController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService steelheadPegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="MessageOfTheDayController"/> class.
        /// </summary>
        public MessageOfTheDayController(ISteelheadPegasusService steelheadPegasusService)
        {
            steelheadPegasusService.ShouldNotBeNull(nameof(steelheadPegasusService));

            this.steelheadPegasusService = steelheadPegasusService;
        }

        /// <summary>
        ///     Gets all Message of the Day entries to select.
        /// </summary>
        [HttpGet("options")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetMotDSelectionOptionsAsync()
        {
            var choices = await this.steelheadPegasusService.GetMessageOfTheDaySelectionsAsync().ConfigureAwait(true);

            return this.Ok(choices);
        }

        /// <summary>
        ///     Gets current Message of the Day values for the entry
        ///     with matching id.
        /// </summary>
        [HttpGet("{id}")]
        [SwaggerResponse(200, type: typeof(MotdBridge))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetMotDCurrentValuesAsync(string id)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                throw new BadRequestStewardException($"ID could not be parsed as GUID. (id: {id})");
            }

            var motdbridge = await this.steelheadPegasusService.GetMessageOfTheDayCurrentValuesAsync(parsedId).ConfigureAwait(true);

            return this.Ok(motdbridge);
        }

        /// <summary>
        ///     Edits and submit Message of the Day.
        /// </summary>
        [HttpPost("{id}")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(PullRequest))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.WelcomeCenter)]
        [Authorize(Policy = UserAttribute.UpdateMessageOfTheDay)]
        public async Task<IActionResult> EditAndSubmitMessageOfTheDay(string id, [FromBody] MotdBridge messageOfTheDayBridge)
        {
            messageOfTheDayBridge.ShouldNotBeNull(nameof(messageOfTheDayBridge));

            if (!Guid.TryParse(id, out var parsedId))
            {
                throw new BadRequestStewardException($"ID could not be parsed as GUID. (id: {id})");
            }

            var commitComment = "StewardApi: Edits MessageOfTheDay";
            CommitRefProxy change = await this.steelheadPegasusService.EditMessageOfTheDayAsync(messageOfTheDayBridge, parsedId, commitComment).ConfigureAwait(true);

            GitPush pushed = await this.steelheadPegasusService.CommitAndPushAsync(new CommitRefProxy[] { change }).ConfigureAwait(true);
            await this.steelheadPegasusService.RunFormatPipelineAsync(pushed).ConfigureAwait(true);

            var user = this.User.UserClaims();
            var pullRequestTitle = $"Edits MessageOfTheDay from Steward. Author: {user.EmailAddress}";
            var pullRequestDescription = $"- Autogenerated pull request\n\t- Edited on {DateTime.UtcNow:u} (UTC)";

            var pullrequest = await this.steelheadPegasusService.CreatePullRequestAsync(pushed, pullRequestTitle, pullRequestDescription).ConfigureAwait(true);

            return this.Ok(pullrequest);
        }
    }
}
