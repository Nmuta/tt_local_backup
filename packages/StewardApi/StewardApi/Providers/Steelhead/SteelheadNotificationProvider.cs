using AutoMapper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <inheritdoc />
    public sealed class SteelheadNotificationProvider : ISteelheadNotificationProvider
    {
        private readonly ISteelheadService steelheadService;
        private readonly INotificationHistoryProvider notificationHistoryProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadNotificationProvider"/> class.
        /// </summary>
        public SteelheadNotificationProvider(
            ISteelheadService steelheadService,
            INotificationHistoryProvider notificationHistoryProvider,
            IMapper mapper)
        {
            steelheadService.ShouldNotBeNull(nameof(steelheadService));
            notificationHistoryProvider.ShouldNotBeNull(nameof(notificationHistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.steelheadService = steelheadService;
            this.notificationHistoryProvider = notificationHistoryProvider;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IList<Notification>> GetPlayerNotificationsAsync(
            ulong xuid,
            int maxResults,
            string endpoint)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            NotificationsManagementService.LiveOpsRetrieveForUserOutput notifications = null;

            try
            {
                notifications = await this.steelheadService.GetNotificationsForUserAsync(
                    xuid,
                    maxResults,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException(
                    $"Notifications for player with XUID: {xuid} could not be found.", ex);
            }

            return this.mapper.SafeMap<IList<Notification>>(notifications.results);
        }

        /// <inheritdoc />
        public async Task<IList<UserGroupNotification>> GetGroupNotificationsAsync(
            int groupId,
            int maxResults,
            string endpoint)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));

            NotificationsManagementService.GetAllUserGroupMessagesOutput notifications = null;

            try
            {
                notifications = await this.steelheadService.GetAllUserGroupMessagesAsync(
                    groupId,
                    maxResults,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException(
                    $"An error occurred while querying notifications for LSP group with ID: {groupId}.", ex);
            }

            return this.mapper.SafeMap<IList<UserGroupNotification>>(notifications.userGroupMessages);
        }

        /// <inheritdoc />
        public async Task<IList<MessageSendResult<ulong>>> SendNotificationsAsync(
            IList<ulong> xuids,
            string message,
            DateTime expireTimeUtc,
            string endpoint)
        {
            xuids.ShouldNotBeNull(nameof(xuids));
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            NotificationsManagementService.SendMessageNotificationToMultipleUsersOutput results = null;

            try
            {
                results = await this.steelheadService.SendMessageNotificationToMultipleUsersAsync(
                    xuids,
                    message,
                    expireTimeUtc,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Notifications failed to send.", ex);
            }

            return this.mapper.SafeMap<IList<MessageSendResult<ulong>>>(results.messageSendResults);

            // TODO Add notification logging for individual users Task(948868)
        }

        /// <inheritdoc />
        public async Task<MessageSendResult<int>> SendGroupNotificationAsync(
            int groupId,
            string message,
            DateTime expireTimeUtc,
            DeviceType deviceType,
            string requesterObjectId,
            string endpoint)
        {
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));

            Guid notificationId = Guid.Empty;
            var messageResponse = new MessageSendResult<int>
            {
                PlayerOrLspGroup = groupId,
                IdentityAntecedent = GiftIdentityAntecedent.LspGroupId
            };
            var forzaDeviceType = this.mapper.SafeMap<ForzaLiveDeviceType>(deviceType);

            try
            {
                var response = await this.steelheadService.SendGroupMessageNotificationAsync(
                    groupId,
                    message,
                    expireTimeUtc,
                    forzaDeviceType != ForzaLiveDeviceType.Invalid,
                    forzaDeviceType,
                    endpoint).ConfigureAwait(false);

                notificationId = response.notificationId;
                messageResponse.NotificationId = response.notificationId;
                messageResponse.Error = null;
            }
            catch
            {
                messageResponse.Error = new ServicesFailureStewardError(
                    $"LSP failed to message group with ID: {groupId}");
            }

            try
            {
                var notificationInfo = await this.steelheadService.GetUserGroupMessageAsync(
                    notificationId,
                    endpoint).ConfigureAwait(false);

                var notificationHistory = new NotificationHistory
                {
                    Id = notificationId.ToString(),
                    Title = TitleConstants.SteelheadCodeName,
                    Message = message,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = groupId.ToString(CultureInfo.InvariantCulture),
                    Type = notificationInfo.userGroupMessage.NotificationType,
                    RecipientType = GiftIdentityAntecedent.LspGroupId.ToString(),
                    DeviceType = deviceType.ToString(),
                    GiftType = GiftType.None.ToString(),
                    BatchReferenceId = string.Empty,
                    Action = NotificationAction.Send.ToString(),
                    Endpoint = endpoint,
                    CreatedDateUtc = DateTime.UtcNow,
                    ExpireDateUtc = expireTimeUtc
                };

                await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(notificationHistory)
                    .ConfigureAwait(false);
            }
            catch
            {
                messageResponse.Error = new ServicesFailureStewardError("Message successfully sent; Logging of send event failed.");
            }

            return messageResponse;
        }

        /// <inheritdoc />
        public async Task EditNotificationAsync(
            Guid notificationId,
            ulong xuid,
            string message,
            DateTime expireTimeUtc,
            string endpoint)
        {
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));

            var editParams = new ForzaCommunityMessageNotificationEditParameters
            {
                ForceExpire = false,
                Message = message,
                ExpirationDate = expireTimeUtc,
                HasDeviceType = false,
                DeviceType = ForzaLiveDeviceType.Invalid
            };

            try
            {
                await this.steelheadService.EditNotificationAsync(
                    notificationId,
                    xuid,
                    editParams,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Notifications failed to send.", ex);
            }

            // TODO Add notification logging for individual users Task(948868)
        }

        /// <inheritdoc />
        public async Task EditGroupNotificationAsync(
            Guid notificationId,
            string message,
            DateTime expireTimeUtc,
            DeviceType deviceType,
            string requesterObjectId,
            string endpoint)
        {
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var forzaDeviceType = this.mapper.SafeMap<ForzaLiveDeviceType>(deviceType);
            var editParams = new ForzaCommunityMessageNotificationEditParameters
            {
                ForceExpire = false,
                Message = message,
                ExpirationDate = expireTimeUtc,
                HasDeviceType = forzaDeviceType != ForzaLiveDeviceType.Invalid,
                DeviceType = forzaDeviceType
            };

            try
            {
                await this.steelheadService.EditGroupNotificationAsync(
                    notificationId,
                    editParams,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Notification with ID: {notificationId} failed to send.", ex);
            }

            try
            {
                var notificationInfo = await this.steelheadService.GetUserGroupMessageAsync(
                    notificationId,
                    endpoint).ConfigureAwait(false);

                var notificationHistory = new NotificationHistory
                {
                    Id = notificationId.ToString(),
                    Title = TitleConstants.SteelheadCodeName,
                    Message = message,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = notificationInfo.userGroupMessage.GroupId.ToString(CultureInfo.InvariantCulture),
                    Type = notificationInfo.userGroupMessage.NotificationType,
                    RecipientType = GiftIdentityAntecedent.LspGroupId.ToString(),
                    DeviceType = deviceType.ToString(),
                    GiftType = GiftType.None.ToString(),
                    BatchReferenceId = string.Empty,
                    Action = NotificationAction.Edit.ToString(),
                    Endpoint = endpoint,
                    CreatedDateUtc = DateTime.UtcNow,
                    ExpireDateUtc = expireTimeUtc
                };

                await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(
                    notificationHistory).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Message successfully edited; Logging of edit event failed.", ex);
            }
        }

        /// <inheritdoc />
        public async Task DeleteNotificationAsync(Guid notificationId, ulong xuid, string endpoint)
        {
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
                await this.steelheadService.EditNotificationAsync(
                    notificationId,
                    xuid,
                    editParams,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"LSP failed to delete message with Notification ID: {notificationId}", ex);
            }

            // TODO Add notification logging for individual users Task(948868)
        }

        /// <inheritdoc />
        public async Task DeleteGroupNotificationAsync(Guid notificationId, string requesterObjectId, string endpoint)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            DeviceType deviceType;
            ForzaUserGroupMessage groupMessage;
            var editParams = new ForzaCommunityMessageNotificationEditParameters
            {
                ForceExpire = true,
                Message = string.Empty,
                ExpirationDate = DateTime.UtcNow,
                HasDeviceType = false,
                DeviceType = ForzaLiveDeviceType.Invalid
            };

            NotificationsManagementService.GetUserGroupMessageOutput notificationInfo = null;

            try
            {
                notificationInfo = await this.steelheadService.GetUserGroupMessageAsync(
                    notificationId,
                    endpoint).ConfigureAwait(false);

                await this.steelheadService.EditGroupNotificationAsync(
                    notificationId,
                    editParams,
                    endpoint).ConfigureAwait(false);

                groupMessage = notificationInfo.userGroupMessage;
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"LSP failed to delete group message with Notification ID: {notificationId}", ex);
            }

            deviceType = this.mapper.SafeMap<DeviceType>(groupMessage.DeviceType);

            try
            {
                var notificationHistory = new NotificationHistory
                {
                    Id = notificationId.ToString(),
                    Title = TitleConstants.SteelheadCodeName,
                    Message = groupMessage.Message,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = groupMessage.GroupId.ToString(CultureInfo.InvariantCulture),
                    Type = groupMessage.NotificationType,
                    RecipientType = GiftIdentityAntecedent.LspGroupId.ToString(),
                    DeviceType = deviceType.ToString(),
                    GiftType = GiftType.None.ToString(),
                    BatchReferenceId = string.Empty,
                    Action = NotificationAction.Delete.ToString(),
                    Endpoint = endpoint,
                    CreatedDateUtc = DateTime.UtcNow,
                    ExpireDateUtc = DateTime.UtcNow
                };

                await this.notificationHistoryProvider.UpdateNotificationHistoryAsync(
                    notificationHistory).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Message successfully deleted; Logging of delete event failed.", ex);
            }
        }
    }
}
