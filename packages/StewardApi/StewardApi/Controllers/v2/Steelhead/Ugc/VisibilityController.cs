using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Ugc
{
    /// <summary>
    ///     Controller for Steelhead Ugc visibility.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/ugc/visibility")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.Ugc, Target.Details)]
    public class VisibilityController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;

        private readonly IJobTracker jobTracker;
        private readonly ILoggingService loggingService;
        private readonly IScheduler scheduler;

        /// <summary>
        ///     Initializes a new instance of the <see cref="VisibilityController"/> class.
        /// </summary>
        public VisibilityController(
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
        ///    Make UGC items private.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [HttpPost("private")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Ugc)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.UserGeneratedContent)]
        [Authorize(Policy = UserAttributeValues.UpdateUgcVisibility)]
        public async Task<IActionResult> MakeUgcPrivate([FromQuery] bool useBackgroundProcessing, [FromBody] Guid[] ugcIds)
        {
            if (useBackgroundProcessing)
            {
                var response = await this.SetUgcVisibilityStatusUseBackgroundProcessing(ugcIds, false);
                return response;
            }
            else
            {
                var response = await this.SetUgcVisibilityStatusAsync(this.Services.StorefrontManagementService, ugcIds, false);
                return this.Ok(response);
            }
        }

        /// <summary>
        ///    Make UGC items public.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [HttpPost("public")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Ugc)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.UserGeneratedContent)]
        [Authorize(Policy = UserAttributeValues.UpdateUgcVisibility)]
        public async Task<IActionResult> MakeUgcPublic([FromQuery] bool useBackgroundProcessing, [FromBody] Guid[] ugcIds)
        {
            if (useBackgroundProcessing)
            {
                var response = await this.SetUgcVisibilityStatusUseBackgroundProcessing(ugcIds, true);
                return response;
            }
            else
            {
                var response = await this.SetUgcVisibilityStatusAsync(this.Services.StorefrontManagementService, ugcIds, true);
                return this.Ok(response);
            }
        }

        private async Task<List<Guid>> SetUgcVisibilityStatusAsync(IStorefrontManagementService storefrontManagementService, Guid[] ugcIds, bool shouldBeVisible)
        {
            var failedUgc = new List<Guid>();

            foreach (var ugcId in ugcIds)
            {
                try
                {
                    await storefrontManagementService.SetUGCVisibility(ugcId, shouldBeVisible);
                }
                catch (Exception)
                {
                    failedUgc.Add(ugcId);
                }
            }

            return failedUgc;
        }

        private async Task<CreatedResult> SetUgcVisibilityStatusUseBackgroundProcessing(Guid[] ugcIds, bool shouldBeHidden)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            var jobId = await this.jobTracker.CreateNewJobAsync(ugcIds.ToJson(), requesterObjectId, $"Steelhead Update Visibility Multiple Ugc.", this.Response);
            var storefrontManagementService = this.Services.StorefrontManagementService;

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var failedUgc = await this.SetUgcVisibilityStatusAsync(storefrontManagementService, ugcIds, shouldBeHidden);

                    var foundErrors = failedUgc.Count > 0;
                    var jobStatus = foundErrors ? BackgroundJobStatus.CompletedWithErrors : BackgroundJobStatus.Completed;
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, failedUgc);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Background job failed {jobId}", ex));

                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }
    }
}
