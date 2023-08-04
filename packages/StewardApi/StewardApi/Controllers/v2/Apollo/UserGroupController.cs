using AutoMapper;
using Forza.WebServices.FM7.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo.Services;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Apollo
{
    /// <summary>
    ///     Handles requests for Apollo user groups.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/apollo/usergroup")]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [LogTagTitle(TitleLogTags.Apollo)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Apollo, Target.LspGroup, Target.Details, Dev.ReviseTags)]
    public class UserGroupController : V2ApolloControllerBase
    {
        // "All Users", "VIP"
        private static readonly List<int> LargeUserGroups = new List<int>() { 0, 1 };

        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;
        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UserGroupController"/> class.
        /// </summary>
        public UserGroupController(
            ILoggingService loggingService,
            IMapper mapper,
            IJobTracker jobTracker,
            IScheduler scheduler)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            scheduler.ShouldNotBeNull(nameof(scheduler));

            this.jobTracker = jobTracker;
            this.scheduler = scheduler;
            this.mapper = mapper;
            this.loggingService = loggingService;
        }

        /// <summary>
        ///    Get a user group users.
        /// </summary>
        [HttpGet("{userGroupId}")]
        [SwaggerResponse(200, type: typeof(GetUserGroupUsersResponse))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Create)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Add, StewardSubject.UserGroup)]
        public async Task<IActionResult> GetUserGroupUsers(int userGroupId, int startIndex, int maxResults)
        {
            // If the userGroupId received it part of the large user group list, throw an exception
            if (LargeUserGroups.Contains(userGroupId))
            {
                throw new InvalidArgumentsStewardException($"User group provided is part of large user group list. (userGroupId: {userGroupId})");
            }

            var users = await this.Services.UserManagementService.GetUserGroupUsers(userGroupId, startIndex, maxResults).ConfigureAwait(true);

            // Temporary code until the service call returns gamertags //
            var userList = new List<BasicPlayer>();
            foreach (var xuid in users.xuids)
            {
                var userData = await this.Services.UserService.LiveOpsGetUserDataByXuid(xuid).ConfigureAwait(false);
                userList.Add(new BasicPlayer()
                {
                    Gamertag = userData.returnData.wzGamerTag,
                    Xuid = xuid,
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

        /// <summary>
        ///    Create user group.
        /// </summary>
        [HttpPost("{userGroupName}")]
        [SwaggerResponse(200, type: typeof(LspGroup))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Create)]
        [AutoActionLogging(TitleCodeName.Apollo, StewardAction.Add, StewardSubject.UserGroup)]
        [Authorize(Policy = UserAttributeValues.CreateUserGroup)]
        public async Task<IActionResult> CreateUserGroup(string userGroupName)
        {
            userGroupName.ShouldNotBeNullEmptyOrWhiteSpace(nameof(userGroupName));

            var result = await this.Services.UserManagementService.CreateUserGroup(userGroupName).ConfigureAwait(false);
            var newGroup = new LspGroup()
            {
                Id = result.groupId,
                Name = userGroupName
            };
            return this.Ok(newGroup);
        }

        /// <summary>
        ///    Add users to a user group. Can be done with either xuids or gamertags.
        /// </summary>
        [HttpPost("{userGroupId}/add")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Apollo, StewardAction.Update, StewardSubject.UserGroup)]
        [Authorize(Policy = UserAttributeValues.UpdateUserGroup)]
        public async Task<IActionResult> AddUsersToGroup(int userGroupId, [FromQuery] bool useBulkProcessing, [FromBody] UpdateUserGroupInput userList)
        {
            // Greater than 0 blocks adding users to the "All" group
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));

            userList.ValidateUserList();

            if (useBulkProcessing)
            {
                var response = await this.AddUsersToGroupUseBackgroundProcessing(userGroupId, userList).ConfigureAwait(false);
                return response;
            }
            else
            {
                var response = await this.AddUsersToUserGroupAsync(userGroupId, userList, this.Services.UserManagementService).ConfigureAwait(false);
                return this.Ok(response);
            }
        }

        /// <summary>
        ///    Remove users from a user group. Can be done with either xuids or gamertags.
        /// </summary>
        [HttpPost("{userGroupId}/remove")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Apollo, StewardAction.Delete, StewardSubject.UserGroup)]
        [Authorize(Policy = UserAttributeValues.UpdateUserGroup)]
        public async Task<IActionResult> RemoveUsersFromGroup(int userGroupId, [FromQuery] bool useBulkProcessing, [FromBody] UpdateUserGroupInput userList)
        {
            // Greater than 0 blocks removing users from the "All" group
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));

            userList.ValidateUserList();
            if (useBulkProcessing)
            {
                var response = await this.AddOrRemoveUsersToGroupUseBulkProcessing(userGroupId, userList, ForzaBulkOperationType.Remove).ConfigureAwait(false);
                return this.Ok(response);
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
        [AutoActionLogging(TitleCodeName.Apollo, StewardAction.DeleteAll, StewardSubject.UserGroup)]
        [Authorize(Policy = UserAttributeValues.RemoveAllUsersFromGroup)]
        public async Task<IActionResult> RemoveAllUsersFromGroup(int userGroupId)
        {
            // Block removing all users from All Users and VIP groups.
            userGroupId.ShouldBeGreaterThanValue(LargeUserGroups.Max(), nameof(userGroupId));

            await this.Services.UserManagementService.ClearUserGroup(userGroupId).ConfigureAwait(false);

            return this.Ok();
        }

        // Add or remove users to a user group using xuids and/or gamertags.
        private async Task<UserGroupBulkOperationStatusOutput> AddOrRemoveUsersToGroupUseBulkProcessing(int userGroupId, UpdateUserGroupInput userList, ForzaBulkOperationType bulkOperationType)
        {
            var userIdsFromXuids = this.mapper.SafeMap<ForzaUserIds[]>(userList.Xuids) ?? Array.Empty<ForzaUserIds>();
            var userIdsFromGtags = this.mapper.SafeMap<ForzaUserIds[]>(userList.Gamertags) ?? Array.Empty<ForzaUserIds>();
            var userIds = userIdsFromXuids.Concat(userIdsFromGtags).ToArray();

            // Split the userIds into chunk of 8000 and project them to a list of ForzaUserGroupOperationPage.
            // This is done because the API serializer has a limit of 8192 items in an array.
            var userIdsPages = userIds.Chunk(8000).Select(x => new ForzaUserGroupOperationPage() { userIds = x });

            var bulkOperationOutput = await this.Services.UserManagementService.CreateUserGroupBulkOperationV2(bulkOperationType, userGroupId, userIdsPages.ToArray()).ConfigureAwait(false);

            return new UserGroupBulkOperationStatusOutput()
            {
                Completed = bulkOperationOutput.changed,
                Remaining = userIds.Length - bulkOperationOutput.changed,
                FailedUsers = this.mapper.SafeMap<IEnumerable<BasicPlayer>>(bulkOperationOutput.failedUsers.SelectMany(x => x.userIds)),
            };
        }

        // Add users to a user group using xuids and/or gamertags as a background job.
        private async Task<CreatedResult> AddUsersToGroupUseBackgroundProcessing(int userGroupId, UpdateUserGroupInput userList)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var userCount = (userList.Xuids?.Length ?? 0) + (userList.Gamertags?.Length ?? 0);
            var jobId = await this.jobTracker.CreateNewJobAsync(userList.ToJson(), requesterObjectId, $"Apollo Add Users to User Group: {userCount} users added.", this.Response).ConfigureAwait(true);
            var userManagementService = this.Services.UserManagementService;

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.AddUsersToUserGroupAsync(userGroupId, userList, userManagementService).ConfigureAwait(false);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus(response);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response).ConfigureAwait(true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Background job failed {jobId}", ex));

                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }

        // Add users to a user group using xuids and/or gamertags
        private async Task<UserGroupBulkOperationStatusOutput> AddUsersToUserGroupAsync(int groupId, UpdateUserGroupInput userList, IUserManagementService userManagementService)
        {
            var failedUsers = new List<BasicPlayer>();

            var userIdsFromXuids = this.mapper.SafeMap<ForzaUserIds[]>(userList.Xuids) ?? Array.Empty<ForzaUserIds>();
            var userIdsFromGtags = this.mapper.SafeMap<ForzaUserIds[]>(userList.Gamertags) ?? Array.Empty<ForzaUserIds>();
            var userIds = userIdsFromXuids.Concat(userIdsFromGtags).ToArray();

            // Split the userIds into chunk of 1000
            var userIdsChunks = userIds.Chunk(1000);

            foreach (var userIdsChunk in userIdsChunks)
            {
                var userGroupPageArray = new ForzaUserGroupOperationPage[]
                {
                    new ForzaUserGroupOperationPage() { userIds = userIdsChunk }
                };
                var bulkOperationOutput = await userManagementService.CreateUserGroupBulkOperationV2(ForzaBulkOperationType.Add, groupId, userGroupPageArray).ConfigureAwait(false);
                failedUsers.AddRange(this.mapper.SafeMap<IEnumerable<BasicPlayer>>(bulkOperationOutput.failedUsers.SelectMany(x => x.userIds)));
            }

            return new UserGroupBulkOperationStatusOutput()
            {
                Completed = userIds.Length - failedUsers.Count,
                Remaining = failedUsers.Count,
                FailedUsers = failedUsers,
            };
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
                        await this.Services.UserManagementService.RemoveFromUserGroupsByGamertag(user.Gamertag, groups).ConfigureAwait(false);
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
    }
}
