﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Player messages steelhead controller.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/messages")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.Messaging)]
    public class MessagesController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private const int DefaultMaxResults = 100;

        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="MessagesController"/> class.
        /// </summary>
        public MessagesController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the player notifications.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<Notification>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Notification)]
        public async Task<IActionResult> GetPlayerMessages(
            ulong xuid,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));
            xuid.EnsureValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid);

            var notifications = new List<Notification>();

            NotificationsManagementService.LiveOpsRetrieveForUserOutput response = null;

            response = await this.Services.NotificationManagementService.LiveOpsRetrieveForUser(
                xuid,
                maxResults).ConfigureAwait(false);

            notifications.AddRange(this.mapper.SafeMap<IList<Notification>>(response.results));

            return this.Ok(notifications);
        }

        /// <summary>
        ///     Deletes all player notifications.
        /// </summary>
        [HttpDelete]
        [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Delete | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.PlayerMessages)]
        [Authorize(Policy = UserAttributeValues.MessagePlayer)]
        public async Task<IActionResult> DeleteAllPlayerMessages(ulong xuid)
        {
            xuid.EnsureValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid);

            await this.Services.NotificationManagementService.DeleteNotificationsForUser(xuid).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets a player notification.
        /// </summary>
        [HttpGet("{messageId}")]
        [SwaggerResponse(200, type: typeof(Notification))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Notification)]
        public async Task<IActionResult> GetPlayerMessage(string messageId, ulong xuid)
        {
            if (!Guid.TryParse(messageId, out var messageIdAsGuid))
            {
                throw new BadRequestStewardException($"Message ID could not be parsed as GUID. (messageId: {messageId})");
            }

            xuid.EnsureValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid);

            var response = await this.Services.NotificationManagementService.GetNotification(xuid, messageIdAsGuid).ConfigureAwait(true);

            var message = this.mapper.SafeMap<Notification>(response.notification);

            return this.Ok(message);
        }

        /// <summary>
        ///     Edit the player notification.
        /// </summary>
        [HttpPost("{messageId}")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerMessages)]
        [Authorize(Policy = UserAttributeValues.MessagePlayer)]
        public async Task<IActionResult> EditPlayerMessage(
            ulong xuid,
            string messageId,
            [FromBody] LocalizedMessage editParameters)
        {
            editParameters.ShouldNotBeNull(nameof(editParameters));
            editParameters.LocalizedMessageID.ShouldNotBeNullEmptyOrWhiteSpace(nameof(editParameters.LocalizedMessageID));
            editParameters.LocalizedTitleID.ShouldNotBeNullEmptyOrWhiteSpace(nameof(editParameters.LocalizedTitleID));
            editParameters.ExpireTimeUtc.IsAfterOrThrows(editParameters.StartTimeUtc, nameof(editParameters.ExpireTimeUtc), nameof(editParameters.StartTimeUtc));

            if (!Guid.TryParse(messageId, out var messageIdAsGuid))
            {
                throw new BadRequestStewardException($"Message ID could not be parsed as GUID. (messageId: {messageId})");
            }

            var localizedTitleIdAsGuid = editParameters.LocalizedTitleID.TryParseGuidElseThrow("Title could not be parsed as GUID.");
            var localizedMessageIdAsGuid = editParameters.LocalizedMessageID.TryParseGuidElseThrow("Message could not be parsed as GUID.");

            xuid.EnsureValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid);

            /* TODO: Verify notification exists and is a CommunityMessageNotification before allowing edit.
            // Tracked by: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/903790
            */
            var editParams = new ForzaCommunityMessageNotificationEditParameters
            {
                ForceExpire = false,
                TitleStringId = localizedTitleIdAsGuid,
                MessageStringId = localizedMessageIdAsGuid,
                ExpirationDate = editParameters.ExpireTimeUtc,
                HasDeviceType = false,
                DeviceType = ForzaLiveDeviceType.Invalid,
            };

            await this.Services.NotificationManagementService.EditNotification(
                messageIdAsGuid,
                xuid,
                editParams).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Deletes the player notification.
        /// </summary>
        [HttpDelete("{messageId}")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Delete | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.PlayerMessages)]
        [Authorize(Policy = UserAttributeValues.MessagePlayer)]
        public async Task<IActionResult> DeletePlayerMessage(Guid messageId, ulong xuid)
        {
            xuid.EnsureValidXuid();
            await this.Services.EnsurePlayerExistAsync(xuid);

            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            var editParams = new ForzaCommunityMessageNotificationEditParameters
            {
                ForceExpire = true,
                Message = string.Empty,
                ExpirationDate = DateTime.UtcNow,
                HasDeviceType = false,
                DeviceType = ForzaLiveDeviceType.Invalid,
            };

            await this.Services.NotificationManagementService.EditNotification(
                messageId,
                xuid,
                editParams).ConfigureAwait(true);

            // TODO Add notification logging for individual users Task(948868)

            return this.Ok();
        }
    }
}
