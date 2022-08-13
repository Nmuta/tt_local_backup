﻿using System;
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
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Players
{
    /// <summary>
    ///     Messaging players steelhead controller.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/players/messages")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Target.Players, Topic.Messaging)]
    public class MessagesController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;

        private readonly IActionLogger actionLogger;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="MessagesController"/> class.
        /// </summary>
        public MessagesController(
            IActionLogger actionLogger,
            IMapper mapper)
        {
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.actionLogger = actionLogger;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Sends players a message.
        /// </summary>
        [HttpPost]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200, type: typeof(IList<MessageSendResult<ulong>>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Create | ActionAreaLogTags.Notification)]
        [ManualActionLogging(CodeName, StewardAction.Add, StewardSubject.PlayerMessages)]
        public async Task<IActionResult> SendMessageToPlayers(
            [FromBody] BulkCommunityMessage communityMessage)
        {
            communityMessage.ShouldNotBeNull(nameof(communityMessage));
            //communityMessage.Xuids.EnsureValidXuids();
            communityMessage.Message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(communityMessage.Message));
            communityMessage.Message.ShouldBeUnderMaxLength(512, nameof(communityMessage.Message));
            communityMessage.Duration.ShouldBeOverMinimumDuration(
                TimeSpan.FromDays(1),
                nameof(communityMessage.Duration));
            await this.EnsurePlayersExist(this.Services, communityMessage.Xuids).ConfigureAwait(true);

            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            var expireTime = DateTime.UtcNow.Add(communityMessage.Duration);
            var notifications = new List<MessageSendResult<ulong>>();

            try
            {
                var results = await this.Services.NotificationManagementService.SendMessageNotificationToMultipleUsers(
                    communityMessage.Xuids.ToArray(),
                    communityMessage.Xuids.Count,
                    communityMessage.Message,
                    expireTime,
                    string.Empty, // Image Url is unused in Steward
                    DateTime.Now).ConfigureAwait(true);

                notifications.AddRange(this.mapper.Map<IList<MessageSendResult<ulong>>>(results.messageSendResults));
            }
            catch (Exception ex)
            {

                throw new UnknownFailureStewardException("Failed to send messages to players.", ex);
            }

            // TODO: Add notification logging for individual users Task(948868)

            var recipientXuids = notifications.Where(result => result.Error == null)
                .Select(result => Invariant($"{result.PlayerOrLspGroup}")).ToList();

            await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, recipientXuids)
                .ConfigureAwait(true);

            return this.Ok(notifications);
        }
    }
}
