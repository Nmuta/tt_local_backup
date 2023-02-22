﻿using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Apollo;
using Turn10.LiveOps.StewardApi.Providers.Data;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Apollo
{
    /// <summary>
    ///     Handles requests for Apollo gifting.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/Apollo/gifting")]
    [ApiController]
    [ApiVersion("2.0")]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.CommunityManager,
        UserRole.MediaTeam)]
    [SuppressMessage(
        "Microsoft.Maintainability",
        "CA1506:AvoidExcessiveClassCoupling",
        Justification = "This can't be avoided.")]
    [LogTagTitle(TitleLogTags.Apollo)]
    [StandardTags(Title.Multiple)]
    public sealed class ApolloGiftingController : V2ControllerBase
    {

        private const TitleCodeName CodeName = TitleCodeName.Apollo;

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KeyVaultUrl,
        };

        private readonly IActionLogger actionLogger;
        private readonly ILoggingService loggingService;
        private readonly IApolloPlayerDetailsProvider playerDetailsProvider;
        private readonly IApolloPlayerInventoryProvider playerInventoryProvider;
        private readonly IApolloStorefrontProvider storefrontProvider;
        private readonly IScheduler scheduler;
        private readonly IJobTracker jobTracker;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloGiftingController"/> class.
        /// </summary>
        public ApolloGiftingController(
            IActionLogger actionLogger,
            ILoggingService loggingService,
            IApolloPlayerDetailsProvider playerDetailsProvider,
            IApolloPlayerInventoryProvider playerInventoryProvider,
            IApolloStorefrontProvider storefrontProvider,
            IConfiguration configuration,
            IScheduler scheduler,
            IJobTracker jobTracker,
            IMapper mapper)
        {
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            playerDetailsProvider.ShouldNotBeNull(nameof(playerDetailsProvider));
            playerInventoryProvider.ShouldNotBeNull(nameof(playerInventoryProvider));
            storefrontProvider.ShouldNotBeNull(nameof(storefrontProvider));
            configuration.ShouldNotBeNull(nameof(configuration));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            mapper.ShouldNotBeNull(nameof(mapper));
            configuration.ShouldContainSettings(RequiredSettings);

            this.actionLogger = actionLogger;
            this.loggingService = loggingService;
            this.playerDetailsProvider = playerDetailsProvider;
            this.playerInventoryProvider = playerInventoryProvider;
            this.storefrontProvider = storefrontProvider;
            this.scheduler = scheduler;
            this.jobTracker = jobTracker;
        }

        /// <summary>
        ///     Gift players a car livery.
        /// </summary>
        [HttpPost("livery/{liveryId}/players/useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerInventories)]
        [Authorize(Policy = UserAttribute.GiftPlayer)]
        public async Task<IActionResult> GiftLiveryToPlayersUseBackgroundProcessing(string liveryId, [FromBody] GroupGift groupGift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.GiftReason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(groupGift.GiftReason));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var stringBuilder = new StringBuilder();
            foreach (var xuid in groupGift.Xuids)
            {
                if (!await this.playerDetailsProvider.DoesPlayerExistAsync(xuid, this.ApolloEndpoint.Value).ConfigureAwait(true))
                {
                    stringBuilder.Append($"{xuid} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Players with XUIDs: {stringBuilder} were not found.");
            }

            var livery = await this.storefrontProvider.GetUgcLiveryAsync(liveryId, this.ApolloEndpoint.Value).ConfigureAwait(true);
            if (livery == null)
            {
                throw new InvalidArgumentsStewardException($"Invalid livery id: {liveryId}");
            }

            var jobId = await this.jobTracker.CreateNewJobAsync(groupGift.ToJson(), requesterObjectId, $"Sunrise Gifting Livery: {groupGift.Xuids.Count} recipients.", this.Response).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.playerInventoryProvider.SendCarLiveryAsync(groupGift, livery, requesterObjectId, this.ApolloEndpoint.Value).ConfigureAwait(true);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus<ulong>(response);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response).ConfigureAwait(true);

                    var giftedXuids = response.Select(successfulResponse => Invariant($"{successfulResponse.PlayerOrLspGroup}")).ToList();

                    await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, giftedXuids)
                        .ConfigureAwait(true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Background job failed {jobId}", ex));

                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Created(
                new Uri($"{this.Request.Scheme}://{this.Request.Host}/api/v1/jobs/jobId({jobId})"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
        }

        /// <summary>
        ///     Gift a livery to an LSP user group.
        /// </summary>
        [HttpPost("livery/{liveryId}/groupId/{groupId}")]
        [SwaggerResponse(200, type: typeof(GiftResponse<int>))]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.GroupInventories)]
        [Authorize(Policy = UserAttribute.GiftGroup)]
        public async Task<IActionResult> GiftLiveryToUserGroup(string liveryId, int groupId, [FromBody] Gift gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            groupId.ShouldNotBeNull(nameof(groupId));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var livery = await this.storefrontProvider.GetUgcLiveryAsync(liveryId, this.ApolloEndpoint.Value).ConfigureAwait(true);
            if (livery == null)
            {
                throw new InvalidArgumentsStewardException($"Invalid livery id: {liveryId}");
            }

            var response = await this.playerInventoryProvider.SendCarLiveryAsync(gift, groupId, livery, requesterObjectId, this.ApolloEndpoint.Value).ConfigureAwait(true);

            return this.Ok(response);
        }
    }
}
