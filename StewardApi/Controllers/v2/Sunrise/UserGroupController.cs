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
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using ServicesLiveOps = Forza.LiveOps.FH4.Generated;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Sunrise.UserGroup
{
    /// <summary>
    ///     Handles requests for Sunrise user groups.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/sunrise/usergroup")]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Sunrise)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Sunrise, Target.LspGroup, Target.Details, Dev.ReviseTags)]
    public class UserGroupController : V2SunriseControllerBase
    {
        // "All Users", "VIP", "ULTIMATE_VIP"
        private static readonly List<int> LargeUserGroups = new List<int>() { 0, 1, 2 };

        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;
        private readonly ILoggingService loggingService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UserGroupController"/> class.
        /// </summary>
        public UserGroupController(
            IJobTracker jobTracker,
            IScheduler scheduler,
            ILoggingService loggingService)
        {
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            loggingService.ShouldNotBeNull(nameof(loggingService));

            this.jobTracker = jobTracker;
            this.scheduler = scheduler;
            this.loggingService = loggingService;
        }

        /// <summary>
        ///    Get a user group users.
        /// </summary>
        [HttpGet("{userGroupId}")]
        [SwaggerResponse(200, type: typeof(GetUserGroupUsersResponse))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Create)]
        [AutoActionLogging(TitleCodeName.Sunrise, StewardAction.Add, StewardSubject.UserGroup)]
        public async Task<IActionResult> GetUserGroupUsers(int userGroupId, int startIndex, int maxResults)
        {
            // If the userGroupId received it part of the large user group list, throw an exception
            if (LargeUserGroups.Contains(userGroupId))
            {
                throw new InvalidArgumentsStewardException($"User group provided is part of large user group list. (userGroupId: {userGroupId})");
            }

            try
            {
                var users = await this.Services.UserService.GetUserGroupUsers(userGroupId, startIndex, maxResults).ConfigureAwait(true);

                // Temporary code until the service call returns gamertags //
                var playerLookupParameters = users.xuids
                                                .Select(xuid => new ServicesLiveOps.ForzaPlayerLookupParameters
                                                {
                                                    UserID = xuid.ToString(),
                                                }).ToArray();
                var getUserIdsOutput = await this.Services.UserManagementService.GetUserIds(playerLookupParameters.Length, playerLookupParameters).ConfigureAwait(false);

                var userList = new List<BasicPlayer>();
                foreach (var playerLookupResult in getUserIdsOutput.playerLookupResult)
                {
                    userList.Add(new BasicPlayer()
                    {
                        Gamertag = playerLookupResult.Gamertag,
                        Xuid = playerLookupResult.Xuid,
                    });
                }
                // End of temporary code //
                var response = new GetUserGroupUsersResponse()
                {
                    PlayerList = userList,
                    PlayerCount = users.available
                };

                return this.Ok(response);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Get users from user group failed. (userGroupId: {userGroupId}) (startIndex: {startIndex}) (maxResult: {maxResults})", ex);
            }
        }

        /// <summary>
        ///    Create user group.
        /// </summary>
        [HttpPost("{userGroupName}")]
        [SwaggerResponse(200, type: typeof(LspGroup))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Create)]
        [AutoActionLogging(TitleCodeName.Sunrise, StewardAction.Add, StewardSubject.UserGroup)]
        public async Task<IActionResult> CreateUserGroup(string userGroupName)
        {
            userGroupName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userGroupName));

            try
            {
                var result = await this.Services.UserManagementService.CreateUserGroup(userGroupName).ConfigureAwait(false);
                var newGroup = new LspGroup()
                {
                    Id = result.groupId,
                    Name = userGroupName
                };
                return this.Ok(newGroup);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Create user group failed. (userGroupName: {userGroupName})", ex);
            }
        }

        /// <summary>
        ///    Add users to a user group. Can be done with either xuids or gamertags. Can also be done using a background job.
        /// </summary>
        [HttpPost("{userGroupId}/add")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Sunrise, StewardAction.Update, StewardSubject.UserGroup)]
        public async Task<IActionResult> AddUsersToGroup(int userGroupId, [FromQuery] bool useBackgroundProcessing, [FromBody] UpdateUserGroupInput userList)
        {
            // Greater than 0 blocks adding users to the "All" group
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));

            userList.ValidateUserList();

            if (useBackgroundProcessing)
            {
                var response = await this.AddUsersToGroupUseBackgroundProcessing(userGroupId, userList).ConfigureAwait(false);
                return response;
            }
            else
            {
                var response = await this.AddUsersToUserGroupAsync(userGroupId, userList).ConfigureAwait(false);
                return this.Ok(response);
            }
        }

        /// <summary>
        ///    Remove users from a user group. Can be done with either xuids or gamertags. Can also be done using a background job.
        /// </summary>
        [HttpPost("{userGroupId}/remove")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Sunrise, StewardAction.Delete, StewardSubject.UserGroup)]
        public async Task<IActionResult> RemoveUsersFromGroup(int userGroupId, [FromQuery] bool useBackgroundProcessing, [FromBody] UpdateUserGroupInput userList)
        {
            // Greater than 0 blocks removing users from the "All" group
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));

            userList.ValidateUserList();

            if (useBackgroundProcessing)
            {
                var response = await this.RemoveUsersFromGroupUseBackgroundProcessing(userGroupId, userList).ConfigureAwait(false);
                return response;
            }
            else
            {
                var response = await this.RemoveUsersFromUserGroupAsync(userGroupId, userList).ConfigureAwait(false);
                return this.Ok(response);
            }
        }

        /// <summary>
        ///    Remove every users from a user group.
        /// </summary>
        [HttpPost("{userGroupId}/removeAllUsers")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Delete)]
        [AutoActionLogging(TitleCodeName.Sunrise, StewardAction.DeleteAll, StewardSubject.UserGroup)]
        public async Task<IActionResult> RemoveAllUsersFromGroup(int userGroupId)
        {
            try
            {
                // Block removing all users from All User's and VIP groups.
                userGroupId.ShouldBeGreaterThanValue(LargeUserGroups.Max(), nameof(userGroupId));

                await this.Services.UserService.ClearUserGroup(userGroupId).ConfigureAwait(false);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Remove all users from user group failed. (userGroupId: {userGroupId})", ex);
            }
        }

        // Add users to a user group using xuids and/or gamertags
        private async Task<IList<BasicPlayer>> AddUsersToUserGroupAsync(int groupId, UpdateUserGroupInput userList)
        {
            var groups = new int[] { groupId };
            var failedUsers = new List<string>();
            var correlationId = Guid.NewGuid().ToString();
            Exception lastException = null;

            // Parse userList into response object
            var response = userList.CreateBasicPlayerList();

            foreach (var user in response)
            {
                try
                {
                    if (user.Xuid != null)
                    {
                        await this.Services.UserManagementService.AddToUserGroups(user.Xuid.Value, groups).ConfigureAwait(false);
                    }
                    else
                    {
                        await this.Services.UserService.AddToUserGroupsByGamertag(user.Gamertag, groups).ConfigureAwait(false);
                    }
                }
                catch (Exception ex)
                {
                    failedUsers.Add(user.Gamertag ?? user.Xuid.ToString());
                    var errorMessage = $"Failed to add user to user group. (Gamertag/Xuid: {user.Gamertag ?? user.Xuid.ToString()}) (groupId: {groupId}) (correlationId: {correlationId})";
                    var error = new StewardError(errorMessage, ex);
                    user.Error = error;
                    lastException = ex;
                }
            }

            if (failedUsers.Any())
            {
                var appInsightErrorMessage = $"Failed to add user(s) to user group. (Users: {string.Join(", ", failedUsers.ToArray())}) (groupId: {groupId}) (correlationId:{correlationId})";
                this.loggingService.LogException(new UserGroupManagementAppInsightsException(appInsightErrorMessage, lastException));
            }

            return response;
        }

        // Add users to a user group using xuids and/or gamertags as a background job.
        private async Task<CreatedResult> AddUsersToGroupUseBackgroundProcessing(int userGroupId, UpdateUserGroupInput userList)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var userCount = (userList.Xuids?.Length ?? 0) + (userList.Gamertags?.Length ?? 0);
            var jobId = await this.AddJobIdToHeaderAsync(userList.ToJson(), requesterObjectId, $"Sunrise Add Users to User Group: {userCount} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.AddUsersToUserGroupAsync(userGroupId, userList).ConfigureAwait(false);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus(response);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response).ConfigureAwait(true);
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }

        // Remove users from a user group using xuids and/or gamertags.
        private async Task<IList<BasicPlayer>> RemoveUsersFromUserGroupAsync(int groupId, UpdateUserGroupInput userList)
        {
            var groups = new int[] { groupId };
            var failedUsers = new List<string>();
            var correlationId = Guid.NewGuid().ToString();
            Exception lastException = null;

            // Parse userList into response object
            var response = userList.CreateBasicPlayerList();

            foreach (var user in response)
            {
                try
                {
                    if (user.Xuid != null)
                    {
                        await this.Services.UserManagementService.RemoveFromUserGroups(user.Xuid.Value, groups).ConfigureAwait(false);
                    }
                    else
                    {
                        await this.Services.UserService.RemoveFromUserGroupsByGamertag(user.Gamertag, groups).ConfigureAwait(false);
                    }
                }
                catch (Exception ex)
                {
                    failedUsers.Add(user.Gamertag ?? user.Xuid.ToString());
                    var errorMessage = $"Failed to remove user from user group. (Gamertag/Xuid: {user.Gamertag ?? user.Xuid.ToString()}) (groupId: {groupId}) (correlationId: {correlationId})";
                    var error = new StewardError(errorMessage, ex);
                    user.Error = error;
                    lastException = ex;
                }
            }

            if (failedUsers.Any())
            {
                var appInsightErrorMessage = $"Failed to remove user(s) from user group. (Users: {string.Join(", ", failedUsers.ToArray())}) (groupId: {groupId}) (correlationId:{correlationId})";
                this.loggingService.LogException(new UserGroupManagementAppInsightsException(appInsightErrorMessage, lastException));
            }

            return response;
        }

        // Remove users from a user group using xuids and/or gamertags as a background job.
        private async Task<CreatedResult> RemoveUsersFromGroupUseBackgroundProcessing(int userGroupId, UpdateUserGroupInput userList)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var userCount = (userList.Xuids?.Length ?? 0) + (userList.Gamertags?.Length ?? 0);
            var jobId = await this.AddJobIdToHeaderAsync(userList.ToJson(), requesterObjectId, $"Sunrise Remove Users from User Group: {userCount} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.RemoveUsersFromUserGroupAsync(userGroupId, userList).ConfigureAwait(false);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus(response);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response).ConfigureAwait(true);
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
