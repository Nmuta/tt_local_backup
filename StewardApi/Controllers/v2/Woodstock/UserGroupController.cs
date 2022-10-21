﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using static Turn10.Services.LiveOps.FH5_main.Generated.UserManagementService;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.UserGroup
{
    /// <summary>
    ///     Handles requests for Woodstock user groups.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/usergroup")]
    [Authorize]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.LspGroup, Target.Details, Dev.ReviseTags)]
    public class UserGroupController : V2WoodstockControllerBase
    {
        // "All Users", "VIP", "ULTIMATE_VIP"
        private static readonly List<int> LargeUserGroups = new List<int>() { 0, 1, 2 };

        private readonly ILoggingService loggingService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UserGroupController"/> class.
        /// </summary>
        public UserGroupController(
            ILoggingService loggingService,
            IMapper mapper)
        {
            loggingService.ShouldNotBeNull(nameof(loggingService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.loggingService = loggingService;
            this.mapper = mapper;
        }

        /// <summary>
        ///    Get bulk operation status.
        /// </summary>
        [HttpGet("{userGroupId}/bulkOperationStatus/{operationId}")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.CommunityManager, UserRole.MediaTeam, UserRole.HorizonDesigner)]
        [SwaggerResponse(200, type: typeof(UserGroupBulkOperationStatusOutput))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        public async Task<IActionResult> GetBulkOperationStatus(int userGroupId, string operationId, ForzaBulkOperationType bulkOperationType)
        {
            if (!Guid.TryParse(operationId, out var parsedOperationId))
            {
                throw new BadRequestStewardException($"Operation ID could not be parsed as GUID. (operationId: {operationId})");
            }

            GetUserGroupBulkOperationStatusOutput bulkOperationStatusOutput;

            try
            {
                bulkOperationStatusOutput = await this.Services.UserManagementService.GetUserGroupBulkOperationStatus(bulkOperationType, userGroupId, parsedOperationId).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get user group bulk operation status. (userGroupId: {userGroupId}) (operationId: {parsedOperationId}) (bulkOperationType: {bulkOperationType})", ex);
            }

            var userGroupOperationStatus = this.mapper.SafeMap<UserGroupBulkOperationStatusOutput>(bulkOperationStatusOutput.status);

            return this.Ok(userGroupOperationStatus);
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
                throw new UnknownFailureStewardException($"Get users from user group failed. (userGroupId: {userGroupId}) (startIndex: {startIndex}) (maxResult: {maxResults})", ex);
            }
        }

        /// <summary>
        ///    Create user group.
        /// </summary>
        [HttpPost("{userGroupName}")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.CommunityManager, UserRole.MediaTeam, UserRole.HorizonDesigner)]
        [SwaggerResponse(200, type: typeof(LspGroup))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Create)]
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
                throw new UnknownFailureStewardException($"Create user group failed. (userGroupName: {userGroupName})", ex);
            }
        }

        /// <summary>
        ///    Add users to a user group. Can be done with either xuids or gamertags.
        /// </summary>
        [HttpPost("{userGroupId}/add")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.CommunityManager, UserRole.MediaTeam, UserRole.HorizonDesigner)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.UserGroup)]
        public async Task<IActionResult> AddUsersToGroup(int userGroupId, [FromQuery] bool useBulkProcessing, [FromBody] UpdateUserGroupInput userList)
        {
            // Greater than 0 blocks adding users to the "All" group
            userGroupId.ShouldBeGreaterThanValue(0, nameof(userGroupId));

            userList.ValidateUserList();

            if (useBulkProcessing)
            {
                var response = await this.AddOrRemoveUsersToGroupUseBulkProcessing(userGroupId, userList, ForzaBulkOperationType.Add).ConfigureAwait(false);
                return this.Ok(response);
            }
            else
            {
                var response = await this.AddUsersToUserGroupAsync(userGroupId, userList).ConfigureAwait(false);
                return this.Ok(response);
            }
        }

        /// <summary>
        ///    Remove users from a user group. Can be done with either xuids or gamertags.
        /// </summary>
        [HttpPost("{userGroupId}/remove")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.CommunityManager, UserRole.MediaTeam, UserRole.HorizonDesigner)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Delete, StewardSubject.UserGroup)]
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
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Delete)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.DeleteAll, StewardSubject.UserGroup)]
        public async Task<IActionResult> RemoveAllUsersFromGroup(int userGroupId)
        {
            try
            {
                // Block removing all users from All Users and VIP groups.
                userGroupId.ShouldBeGreaterThanValue(LargeUserGroups.Max(), nameof(userGroupId));

                await this.Services.UserManagementService.ClearUserGroup(userGroupId).ConfigureAwait(false);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Remove all users from user group failed. (userGroupId: {userGroupId})", ex);
            }
        }

        // Add or remove users to a user group using xuids and/or gamertags using bulk operation.
        private async Task<UserGroupBulkOperationStatusOutput> AddOrRemoveUsersToGroupUseBulkProcessing(int userGroupId, UpdateUserGroupInput userList, ForzaBulkOperationType bulkOperationType)
        {
            var userIdsFromXuids = this.mapper.SafeMap<ForzaUserIds[]>(userList.Xuids) ?? Array.Empty<ForzaUserIds>();
            var userIdsFromGtags = this.mapper.SafeMap<ForzaUserIds[]>(userList.Gamertags) ?? Array.Empty<ForzaUserIds>();
            var userIds = userIdsFromXuids.Concat(userIdsFromGtags).ToArray();

            var bulkOperationOutput = await this.Services.UserManagementService.CreateUserGroupBulkOperation(bulkOperationType, userGroupId, userIds).ConfigureAwait(false);

            return new UserGroupBulkOperationStatusOutput()
            {
                BlobId = bulkOperationOutput.statusId
            };
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
                        await this.Services.UserManagementService.AddToUserGroupsByGamertag(user.Gamertag, groups).ConfigureAwait(false);
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
