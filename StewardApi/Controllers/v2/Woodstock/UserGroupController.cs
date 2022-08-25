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
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using static System.FormattableString;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

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
    [Tags(Title.Woodstock, Target.LspGroup, Target.Details, Dev.ReviseTags)]
    public class UserGroupController : V2WoodstockControllerBase
    {
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
        ///    Get a user group users. User list index starts at 1.
        /// </summary>
        [HttpGet("{userGroupId}")]
        [SwaggerResponse(200, type: typeof(GetUserGroupUsersResponse))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Create)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Add, StewardSubject.UserGroup)]
        public async Task<IActionResult> GetUserGroupUsers(int userGroupId, int startIndex, int maxResults)
        {
            try
            {
                var users = await this.Services.UserManagementService.GetUserGroupUsers(userGroupId, startIndex, maxResults).ConfigureAwait(true);

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
                throw new UnknownFailureStewardException("Get users from user group failed.", ex);
            }
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
                throw new UnknownFailureStewardException("Create user group failed.", ex);
            }
        }

        /// <summary>
        ///    Add users to a user group. Can be done with either xuids or gamertags. Can also be done using a background job.
        /// </summary>
        [HttpPost("{userGroupId}/add")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.UserGroup)]
        public async Task<IActionResult> AddUsersToGroup(int userGroupId, [FromQuery] bool useBackgroundProcessing, [FromBody] BasicPlayerList userList)
        {
            // Greater than 0 blocks adding users to the "All" group
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));

            // Check if both xuids and gamertags were specified. Will be a valid request in the future. (PBI #1290729)
            if (userList.Xuids != null && userList.Xuids.Length > 0 &&
                userList.Gamertags != null && userList.Gamertags.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Providing both Xuids and Gamertags is not supported.");
            }

            if (userList.Xuids != null && userList.Xuids.Length > 0)
            {
                userList.Xuids.EnsureValidXuids();

                if (useBackgroundProcessing)
                {
                    var response = await this.AddUsersToGroupUseBackgroundProcessing(userGroupId, userList.Xuids).ConfigureAwait(false);
                    return response;
                }
                else
                {
                    var response = await this.AddUsersToUserGroupAsync(userGroupId, userList.Xuids).ConfigureAwait(false);
                    return this.Ok(response);
                }
            }
            else if (userList.Gamertags != null && userList.Gamertags.Length > 0)
            {
                userList.Gamertags.ShouldNotBeNull(nameof(userList.Gamertags));
                foreach (var gamertag in userList.Gamertags)
                {
                    gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));
                }

                if (useBackgroundProcessing)
                {
                    var response = await this.AddUsersToGroupUseBackgroundProcessing(userGroupId, userList.Gamertags).ConfigureAwait(false);
                    return response;
                }
                else
                {
                    var response = await this.AddUsersToUserGroupAsync(userGroupId, userList.Gamertags).ConfigureAwait(false);
                    return this.Ok(response);
                }
            }
            else
            {
                throw new InvalidArgumentsStewardException($"No player gamertags or xuids provided.");
            }
        }

        /// <summary>
        ///    Remove users from a user group. Can be done with either xuids or gamertags. Can also be done using a background job.
        /// </summary>
        [HttpPost("{userGroupId}/remove")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Delete, StewardSubject.UserGroup)]
        public async Task<IActionResult> RemoveUsersFromGroup(int userGroupId, [FromQuery] bool useBackgroundProcessing, [FromBody] BasicPlayerList userList)
        {
            // Greater than 0 blocks removing users from the "All" group
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));

            // Check if both xuids and gamertags were specified. Will be a valid request in the future. (PBI #1290729)
            if (userList.Xuids != null && userList.Xuids.Length > 0 &&
                userList.Gamertags != null && userList.Gamertags.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Providing both Xuids and Gamertags is not supported.");
            }

            if (userList.Xuids != null && userList.Xuids.Length > 0)
            {
                userList.Xuids.EnsureValidXuids();

                if (useBackgroundProcessing)
                {
                    var response = await this.RemoveUsersFromGroupUseBackgroundProcessing(userGroupId, userList.Xuids).ConfigureAwait(false);
                    return response;
                }
                else
                {
                    var response = await this.RemoveUsersFromUserGroupAsync(userGroupId, userList.Xuids).ConfigureAwait(false);
                    return this.Ok(response);
                }
            }
            else if (userList.Gamertags != null && userList.Gamertags.Length > 0)
            {
                userList.Gamertags.ShouldNotBeNull(nameof(userList.Gamertags));
                foreach (var gamertag in userList.Gamertags)
                {
                    gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));
                }

                if (useBackgroundProcessing)
                {
                    var response = await this.RemoveUsersFromGroupUseBackgroundProcessing(userGroupId, userList.Gamertags).ConfigureAwait(false);
                    return response;
                }
                else
                {
                    var response = await this.RemoveUsersFromUserGroupAsync(userGroupId, userList.Gamertags).ConfigureAwait(false);
                    return this.Ok(response);
                }
            }
            else
            {
                throw new InvalidArgumentsStewardException($"No player gamertags or xuids provided.");
            }
        }

        /// <summary>
        ///    Remove every users from a user group.
        /// </summary>
        [HttpPost("{userGroupId}/removeAllUsers")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Delete)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.DeleteAll, StewardSubject.UserGroup)]
        public async Task<IActionResult> RemoveAllUsersFromGroup(int userGroupId)
        {
            try
            {
                // Greater than 0 blocks removing users from the "All" group
                userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));

            await this.Services.UserManagementService.ClearUserGroup(userGroupId).ConfigureAwait(false);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Remove all users from user group failed.", ex);
            }
        }

        // Add users to a user group using xuids
        private async Task<IList<BasicPlayer>> AddUsersToUserGroupAsync(int groupId, IList<ulong> xuids)
        {
            var response = new List<BasicPlayer>();
            var groups = new int[] { groupId };
            var failedXuids = new List<string>();
            var correlationId = Guid.NewGuid().ToString();
            Exception lastException = null;

            foreach (var xuid in xuids)
            {
                var userGroupManagementResponse = new BasicPlayer() { Xuid = xuid };

                try
                {
                    await this.Services.UserManagementService.AddToUserGroups(xuid, groups).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    failedXuids.Add(xuid.ToString());
                    var errorMessage = $"Failed to add user {xuid} to group {groupId} (cid:{correlationId})";
                    var error = new StewardError(errorMessage, ex);
                    userGroupManagementResponse.Error = error;
                    lastException = ex;
                }

                response.Add(userGroupManagementResponse);
            }

            if (failedXuids.Any() && lastException != null)
            {
                var appInsightErrorMessage = $"Failed to remove user(s) {string.Join(", ", failedXuids.ToArray())} from group {groupId} (cid:{correlationId})";
                this.loggingService.LogException(new UserGroupManagementAppInsightsException(appInsightErrorMessage, lastException));
            }

            return response;
        }

        // Add users to a user group using xuids and a background job.
        private async Task<CreatedResult> AddUsersToGroupUseBackgroundProcessing(int userGroupId, IList<ulong> xuids)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var jobId = await this.AddJobIdToHeaderAsync(xuids.ToJson(), requesterObjectId, $"Woodstock Add Users to User Group: {xuids.Count} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.AddUsersToUserGroupAsync(userGroupId, xuids).ConfigureAwait(false);

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

        // Remove users from a user group using xuids.
        private async Task<IList<BasicPlayer>> RemoveUsersFromUserGroupAsync(int groupId, IList<ulong> xuids)
        {
            var response = new List<BasicPlayer>();
            var groups = new int[] { groupId };
            var failedXuids = new List<string>();
            var correlationId = Guid.NewGuid().ToString();
            Exception lastException = null;

            foreach (var xuid in xuids)
            {
                var userGroupManagementResponse = new BasicPlayer() { Xuid = xuid };

                try
                {
                    await this.Services.UserManagementService.RemoveFromUserGroups(xuid, groups).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    failedXuids.Add(xuid.ToString());
                    var errorMessage = $"Failed to remove user {xuid} from group {groupId} (cid:{correlationId})";
                    var error = new StewardError(errorMessage, ex);
                    userGroupManagementResponse.Error = error;
                    lastException = ex;
                }

                response.Add(userGroupManagementResponse);
            }

            if (failedXuids.Any() && lastException != null)
            {
                var appInsightErrorMessage = $"Failed to remove user(s) {string.Join(", ", failedXuids.ToArray())} from group {groupId} (cid:{correlationId})";
                this.loggingService.LogException(new UserGroupManagementAppInsightsException(appInsightErrorMessage, lastException));
            }

            return response;
        }

        // Remove users from a user group using xuids and a background job.
        private async Task<CreatedResult> RemoveUsersFromGroupUseBackgroundProcessing(int userGroupId, IList<ulong> xuids)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            // Greater than 0 blocks removing users from the "All" group
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));
            xuids.EnsureValidXuids();

            var jobId = await this.AddJobIdToHeaderAsync(xuids.ToJson(), requesterObjectId, $"Woodstock Remove Users from User Group: {xuids.Count} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.RemoveUsersFromUserGroupAsync(userGroupId, xuids).ConfigureAwait(false);

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

        // Remove users from a user group using gamertags.
        private async Task<IList<BasicPlayer>> RemoveUsersFromUserGroupAsync(int groupId, IList<string> gamertags)
        {
            var response = new List<BasicPlayer>();
            var groups = new int[] { groupId };
            var failedGamertags = new List<string>();
            var correlationId = Guid.NewGuid().ToString();
            Exception lastException = null;

            foreach (var gamertag in gamertags)
            {
                var userGroupManagementResponse = new BasicPlayer() { Gamertag = gamertag };

                try
                {
                    await this.Services.UserManagementService.RemoveFromUserGroupsByGamertag(gamertag, groups).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    failedGamertags.Add(gamertag);
                    var errorMessage = $"Failed to remove user {gamertag} from group {groupId} (cid:{correlationId})";
                    var error = new StewardError(errorMessage, ex);
                    userGroupManagementResponse.Error = error;
                    lastException = ex;
                }

                response.Add(userGroupManagementResponse);
            }

            if (failedGamertags.Any() && lastException != null)
            {
                var appInsightErrorMessage = $"Failed to remove user(s) {string.Join(", ", failedGamertags.ToArray())} from group {groupId} (cid:{correlationId})";
                this.loggingService.LogException(new UserGroupManagementAppInsightsException(appInsightErrorMessage, lastException));
            }

            return response;
        }

        // Add users to a user group using gamertags.
        private async Task<IList<BasicPlayer>> AddUsersToUserGroupAsync(int groupId, IList<string> gamertags)
        {
            var response = new List<BasicPlayer>();
            var groups = new int[] { groupId };
            var failedGamertags = new List<string>();
            var correlationId = Guid.NewGuid().ToString();
            Exception lastException = null;

            foreach (var gamertag in gamertags)
            {
                var userGroupManagementResponse = new BasicPlayer() { Gamertag = gamertag };

                try
                {
                    await this.Services.UserManagementService.AddToUserGroupsByGamertag(gamertag, groups).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    failedGamertags.Add(gamertag);
                    var errorMessage = $"Failed to add user {gamertag} to group {groupId} (cid:{correlationId})";
                    var error = new StewardError(errorMessage);
                    userGroupManagementResponse.Error = error;
                    lastException = ex;
                }

                response.Add(userGroupManagementResponse);
            }

            if (failedGamertags.Any() && lastException != null)
            {
                var appInsightErrorMessage = $"Failed to remove user(s) {string.Join(", ", failedGamertags.ToArray())} from group {groupId} (cid:{correlationId})";
                this.loggingService.LogException(new UserGroupManagementAppInsightsException(appInsightErrorMessage, lastException));
            }

            return response;
        }

        // Add users to a user group using gamertags and a background job.
        private async Task<CreatedResult> AddUsersToGroupUseBackgroundProcessing(int userGroupId, IList<string> gamertags)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            // Greater than 0 blocks adding users to the "All" group
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));
            gamertags.ShouldNotBeNull(nameof(gamertags));
            foreach (var gamertag in gamertags)
            {
                gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));
            }

            var jobId = await this.AddJobIdToHeaderAsync(gamertags.ToJson(), requesterObjectId, $"Woodstock Add Users to User Group: {gamertags.Count} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.AddUsersToUserGroupAsync(userGroupId, gamertags).ConfigureAwait(false);

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

        // Remove users from a user group using gamertags and a background job.
        private async Task<CreatedResult> RemoveUsersFromGroupUseBackgroundProcessing(int userGroupId, IList<string> gamertags)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            // Greater than 0 blocks removing users from the "All" group
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));
            gamertags.ShouldNotBeNull(nameof(gamertags));
            foreach (var gamertag in gamertags)
            {
                gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));
            }

            var jobId = await this.AddJobIdToHeaderAsync(gamertags.ToJson(), requesterObjectId, $"Woodstock Remove Users from User Group: {gamertags.Count} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.RemoveUsersFromUserGroupAsync(userGroupId, gamertags).ConfigureAwait(false);

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
