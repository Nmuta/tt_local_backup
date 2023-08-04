using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Ugc
{
    /// <summary>
    ///     Controller for Woodstock Ugc hiding/unhiding.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/ugc")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock, Topic.Ugc, Target.Details)]
    public class UgcVisibilityController : V2WoodstockControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        private readonly IJobTracker jobTracker;
        private readonly ILoggingService loggingService;
        private readonly IScheduler scheduler;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UgcVisibilityController"/> class.
        /// </summary>
        public UgcVisibilityController(
            IJobTracker jobTracker,
            ILoggingService loggingService,
            IScheduler scheduler)
        {
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            scheduler.ShouldNotBeNull(nameof(scheduler));

            this.jobTracker = jobTracker;
            this.loggingService = loggingService;
            this.scheduler = scheduler;
        }

        /// <summary>
        ///    Unhide a ugc item.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [HttpPost("unhide")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Ugc)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.UserGeneratedContent)]
        [Authorize(Policy = UserAttributeValues.UnhideUgc)]
        public async Task<IActionResult> UnhideUgc([FromQuery] bool useBackgroundProcessing, [FromBody] Guid[] ugcIds)
        {
            if (useBackgroundProcessing)
            {
                var response = await this.SetUgcItemsVisibilityUseBackgroundProcessing(ugcIds, true).ConfigureAwait(false);
                return response;
            }
            else
            {
                var response = await this.SetUgcItemsVisibilityAsync(this.Services.StorefrontManagementService, ugcIds, true).ConfigureAwait(false);
                return this.Ok(response);
            }
        }

        /// <summary>
        ///    Hide a list of ugc item.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [HttpPost("hide")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Ugc)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.UserGeneratedContent)]
        [Authorize(Policy = UserAttributeValues.HideUgc)]
        public async Task<IActionResult> HideUgc([FromQuery] bool useBackgroundProcessing, [FromBody] Guid[] ugcIds)
        {
            if (useBackgroundProcessing)
            {
                var response = await this.SetUgcItemsVisibilityUseBackgroundProcessing(ugcIds, false).ConfigureAwait(false);
                return response;
            }
            else
            {
                var response = await this.SetUgcItemsVisibilityAsync(this.Services.StorefrontManagementService, ugcIds, false).ConfigureAwait(false);
                return this.Ok(response);
            }
        }

        // Hide list of UgcIds
        private async Task<List<Guid>> SetUgcItemsVisibilityAsync(IStorefrontManagementService storefrontManagementService, Guid[] ugcIds, bool isVisible)
        {
            var failedUgc = new List<Guid>();

            foreach (var ugcId in ugcIds)
            {
                try
                {
                    await storefrontManagementService.SetUGCVisibility(ugcId, isVisible).ConfigureAwait(true);
                }
                catch (Exception)
                {
                    failedUgc.Add(ugcId);
                }
            }

            return failedUgc;
        }

        // Hide list of UfcIds using background processing
        private async Task<CreatedResult> SetUgcItemsVisibilityUseBackgroundProcessing(Guid[] ugcIds, bool isVisible)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            var jobId = await this.jobTracker.CreateNewJobAsync(ugcIds.ToJson(), requesterObjectId, $"Woodstock Hide Multiple Ugc.", this.Response).ConfigureAwait(true);
            var storefrontManagementService = this.Services.StorefrontManagementService;

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var failedUgc = await this.SetUgcItemsVisibilityAsync(storefrontManagementService, ugcIds, isVisible).ConfigureAwait(false);

                    var foundErrors = failedUgc.Count > 0;
                    var jobStatus = foundErrors ? BackgroundJobStatus.CompletedWithErrors : BackgroundJobStatus.Completed;
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, failedUgc).ConfigureAwait(true);
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
    }
}
