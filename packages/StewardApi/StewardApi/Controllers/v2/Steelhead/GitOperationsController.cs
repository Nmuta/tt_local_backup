using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Git;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for steelhead Git Operations.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/gitops")]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.Git)]
    public class GitOperationsController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService steelheadPegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GitOperationsController"/> class.
        /// </summary>
        public GitOperationsController(ISteelheadPegasusService steelheadPegasusService)
        {
            steelheadPegasusService.ShouldNotBeNull(nameof(steelheadPegasusService));

            this.steelheadPegasusService = steelheadPegasusService;
        }

        /// <summary>
        ///     Gets pull requests created by steward.
        /// </summary>
        [HttpGet("pullrequest/{status}")]
        [SwaggerResponse(200, type: typeof(List<PullRequest>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetPullRequests(PullRequestStatus status, string subject)
        {
            var pullRequests = await this.steelheadPegasusService.GetPullRequestsAsync(status, subject).ConfigureAwait(true);

            return this.Ok(pullRequests);
        }

        /// <summary>
        ///     Abandons pull request by id and deletes the source branch.
        /// </summary>
        [HttpGet("pullrequest/abandon/{pullRequestId}/")]
        [SwaggerResponse(200, type: typeof(GitPullRequest))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> AbandonPullRequest(int pullRequestId)
        {
            var pullRequest = await this.steelheadPegasusService.AbandonPullRequestAsync(pullRequestId, deleteSourceBranch: true).ConfigureAwait(true);

            return this.Ok(pullRequest);
        }

        /// <summary>
        ///     Gets all branches.
        /// </summary>
        [HttpGet("refs/")]
        [SwaggerResponse(200, type: typeof(List<GitRef>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetAllBranches()
        {
            var branches = await this.steelheadPegasusService.GetAllBranchesAsync().ConfigureAwait(true);

            return this.Ok(branches);
        }
    }
}
