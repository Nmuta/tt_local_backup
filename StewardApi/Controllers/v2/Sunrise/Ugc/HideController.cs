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
using Turn10.UGC.Contracts;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Sunrise.Ugc
{
    /// <summary>
    ///     Controller for Sunrise Ugc hiding.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/sunrise/ugc/hide")]
    [LogTagTitle(TitleLogTags.Sunrise)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Sunrise, Topic.Ugc, Target.Details)]
    public class HideController : V2SunriseControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Sunrise;

        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;

        /// <summary>
        ///     Initializes a new instance of the <see cref="HideController"/> class.
        /// </summary>
        public HideController(IJobTracker jobTracker, IScheduler scheduler)
        {
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            scheduler.ShouldNotBeNull(nameof(scheduler));

            this.jobTracker = jobTracker;
            this.scheduler = scheduler;
        }

        /// <summary>
        ///    Hide a list of ugc item.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.CommunityManager)]
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Ugc)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.UserGeneratedContent)]
        [Authorize(Policy = UserAttribute.HideUgc)]
        public async Task<IActionResult> HideUgc([FromQuery] bool useBackgroundProcessing, [FromBody] Guid[] ugcIds)
        {
            if (useBackgroundProcessing)
            {
                var response = await this.HideUgcItemsUseBackgroundProcessing(ugcIds).ConfigureAwait(false);
                return response;
            }
            else
            {
                await this.HideUgcItems(ugcIds).ConfigureAwait(false);
                return this.Ok();
            }
        }

        private async Task HideUgcItems(Guid[] ugcIds)
        {
            foreach (var ugcId in ugcIds)
            {
                await this.Services.StorefrontService.HideUGC(ugcId).ConfigureAwait(true);
            }
        }

        private async Task<CreatedResult> HideUgcItemsUseBackgroundProcessing(Guid[] ugcIds)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            var jobId = await this.jobTracker.CreateNewJobAsync(ugcIds.ToJson(), requesterObjectId, $"Sunrise Hide Multiple Ugc.", this.Response).ConfigureAwait(true);
            var storefrontService = this.Services.StorefrontService;

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
                            await storefrontService.HideUGC(ugcId).ConfigureAwait(true);
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
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }
    }
}
