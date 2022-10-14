using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;

using AutoMapper;

using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.TeamFoundation.SourceControl.WebApi;

using Swashbuckle.AspNetCore.Annotations;

using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;

using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for steelhead Welcome Center's Message of the Day.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/motd")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.Consoles, Target.Details, Dev.ReviseTags)]
    public class MotDController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService steelheadPegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="MotDController"/> class.
        /// </summary>
        /// <param name="steelheadPegasusService">The steelhead pegasus service.</param>
        public MotDController(ISteelheadPegasusService steelheadPegasusService)
        {
            steelheadPegasusService.ShouldNotBeNull(nameof(steelheadPegasusService));

            this.steelheadPegasusService = steelheadPegasusService;
        }

        /// <summary>
        ///     Gets Message of the Day selection choices.
        /// </summary>
        [HttpGet("options")]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, string>))]
        public async Task<IActionResult> GetMotDSelectionChoicesAsync()
        {
            Dictionary<Guid, string> choices = await this.steelheadPegasusService.GetMotDSelectionChoicesAsync().ConfigureAwait(false);

            return this.Ok(choices);
        }

        /// <summary>
        ///     Gets current Message of the Day values for the entry
        ///     with matching id.
        /// </summary>
        [HttpGet("{id}")]
        [SwaggerResponse(200, type: typeof(MessageOfTheDayBridge))]
        public async Task<IActionResult> GetMotDCurrentValuesAsync(string id)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                throw new BadRequestStewardException($"ID could not be parsed as GUID. (id: {id})");
            }

            MessageOfTheDayBridge motd = await this.steelheadPegasusService.GetMotDCurrentValuesAsync(parsedId).ConfigureAwait(false);

            return this.Ok(motd);
        }

        /// <summary>
        ///     Edits and submit Message of the Day.
        /// </summary>
        [HttpPost("{id}")]
        [SwaggerResponse(200, type: typeof(GitPullRequest))]
        public async Task<IActionResult> EditAndSubmitMessageOfTheDay(
            string id,
            string commitComment,
            string pullRequestTitle,
            string pullRequestDescription,
            [FromBody] MessageOfTheDayBridge motd)
        {
            if (!Guid.TryParse(id, out var parsedId))
            {
                throw new BadRequestStewardException($"ID could not be parsed as GUID. (id: {id})");
            }

            GitPush pushed = await this.steelheadPegasusService.EditMotDMessagesAsync(motd, parsedId, commitComment).ConfigureAwait(false);

            GitPullRequest pr = await this.steelheadPegasusService.CreatePullRequestAsync(pushed, pullRequestTitle, pullRequestDescription).ConfigureAwait(false);

            return this.Ok(pr);
        }
    }
}
