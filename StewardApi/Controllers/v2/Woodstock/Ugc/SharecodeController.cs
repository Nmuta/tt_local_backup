using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using System.Threading;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using System.Diagnostics;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Ugc
{
    /// <summary>
    ///     Manage sharecodes for Woodstock UGC.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/ugc/sharecode")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock, Topic.Ugc, Target.Details)]
    public class SharecodeController : V2WoodstockControllerBase
    {
        private readonly IJobTracker jobTracker;
        private readonly ILoggingService loggingService;
        private readonly IScheduler scheduler;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SharecodeController"/> class.
        /// </summary>
        public SharecodeController(
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
        ///    Generate sharecode(s) for UGC identified by UGC ID(s).
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200, type: typeof(IList<BulkGenerateSharecodeResponse>))]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.UgcItem, ActionAreaLogTags.Action | ActionAreaLogTags.Ugc)]
        [AutoActionLogging(TitleCodeName.Woodstock, StewardAction.Update, StewardSubject.UserGeneratedContent)]
        public async Task<IActionResult> GenerateSharecode([FromQuery] bool useBackgroundProcessing, [FromBody] Guid[] ugcIds)
        {
            if (useBackgroundProcessing)
            {
                var response = await this.GenerateSharecodeUsingBackgroundProcessing(ugcIds).ConfigureAwait(false);
                return response;
            }
            else
            {
                var response = await this.GenerateSharecodes(ugcIds).ConfigureAwait(false);
                return this.Ok(response);
            }
        }

        // Generate sharecode(s) for UGC identified by UGC ID(s).
        private async Task<BulkGenerateSharecodeResponse[]> GenerateSharecodes(Guid[] ugcIds)
        {
            List<BulkGenerateSharecodeResponse> response = new List<BulkGenerateSharecodeResponse>();

            foreach (var ugcId in ugcIds)
            {
                var lookup = await this.WoodstockServices.Value.StorefrontManagementService.GetUGCObject(ugcId).ConfigureAwait(true);
                var ugcIsPublic = lookup.result.Metadata.Searchable;
                var existingSharecode = lookup.result.Metadata.ShareCode;

                if (!ugcIsPublic)
                {
                    throw new FailedToSendStewardException("Cannot assign sharecode to private UGC.");
                }

                if (!string.IsNullOrWhiteSpace(existingSharecode))
                {
                    var existingResponse = new BulkGenerateSharecodeResponse { Sharecode = existingSharecode, UgcId = ugcId };
                    response.Add(existingResponse);
                    continue;
                }

                try
                {
                    var result = await this.WoodstockServices.Value.StorefrontManagementService.GenerateShareCode(ugcId).ConfigureAwait(true);
                    response.Add(new BulkGenerateSharecodeResponse { Sharecode = result.shareCode, UgcId = ugcId });
                }
                catch (StewardBaseException ex)
                {
                    var errorResponse = new BulkGenerateSharecodeResponse { Sharecode = null, UgcId = ugcId, Error = new StewardError($"Failed to generate sharecode for ugcId: {ugcId}", ex.Message) };
                    response.Add(errorResponse);
                }
            }

            return response.ToArray();
        }

        // Generate sharecode(s) for UGC identified by UGC ID(s) using background processing.
        private async Task<CreatedResult> GenerateSharecodeUsingBackgroundProcessing(Guid[] ugcIds)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            var jobId = await this.jobTracker.CreateNewJobAsync(ugcIds.ToJson(), requesterObjectId, $"Woodstock Generate Multiple Sharecodes.", this.Response).ConfigureAwait(true);
            var storefrontManagementService = this.WoodstockServices.Value.StorefrontManagementService;

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    List<BulkGenerateSharecodeResponse> response = new List<BulkGenerateSharecodeResponse>();
                    bool foundErrors = false;

                    foreach (var ugcId in ugcIds)
                    {
                        try
                        {
                            var result = await storefrontManagementService.GenerateShareCode(ugcId).ConfigureAwait(true);
                            response.Add(new BulkGenerateSharecodeResponse { Sharecode = result.shareCode, UgcId = ugcId });
                        }
                        catch (StewardBaseException ex)
                        {
                            var errorResponse = new BulkGenerateSharecodeResponse { Sharecode = null, UgcId = ugcId, Error = new StewardError($"Failed to generate sharecode for UgcId: {ugcId}", ex.Message) };
                            response.Add(errorResponse);

                            if (!foundErrors)
                            {
                                foundErrors = true;
                            }
                        }
                    }

                    var jobStatus = foundErrors ? BackgroundJobStatus.CompletedWithErrors : BackgroundJobStatus.Completed;
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response.ToArray()).ConfigureAwait(true);
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
