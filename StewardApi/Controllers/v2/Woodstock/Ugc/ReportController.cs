using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
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
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.UGC.Contracts;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Ugc
{
    /// <summary>
    ///     Controller for Woodstock Ugc reporting.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/ugc")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock, Topic.Ugc, Target.Details)]
    public class ReportController : V2WoodstockControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        private readonly IWoodstockPegasusService pegasusService;
        private readonly IJobTracker jobTracker;
        private readonly ILoggingService loggingService;
        private readonly IScheduler scheduler;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ReportController"/> class.
        /// </summary>
        public ReportController(
            IWoodstockPegasusService pegasusService,
            IJobTracker jobTracker,
            ILoggingService loggingService,
            IScheduler scheduler)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            scheduler.ShouldNotBeNull(nameof(scheduler));

            this.pegasusService = pegasusService;
            this.jobTracker = jobTracker;
            this.loggingService = loggingService;
            this.scheduler = scheduler;
        }

        /// <summary>
        ///    Return a list of ugc report reason.
        /// </summary>
        [HttpGet("reportReasons")]
        [SwaggerResponse(200, type: typeof(IList<UgcReportReason>))]
        public async Task<IActionResult> GetUgcReportReasons()
        {
            var reportReasons = await this.pegasusService.GetUgcReportingReasonsAsync().ConfigureAwait(false);
            var supportedLocales = await this.pegasusService.GetSupportedLocalesAsync().ConfigureAwait(false);
            var englishId = supportedLocales.FirstOrDefault(x => x.Locale == "en-US").ClientLcid;

            var englishReasons = new List<UgcReportReason>();

            foreach (var reason in reportReasons)
            {
                englishReasons.Add(new UgcReportReason()
                {
                    Id = reason.Key,
                    Description = reason.Value.Description.LocalizedStrings[englishId]
                });
            }

            return this.Ok(englishReasons);
        }

        /// <summary>
        ///    Report ugc item(s) with a reason.
        /// </summary>
        [HttpPost("report")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Ugc)]
        [AutoActionLogging(CodeName, StewardAction.Add, StewardSubject.UgcReport)]
        [Authorize(Policy = UserAttribute.ReportUgc)]
        public async Task<IActionResult> ReportUgc([FromQuery] bool useBackgroundProcessing, [FromQuery] string reasonId, [FromBody] Guid[] ugcIds)
        {
            if (useBackgroundProcessing)
            {
                var response = await this.ReportUgcItemsUseBackgroundProcessing(ugcIds, reasonId).ConfigureAwait(false);
                return response;
            }
            else
            {
                await this.ReportUgcItems(ugcIds, reasonId).ConfigureAwait(false);
                return this.Ok();
            }
        }

        // Report list of UgcIds with reason
        private async Task<List<Guid>> ReportUgcItems (Guid[] ugcIds, string reasonId)
        {
            if (!Guid.TryParse(reasonId, out var parsedReasonId))
            {
                throw new BadRequestStewardException($"Reason ID could not be parsed as GUID. (reasonId: {reasonId})");
            }

            var failedUgc = new List<Guid>();

            foreach (var ugcId in ugcIds)
            {
                try
                {
                    await this.Services.StorefrontManagementService.ReportContentWithReason(ugcId, parsedReasonId).ConfigureAwait(true);
                }
                catch (Exception)
                {
                    failedUgc.Add(ugcId);
                }
            }

            return failedUgc;
        }

        private async Task<CreatedResult> ReportUgcItemsUseBackgroundProcessing(Guid[] ugcIds, string reasonId)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            var jobId = await this.jobTracker.CreateNewJobAsync(ugcIds.ToJson(), requesterObjectId, $"Woodstock Report Multiple Ugc.", this.Response).ConfigureAwait(true);
            var storefrontService = this.Services.Storefront;

            if (!Guid.TryParse(reasonId, out var parsedReasonId))
            {
                throw new BadRequestStewardException($"Reason ID could not be parsed as GUID. (reasonId: {reasonId})");
            }

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var failedUgc = new List<Guid>();

                    foreach (var ugcId in ugcIds)
                    {
                        try
                        {
                            await this.Services.StorefrontManagementService.ReportContentWithReason(ugcId, parsedReasonId).ConfigureAwait(true);
                        }
                        catch (Exception)
                        {
                            failedUgc.Add(ugcId);
                        }
                    }

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
