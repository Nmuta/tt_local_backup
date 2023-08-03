using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Players
{
    /// <summary>
    ///     Handles requests for Steelhead players.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/players/ban")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Players, Target.Details, Dev.ReviseTags)]
    public class BanController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private readonly IMapper mapper;
        private readonly IActionLogger actionLogger;
        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;
        private readonly ILoggingService loggingService;
        private readonly ISteelheadBanHistoryProvider banHistoryProvider;
        private readonly IRequestValidator<SteelheadBanParametersInput> banParametersRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BanController"/> class for Steelhead.
        /// </summary>
        public BanController(
            IMapper mapper,
            IActionLogger actionLogger,
            IJobTracker jobTracker,
            IScheduler scheduler,
            ILoggingService loggingService,
            ISteelheadBanHistoryProvider banHistoryProvider,
            IRequestValidator<SteelheadBanParametersInput> banParametersRequestValidator)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            banParametersRequestValidator.ShouldNotBeNull(nameof(banParametersRequestValidator));

            this.mapper = mapper;
            this.actionLogger = actionLogger;
            this.jobTracker = jobTracker;
            this.scheduler = scheduler;
            this.loggingService = loggingService;
            this.banHistoryProvider = banHistoryProvider;
            this.banParametersRequestValidator = banParametersRequestValidator;
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        [HttpPost]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [SwaggerResponse(201, type: typeof(List<BanResult>))]
        [SwaggerResponse(202)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
        [Authorize(Policy = UserAttributeValues.BanPlayer)]
        public async Task<IActionResult> BanPlayers(
            [FromBody] IList<SteelheadBanParametersInput> banInput)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            banInput.ShouldNotBeNull(nameof(banInput));

            var endpoint = this.SteelheadEndpoint.Value;
            foreach (var banParam in banInput)
            {
                this.banParametersRequestValidator.ValidateIds(banParam, this.ModelState);
                this.banParametersRequestValidator.Validate(banParam, this.ModelState);
            }

            var banParameters = this.mapper.SafeMap<IList<SteelheadBanParameters>>(banInput);

            if (!this.ModelState.IsValid)
            {
                var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            var results = await this.BanUsersAsync(
                banParameters,
                this.Services.LiveOpsService,
                this.Services.UserManagementService,
                requesterObjectId).ConfigureAwait(true);

            var bannedXuids = results.Where(banResult => banResult.Error == null)
                .Select(banResult => Invariant($"{banResult.Xuid}")).ToList();

            await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, bannedXuids)
                .ConfigureAwait(true);

            return this.Ok(results);
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        [HttpPost("useBackgroundProcessing")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
        [Authorize(Policy = UserAttributeValues.BanPlayer)]
        public async Task<IActionResult> BanPlayersUseBackgroundProcessing(
            [FromBody] IList<SteelheadBanParametersInput> banInput)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            banInput.ShouldNotBeNull(nameof(banInput));

            var endpoint = this.SteelheadEndpoint.Value;
            foreach (var banParam in banInput)
            {
                this.banParametersRequestValidator.ValidateIds(banParam, this.ModelState);
                this.banParametersRequestValidator.Validate(banParam, this.ModelState);
            }

            var banParameters = this.mapper.SafeMap<IList<SteelheadBanParameters>>(banInput);

            if (!this.ModelState.IsValid)
            {
                var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            var jobId = await this.jobTracker.CreateNewJobAsync(
                banParameters.ToJson(),
                requesterObjectId,
                $"Steelhead Banning: {banParameters.Count} recipients.",
                this.Response).ConfigureAwait(true);

            var liveOpsService = this.Services.LiveOpsService;
            var userManagementService = this.Services.UserManagementService;

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var results = await this.BanUsersAsync(
                        banParameters,
                        liveOpsService,
                        userManagementService,
                        requesterObjectId).ConfigureAwait(true);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus(results);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, results)
                        .ConfigureAwait(true);

                    var bannedXuids = results.Where(banResult => banResult.Error == null)
                        .Select(banResult => Invariant($"{banResult.Xuid}")).ToList();

                    await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, bannedXuids)
                        .ConfigureAwait(true);
                }
                catch (Exception ex)
                {
                    this.loggingService.LogException(new AppInsightsException($"Background job failed {jobId}", ex));

                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed)
                        .ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return this.Created(
                new Uri($"{this.Request.Scheme}://{this.Request.Host}/api/v1/jobs/jobId({jobId})"),
                new BackgroundJob(jobId, BackgroundJobStatus.InProgress));
        }

        private async Task<IList<BanResult>> BanUsersAsync(
            IList<SteelheadBanParameters> banParameters,
            ILiveOpsService liveOpsService,
            IUserManagementService userManagementService,
            string requesterObjectId)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            const int maxXuidsPerRequest = 10;
            var endpoint = this.SteelheadEndpoint.Value;

            foreach (var param in banParameters)
            {
                param.FeatureArea.ShouldNotBeNullEmptyOrWhiteSpace(nameof(param.FeatureArea));

                if (param.Xuid == default)
                {
                    if (string.IsNullOrWhiteSpace(param.Gamertag))
                    {
                        throw new InvalidArgumentsStewardException("No XUID or Gamertag provided.");
                    }

                    try
                    {
                        var userResult = await liveOpsService.GetLiveOpsUserDataByGamerTag(
                                param.Gamertag).ConfigureAwait(true);

                        param.Xuid = userResult.userData.qwXuid;
                    }
                    catch (Exception ex)
                    {
                        throw new NotFoundStewardException($"No profile found. (Gamertag: {param.Gamertag}).", ex);
                    }
                }
            }

            try
            {
                var banResults = new List<BanResult>();

                for (var i = 0; i < banParameters.Count; i += maxXuidsPerRequest)
                {
                    var paramBatch = banParameters.ToList()
                        .GetRange(i, Math.Min(maxXuidsPerRequest, banParameters.Count - i));
                    var mappedBanParameters = this.mapper.Map<IList<ForzaUserBanParameters>>(paramBatch);
                    var result = await userManagementService
                        .BanUsers(mappedBanParameters.ToArray(), mappedBanParameters.Count)
                        .ConfigureAwait(true);

                    banResults.AddRange(this.mapper.Map<IList<BanResult>>(result.banResults));
                }

                foreach (var result in banResults)
                {
                    var parameters = banParameters.Where(banAttempt => banAttempt.Xuid == result.Xuid)
                        .FirstOrDefault();

                    if (result.Error == null)
                    {
                        try
                        {
                            await
                                this.banHistoryProvider.UpdateBanHistoryAsync(
                                        parameters.Xuid,
                                        TitleConstants.SteelheadCodeName,
                                        requesterObjectId,
                                        parameters,
                                        endpoint).ConfigureAwait(true);
                        }
                        catch (Exception ex)
                        {
                            result.Error = new FailedToSendStewardError(
                                $"Ban Successful. Ban history upload failed for XUID: {result.Xuid}.",
                                ex);
                        }
                    }
                }

                return banResults;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("User banning has failed.", ex);
            }
        }
    }
}
