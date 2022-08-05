using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
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
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using static System.FormattableString;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.UserGroup
{
    /// <summary>
    ///     Handles requests for Woodstock user groups.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/usergroup")]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags("UserGroup", "Woodstock")]
    public class UserGroupController : V2ControllerBase
    {
        private readonly IWoodstockServiceManagementProvider serviceManagementProvider;
        private readonly IJobTracker jobTracker;
        private readonly IActionLogger actionLogger;
        private readonly IScheduler scheduler;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UserGroupController"/> class.
        /// </summary>
        public UserGroupController(
            IWoodstockServiceManagementProvider serviceManagementProvider,
            IJobTracker jobTracker,
            IActionLogger actionLogger,
            IScheduler scheduler)
        {
            serviceManagementProvider.ShouldNotBeNull(nameof(serviceManagementProvider));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            scheduler.ShouldNotBeNull(nameof(scheduler));

            this.serviceManagementProvider = serviceManagementProvider;
            this.jobTracker = jobTracker;
            this.actionLogger = actionLogger;
            this.scheduler = scheduler;
        }

        /// <summary>
        ///    Create user group.
        /// </summary>
        [HttpPost("{userGroupName}")]
        [SwaggerResponse(200, type: typeof(LspGroup))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Create)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Add, StewardSubject.UserGroup)]
        public async Task<IActionResult> CreateUserGroup(string userGroupName)
        {
            userGroupName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userGroupName));

            var endpoint = this.WoodstockEndpoint.Value;
            var newGroup = await this.serviceManagementProvider.CreateLspGroupAsync(userGroupName, endpoint).ConfigureAwait(false);

            return this.Ok(newGroup);
        }

        /// <summary>
        ///    Add users to a user group.
        /// </summary>
        [HttpPost("{userGroupId}/add")]
        [SwaggerResponse(200, type: typeof(IList<UserGroupManagementResponse>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.UserGroup)]
        public async Task<IActionResult> AddUsersToGroup(int userGroupId, [FromBody] IList<ulong> xuids)
        {
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));
            xuids.EnsureValidXuids();

            var endpoint = this.WoodstockEndpoint.Value;
            var response = await this.serviceManagementProvider.AddUsersToLspGroupAsync(xuids, userGroupId, endpoint).ConfigureAwait(false);

            return this.Ok(response);
        }

        /// <summary>
        ///    Remove users from a user group.
        /// </summary>
        [HttpPost("{userGroupId}/remove")]
        [SwaggerResponse(200, type: typeof(IList<UserGroupManagementResponse>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.UserGroup)]
        public async Task<IActionResult> RemoveUsersFromGroup(int userGroupId, [FromBody] IList<ulong> xuids)
        {
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));
            xuids.EnsureValidXuids();

            var endpoint = this.WoodstockEndpoint.Value;
            var response = await this.serviceManagementProvider.RemoveUsersFromLspGroupAsync(xuids, userGroupId, endpoint).ConfigureAwait(false);

            return this.Ok(response);
        }

        /// <summary>
        ///    Add users to a user group using a background job.
        /// </summary>
        [HttpPost("{userGroupId}/add/useBackgroundProcessing")]
        [SwaggerResponse(200, type: typeof(BackgroundJob))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.UserGroup)]
        public async Task<IActionResult> AddUsersToGroupUseBackgroundProcessing(int userGroupId, [FromBody] IList<ulong> xuids)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));
            xuids.EnsureValidXuids();

            var endpoint = this.WoodstockEndpoint.Value;
            var jobId = await this.AddJobIdToHeaderAsync(xuids.ToJson(), requesterObjectId, $"Woodstock Add Users to User Group: {xuids.Count} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.serviceManagementProvider.AddUsersToLspGroupAsync(xuids, userGroupId, endpoint).ConfigureAwait(false);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus(response);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response).ConfigureAwait(true);

                    var xuidsAdded = response.Where(response => response.Error == null)
                        .Select(successfulResponse => Invariant($"{successfulResponse.Xuid}")).ToList();

                    await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, xuidsAdded)
                        .ConfigureAwait(true);
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }

        /// <summary>
        ///    Remove users from a user group using a background job.
        /// </summary>
        [HttpPost("{userGroupId}/remove/useBackgroundProcessing")]
        [SwaggerResponse(200, type: typeof(BackgroundJob))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.UserGroup)]
        public async Task<IActionResult> RemoveUsersFromGroupUseBackgroundProcessing(int userGroupId, [FromBody] IList<ulong> xuids)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));
            xuids.EnsureValidXuids();

            var endpoint = this.WoodstockEndpoint.Value;
            var jobId = await this.AddJobIdToHeaderAsync(xuids.ToJson(), requesterObjectId, $"Woodstock Remove Users from User Group: {xuids.Count} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.serviceManagementProvider.RemoveUsersFromLspGroupAsync(xuids, userGroupId, endpoint).ConfigureAwait(false);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus(response);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response).ConfigureAwait(true);

                    var xuidsRemoved = response.Where(response => response.Error == null)
                        .Select(successfulResponse => Invariant($"{successfulResponse.Xuid}")).ToList();

                    await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, xuidsRemoved)
                        .ConfigureAwait(true);
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }

        private async Task<string> AddJobIdToHeaderAsync(string requestBody, string userObjectId, string reason)
        {
            var jobId = await this.jobTracker.CreateNewJobAsync(requestBody, userObjectId, reason)
                .ConfigureAwait(true);

            this.Response.Headers.Add("jobId", jobId);

            return jobId;
        }
    }
}
