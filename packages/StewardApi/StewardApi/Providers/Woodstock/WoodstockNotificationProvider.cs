﻿using AutoMapper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using ServicesLiveOps = Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockNotificationProvider : IWoodstockNotificationProvider
    {
        private readonly IWoodstockService woodstockService;
        private readonly INotificationHistoryProvider notificationHistoryProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockNotificationProvider"/> class.
        /// </summary>
        public WoodstockNotificationProvider(
            IWoodstockService woodstockService,
            INotificationHistoryProvider notificationHistoryProvider,
            IMapper mapper)
        {
            woodstockService.ShouldNotBeNull(nameof(woodstockService));
            notificationHistoryProvider.ShouldNotBeNull(nameof(notificationHistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.woodstockService = woodstockService;
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

            ServicesLiveOps.NotificationsManagementService.LiveOpsRetrieveForUserOutput notifications = null;

            try
            {
                notifications = await this.woodstockService.LiveOpsRetrieveForUserAsync(
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

            ServicesLiveOps.NotificationsManagementService.GetAllUserGroupMessagesOutput notifications = null;

            try
            {
                notifications = await this.woodstockService.GetUserGroupNotificationsAsync(
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
        public async Task<UserGroupNotification> GetGroupNotificationAsync(
            Guid notificationId,
            string endpoint)
        {
            ServicesLiveOps.NotificationsManagementService.GetUserGroupMessageOutput notification = null;

            try
            {
                notification = await this.woodstockService.GetUserGroupNotificationAsync(
                    notificationId,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException(
                    $"An error occurred while querying for LSP group notification with ID: {notificationId}.", ex);
            }

            return this.mapper.SafeMap<UserGroupNotification>(notification.userGroupMessage);
        }

        /// <inheritdoc />
        public async Task<IList<MessageSendResult<ulong>>> SendNotificationsAsync(
            IList<ulong> xuids,
            string message,
            DateTime sendTimeUtc,
            DateTime expireTimeUtc,
            string requesterObjectId,
            string endpoint)
        {
            xuids.ShouldNotBeNull(nameof(xuids));
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));

            var messageSendResults = new List<MessageSendResult<ulong>>();

            ServicesLiveOps.NotificationsManagementService.SendMessageNotificationToMultipleUsersOutput results = null;

            try
            {
                results = await this.woodstockService.SendMessageNotificationToMultipleUsersAsync(
                    xuids,
                    message,
                    sendTimeUtc,
                    expireTimeUtc,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Notifications failed to send.", ex);
            }

            messageSendResults = this.mapper.SafeMap<IList<MessageSendResult<ulong>>>(results.messageSendResults).ToList();

            var batchReferenceId = Guid.NewGuid();
            foreach (var messageResult in messageSendResults)
            {
                try
                {
                    var notificationInfo = await this.woodstockService
                        .GetPlayerNotificationAsync(messageResult.PlayerOrLspGroup, messageResult.NotificationId, endpoint).ConfigureAwait(false);

                    var notificationHistory = new NotificationHistory
                    {
                        Id = notificationInfo.notification.Id.ToString(),
                        Title = TitleConstants.WoodstockCodeName,
                        Message = notificationInfo.notification.Message,
                        RequesterObjectId = requesterObjectId,
                        RecipientId = messageResult.PlayerOrLspGroup.ToString(CultureInfo.InvariantCulture),
                        Type = notificationInfo.notification.NotificationType,
                        RecipientType = GiftIdentityAntecedent.Xuid.ToString(),
                        DeviceType = DeviceType.All.ToString(),
                        GiftType = GiftType.None.ToString(),
                        BatchReferenceId = batchReferenceId.ToString(),
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
                    messageResult.Error = new ServicesFailureStewardError("Message successfully sent; Logging of send event failed.");
                }
            }

            return messageSendResults;
        }

        /// <inheritdoc />
        public async Task<MessageSendResult<int>> SendGroupNotificationAsync(
            int groupId,
            string message,
            DateTime sendTimeUtc,
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
            var forzaDeviceType = this.mapper.SafeMap<ServicesLiveOps.ForzaLiveDeviceType>(deviceType);

            try
            {
                var response = await this.woodstockService.SendGroupMessageNotificationAsync(
                    groupId,
                    message,
                    sendTimeUtc,
                    expireTimeUtc,
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
                var notificationInfo = await this.woodstockService
                    .GetUserGroupNotificationAsync(notificationId, endpoint).ConfigureAwait(false);

                var notificationHistory = new NotificationHistory
                {
                    Id = notificationId.ToString(),
                    Title = TitleConstants.WoodstockCodeName,
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
            string requesterObjectId,
            string endpoint)
        {
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var editParams = new ServicesLiveOps.ForzaCommunityMessageNotificationEditParameters
            {
                ForceExpire = false,
                Message = message,
                ExpirationDate = expireTimeUtc,
                HasDeviceType = false,
                DeviceType = ServicesLiveOps.ForzaLiveDeviceType.Invalid
            };

            try
            {
                await this.woodstockService.EditNotificationAsync(
                    notificationId,
                    xuid,
                    editParams,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Notification with ID: {notificationId} failed to update.", ex);
            }

            try
            {
                var notificationInfo = await this.woodstockService
                    .GetPlayerNotificationAsync(xuid, notificationId, endpoint).ConfigureAwait(false);

                var notificationHistory = new NotificationHistory
                {
                    Id = notificationId.ToString(),
                    Title = TitleConstants.WoodstockCodeName,
                    Message = message,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = xuid.ToString(DateTimeFormatInfo.InvariantInfo),
                    Type = notificationInfo.notification.NotificationType,
                    RecipientType = GiftIdentityAntecedent.Xuid.ToString(),
                    DeviceType = DeviceType.All.ToString(),
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

            var forzaDeviceType = this.mapper.SafeMap<ServicesLiveOps.ForzaLiveDeviceType>(deviceType);
            var editParams = new ServicesLiveOps.ForzaCommunityMessageNotificationEditParameters
            {
                ForceExpire = false,
                Message = message,
                ExpirationDate = expireTimeUtc,
                HasDeviceType = forzaDeviceType != ServicesLiveOps.ForzaLiveDeviceType.Invalid,
                DeviceType = forzaDeviceType
            };

            try
            {
                await this.woodstockService.EditGroupNotificationAsync(
                    notificationId,
                    editParams,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Notification with ID: {notificationId} failed to update.", ex);
            }

            try
            {
                var notificationInfo = await this.woodstockService
                    .GetUserGroupNotificationAsync(notificationId, endpoint).ConfigureAwait(false);

                var notificationHistory = new NotificationHistory
                {
                    Id = notificationId.ToString(),
                    Title = TitleConstants.WoodstockCodeName,
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
        public async Task DeleteNotificationAsync(
            Guid notificationId,
            ulong xuid,
            string requesterObjectId,
            string endpoint)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            ServicesLiveOps.ForzaLiveOpsNotification notification;
            var editParams = new ServicesLiveOps.ForzaCommunityMessageNotificationEditParameters
            {
                ForceExpire = true,
                Message = string.Empty,
                ExpirationDate = DateTime.UtcNow,
                HasDeviceType = false,
                DeviceType = ServicesLiveOps.ForzaLiveDeviceType.Invalid
            };

            try
            {
                var notificationInfo = await this.woodstockService
                    .GetPlayerNotificationAsync(xuid, notificationId, endpoint).ConfigureAwait(false);

                await this.woodstockService.EditNotificationAsync(
                    notificationId,
                    xuid,
                    editParams,
                    endpoint).ConfigureAwait(false);

                notification = notificationInfo.notification;
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"LSP failed to delete message with Notification ID: {notificationId}", ex);
            }

            try
            {
                var notificationHistory = new NotificationHistory
                {
                    Id = notificationId.ToString(),
                    Title = TitleConstants.WoodstockCodeName,
                    Message = notification.Message,
                    RequesterObjectId = requesterObjectId,
                    RecipientId = xuid.ToString(CultureInfo.InvariantCulture),
                    Type = notification.NotificationType,
                    RecipientType = GiftIdentityAntecedent.Xuid.ToString(),
                    DeviceType = DeviceType.All.ToString(),
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

        /// <inheritdoc />
        public async Task DeleteGroupNotificationAsync(Guid notificationId, string requesterObjectId, string endpoint)
        {
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            DeviceType deviceType;
            ServicesLiveOps.ForzaUserGroupMessage groupMessage;
            var editParams = new ServicesLiveOps.ForzaCommunityMessageNotificationEditParameters
            {
                ForceExpire = true,
                Message = string.Empty,
                ExpirationDate = DateTime.UtcNow,
                HasDeviceType = false,
                DeviceType = ServicesLiveOps.ForzaLiveDeviceType.Invalid
            };

            try
            {
                var notificationInfo = await this.woodstockService
                    .GetUserGroupNotificationAsync(notificationId, endpoint).ConfigureAwait(false);

                await this.woodstockService.EditGroupNotificationAsync(
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
                    Title = TitleConstants.WoodstockCodeName,
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
