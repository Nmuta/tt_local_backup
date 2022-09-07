using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.SystemFunctions;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Group
{
    /// <summary>
    ///     Player messages steelhead controller.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/group/{groupId}/messages")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [Authorize]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Target.LspGroup, Topic.Messaging)]
    public class MessagesController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private const int DefaultMaxResults = 100;
        private const int DefaultMaxuserGroupResults = 5_000;

        private readonly INotificationHistoryProvider notificationHistoryProvider;
        private readonly ISteelheadServiceManagementProvider serviceManagementProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="MessagesController"/> class.
        /// </summary>
        public MessagesController(
            INotificationHistoryProvider notificationHistoryProvider,
            ISteelheadServiceManagementProvider serviceManagementProvider,
            IMapper mapper)
        {
            notificationHistoryProvider.ShouldNotBeNull(nameof(notificationHistoryProvider));
            serviceManagementProvider.ShouldNotBeNull(nameof(serviceManagementProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.notificationHistoryProvider = notificationHistoryProvider;
            this.serviceManagementProvider = serviceManagementProvider;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets all user group message.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<UserGroupNotification>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Lookup | ActionAreaLogTags.Notification)]
        public async Task<IActionResult> GetUserGroupMessages(
            int groupId,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var notifications = new List<UserGroupNotification>();
            try
            {
                var response = await this.Services.NotificationManagementService.GetAllUserGroupMessages(
                    groupId,
                    maxResults).ConfigureAwait(true);

                notifications.AddRange(this.mapper.Map<IList<UserGroupNotification>>(response.userGroupMessages));
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException(
                    $"Failed to retrieve all messages for user group: {groupId}.", ex);
            }

            return this.Ok(notifications);
        }

        /// <summary>
        ///     Sends user group message.
        /// </summary>
        [HttpPost]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200, type: typeof(MessageSendResult<int>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Create | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.Add, StewardSubject.GroupMessages)]
        public async Task<IActionResult> SendGroupNotifications(
            int groupId,
            [FromBody] LspGroupCommunityMessage communityMessage)
        {
            communityMessage.ShouldNotBeNull(nameof(communityMessage));
            communityMessage.Message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(communityMessage.Message));
            communityMessage.Message.ShouldBeUnderMaxLength(512, nameof(communityMessage.Message));
            communityMessage.ExpireTimeUtc.IsAfterOrThrows(communityMessage.StartTimeUtc, nameof(communityMessage.ExpireTimeUtc), nameof(communityMessage.StartTimeUtc));

            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            // Verify group exists
            var groups = await this.serviceManagementProvider.GetUserGroupsAsync(this.Services).ConfigureAwait(true);
            if (groups.All(x => x.Id != groupId))
            {
                throw new InvalidArgumentsStewardException($"Group ID: {groupId} could not be found.");
            }

            var forzaDeviceType = this.mapper.Map<ForzaLiveDeviceType>(communityMessage.DeviceType);
            Guid notificationId = Guid.Empty;
            var messageResponse = new MessageSendResult<int>
            {
                PlayerOrLspGroup = groupId,
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId
            };

            try
            {
                var response = await this.Services.NotificationManagementService.SendGroupMessageNotification(
                    groupId,
                    communityMessage.Message,
                    communityMessage.ExpireTimeUtc,
                    forzaDeviceType != ForzaLiveDeviceType.Invalid,
                    forzaDeviceType,
                    communityMessage.StartTimeUtc).ConfigureAwait(true);

                notificationId = response.notificationId;
                messageResponse.NotificationId = response.notificationId;
                messageResponse.Error = null;
            }
            catch
            {
                messageResponse.Error = new ServicesFailureStewardError($"Failed to send message to user group. (groupId: {groupId})");
            }

            // Log message event to notification history
            try
            {
                var notificationInfo = await this.Services.NotificationManagementService.GetUserGroupMessage(notificationId)
                    .ConfigureAwait(false);

                var notificationHistory = new NotificationHistory
                {
                    Id = notificationId.ToString(),
                    Title = TitleConstants.SteelheadCodeName,
                    Message = communityMessage.Message,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = groupId.ToString(CultureInfo.InvariantCulture),
                    Type = notificationInfo.userGroupMessage.NotificationType,
                    RecipientType = GiftIdentityAntecedent.LspGroupId.ToString(),
                    DeviceType = communityMessage.DeviceType.ToString(),
                    GiftType = GiftType.None.ToString(),
                    BatchReferenceId = string.Empty,
                    Action = NotificationAction.Send.ToString(),
                    Endpoint = this.Services.Endpoint,
                    CreatedDateUtc = communityMessage.StartTimeUtc,
                    ExpireDateUtc = communityMessage.ExpireTimeUtc,
                };

                await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(notificationHistory)
                    .ConfigureAwait(false);
            }
            catch
            {
                messageResponse.Error = new ServicesFailureStewardError($"Successfully sent message; Failed to log send message event to Kusto. (groupId: {groupId})");
            }

            return this.Ok(messageResponse);
        }

        /// <summary>
        ///     Edits group message.
        /// </summary>
        [HttpPost("{messageId}")]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.GroupMessages)]
        public async Task<IActionResult> EditGroupMessage(
            int groupId,
            string messageId,
            [FromBody] LspGroupCommunityMessage editParameters)
        {
            editParameters.ShouldNotBeNull(nameof(editParameters));
            editParameters.Message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(editParameters.Message));
            editParameters.Message.ShouldBeUnderMaxLength(512, nameof(editParameters.Message));
            editParameters.ExpireTimeUtc.IsAfterOrThrows(editParameters.StartTimeUtc, nameof(editParameters.ExpireTimeUtc), nameof(editParameters.StartTimeUtc));

            if (!Guid.TryParse(messageId, out var messageIdAsGuid))
            {
                throw new BadRequestStewardException($"Message ID could not be parsed as GUID. (messageId: {messageId})");
            }

            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            var response = await this.Services.NotificationManagementService.GetUserGroupMessage(messageIdAsGuid).ConfigureAwait(true);
            var message = response.userGroupMessage;
            if (message.NotificationType != "CommunityMessageNotification")
            {
                throw new FailedToSendStewardException(
                    $"Cannot edit notification of type: {message.NotificationType}.");
            }

            var forzaDeviceType = this.mapper.Map<ForzaLiveDeviceType>(editParameters.DeviceType);
            var editParams = new ForzaCommunityMessageNotificationEditParameters
            {
                ForceExpire = false,
                Message = editParameters.Message,
                ExpirationDate = editParameters.ExpireTimeUtc,
                HasDeviceType = forzaDeviceType != ForzaLiveDeviceType.Invalid,
                DeviceType = forzaDeviceType
            };

            try
            {
                await this.Services.NotificationManagementService.EditGroupNotification(messageIdAsGuid, editParams)
                    .ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to edit user group message. (messageId: {messageIdAsGuid}) (groupId: {groupId})", ex);
            }

            try
            {
                var notificationInfo = await this.Services.NotificationManagementService.GetUserGroupMessage(messageIdAsGuid).ConfigureAwait(false);

                var notificationHistory = new NotificationHistory
                {
                    Id = messageId.ToString(),
                    Title = TitleConstants.SteelheadCodeName,
                    Message = editParameters.Message,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = notificationInfo.userGroupMessage.GroupId.ToString(CultureInfo.InvariantCulture),
                    Type = notificationInfo.userGroupMessage.NotificationType,
                    RecipientType = GiftIdentityAntecedent.LspGroupId.ToString(),
                    DeviceType = editParameters.DeviceType.ToString(),
                    GiftType = GiftType.None.ToString(),
                    BatchReferenceId = string.Empty,
                    Action = NotificationAction.Edit.ToString(),
                    Endpoint = this.Services.Endpoint,
                    CreatedDateUtc = editParameters.StartTimeUtc,
                    ExpireDateUtc = editParameters.ExpireTimeUtc
                };

                await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(
                    notificationHistory).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Successfully edited message; Failed to log edit event to Kusto. (messageId: {messageId}) (groupId: {groupId})", ex);
            }

            return this.Ok();
        }

        /// <summary>
        ///     Deletes group message.
        /// </summary>
        [HttpDelete("{messageId}")]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Delete | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.GroupMessages)]
        public async Task<IActionResult> DeleteGroupMessage(int groupId, string messageId)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            if (!Guid.TryParse(messageId, out var messageIdAsGuid))
            {
                throw new BadRequestStewardException($"Message ID could not be parsed as GUID. (messageId: {messageId})");
            }

            var response = await this.Services.NotificationManagementService.GetUserGroupMessage(messageIdAsGuid).ConfigureAwait(true);
            var forzaMessage = response.userGroupMessage;

            var editParams = new ForzaCommunityMessageNotificationEditParameters
            {
                ForceExpire = true,
                Message = string.Empty,
                ExpirationDate = DateTime.UtcNow,
                HasDeviceType = false,
                DeviceType = ForzaLiveDeviceType.Invalid
            };

            try
            {

                await this.Services.NotificationManagementService.EditGroupNotification(messageIdAsGuid, editParams)
                    .ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to delete user group message. (messageId: {messageIdAsGuid}) (groupId: {groupId})", ex);
            }

            try
            {
                var deivceType = this.mapper.Map<DeviceType>(forzaMessage.DeviceType);
                var notificationHistory = new NotificationHistory
                {
                    Id = messageId.ToString(),
                    Title = TitleConstants.SteelheadCodeName,
                    Message = forzaMessage.Message,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = groupId.ToString(CultureInfo.InvariantCulture),
                    Type = forzaMessage.NotificationType,
                    RecipientType = GiftIdentityAntecedent.LspGroupId.ToString(),
                    DeviceType = deivceType.ToString(),
                    GiftType = GiftType.None.ToString(),
                    BatchReferenceId = string.Empty,
                    Action = NotificationAction.Delete.ToString(),
                    Endpoint = this.Services.Endpoint,
                    CreatedDateUtc = DateTime.UtcNow,
                    ExpireDateUtc = DateTime.UtcNow
                };

                await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(
                    notificationHistory).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Successfully deleted message; Failed to log delete event to Kusto. (messageId: {messageIdAsGuid}) (groupId: {groupId})", ex);
            }

            return this.Ok();
        }
    }
}
