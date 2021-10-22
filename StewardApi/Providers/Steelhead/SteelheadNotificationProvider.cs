using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FM8.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Steelhead
{
    /// <inheritdoc />
    public sealed class SteelheadNotificationProvider : ISteelheadNotificationProvider
    {
        private readonly ISteelheadService steelheadService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SteelheadNotificationProvider"/> class.
        /// </summary>
        public SteelheadNotificationProvider(
            ISteelheadService steelheadService,
            IMapper mapper)
        {
            steelheadService.ShouldNotBeNull(nameof(steelheadService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.steelheadService = steelheadService;
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

            try
            {
                var notifications = await this.steelheadService.LiveOpsRetrieveForUserAsync(
                    xuid,
                    maxResults,
                    endpoint).ConfigureAwait(false);

                return this.mapper.Map<IList<Notification>>(notifications.results);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException(
                    $"Notifications for player with XUID: {xuid} could not be found.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<UserGroupNotification>> GetGroupNotificationsAsync(
            int groupId,
            int maxResults,
            string endpoint)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));

            try
            {
                var notifications = await this.steelheadService.GetUserGroupNotificationAsync(
                    groupId,
                    maxResults,
                    endpoint).ConfigureAwait(false);

                return this.mapper.Map<IList<UserGroupNotification>>(notifications.userGroupMessages);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException(
                    $"An error occurred while querying notifications for LSP group with ID: {groupId}.", ex);
            }
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

            try
            {
                var results = await this.steelheadService.SendMessageNotificationToMultipleUsersAsync(
                    xuids,
                    message,
                    expireTimeUtc,
                    endpoint).ConfigureAwait(false);

                return this.mapper.Map<IList<MessageSendResult<ulong>>>(results.messageSendResults);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException("Notifications failed to send.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<MessageSendResult<int>> SendGroupNotificationAsync(
            int groupId,
            string message,
            DateTime expireTimeUtc,
            DeviceType deviceType,
            string endpoint)
        {
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));
            endpoint.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpoint));
            groupId.ShouldBeGreaterThanValue(-1, nameof(groupId));

            var messageResponse = new MessageSendResult<int>();
            messageResponse.PlayerOrLspGroup = groupId;
            messageResponse.IdentityAntecedent = GiftIdentityAntecedent.LspGroupId;
            var forzaDeviceType = this.mapper.Map<ForzaLiveDeviceType>(deviceType);

            try
            {
                await this.steelheadService.SendGroupMessageNotificationAsync(
                    groupId,
                    message,
                    expireTimeUtc,
                    forzaDeviceType,
                    endpoint).ConfigureAwait(false);

                messageResponse.Error = null;
            }
            catch
            {
                messageResponse.Error = new ServicesFailureStewardError(
                    $"LSP failed to message group with ID: {groupId}");
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
        }

        /// <inheritdoc />
        public async Task EditGroupNotificationAsync(
            Guid notificationId,
            string message,
            DateTime expireTimeUtc,
            DeviceType deviceType,
            string endpoint)
        {
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));

            var forzaDeviceType = this.mapper.Map<ForzaLiveDeviceType>(deviceType);
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
                throw new FailedToSendStewardException("Notifications failed to send.", ex);
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
        }

        /// <inheritdoc />
        public async Task DeleteGroupNotificationAsync(Guid notificationId, string endpoint)
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
                await this.steelheadService.EditGroupNotificationAsync(
                    notificationId,
                    editParams,
                    endpoint).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"LSP failed to delete group message with Notification ID: {notificationId}", ex);
            }
        }
    }
}
