﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Errors;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.v2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock
{
    /// <summary>
    ///     Handles requests for Woodstock ban.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/players/ban")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Target.Players, Topic.Banning)]
    public class BanController : V2WoodstockControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        private readonly IWoodstockPegasusService pegasusService;
        private readonly IMapper mapper;
        private readonly IRequestValidator<WoodstockBanParametersInput> banParametersRequestValidator;
        private readonly IWoodstockBanHistoryProvider banHistoryProvider;
        private readonly IActionLogger actionLogger;
        private readonly IJobTracker jobTracker;
        private readonly ILoggingService loggingService;
        private readonly IScheduler scheduler;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BanController"/> class.
        /// </summary>
        public BanController(
            IWoodstockPegasusService pegasusService,
            IMapper mapper,
            IRequestValidator<WoodstockBanParametersInput> banParametersRequestValidator,
            IWoodstockBanHistoryProvider banHistoryProvider,
            IActionLogger actionLogger,
            IJobTracker jobTracker,
            ILoggingService loggingService,
            IScheduler scheduler)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            mapper.ShouldNotBeNull(nameof(mapper));
            banParametersRequestValidator.ShouldNotBeNull(nameof(banParametersRequestValidator));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            scheduler.ShouldNotBeNull(nameof(scheduler));

            this.pegasusService = pegasusService;
            this.mapper = mapper;
            this.banParametersRequestValidator = banParametersRequestValidator;
            this.banHistoryProvider = banHistoryProvider;
            this.actionLogger = actionLogger;
            this.jobTracker = jobTracker;
            this.loggingService = loggingService;
            this.scheduler = scheduler;
        }

        /// <summary>
        ///    Return a list of ugc report reason.
        /// </summary>
        [HttpGet("banConfigurations")]
        [SwaggerResponse(200, type: typeof(IList<BanConfiguration>))]
        public async Task<IActionResult> GetBanConfigurations()
        {
            var banConfiguration = await this.pegasusService.GetBanConfigurationsAsync().ConfigureAwait(false);

            var banConfigurations = new List<BanConfiguration>();

            foreach (var config in banConfiguration)
            {
                var stewardConfig = this.mapper.SafeMap<BanConfiguration>(config.Value);
                stewardConfig.BanConfigurationId = config.Key;
                banConfigurations.Add(stewardConfig);
            }

            return this.Ok(banConfigurations);
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        [HttpPost]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Banning)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
        [Authorize(Policy = UserAttribute.BanPlayer)]
        public async Task<IActionResult> BanPlayers(
            [FromQuery] bool useBackgroundProcessing,
            [FromBody] IList<WoodstockBanParametersInput> banInput)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            banInput.ShouldNotBeNull(nameof(banInput));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            foreach (var banParam in banInput)
            {
                this.banParametersRequestValidator.ValidateIds(banParam, this.ModelState);
                this.banParametersRequestValidator.Validate(banParam, this.ModelState);
            }

            if (!this.ModelState.IsValid)
            {
                var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            if (useBackgroundProcessing)
            {
                var response = await this.BanPlayersUseBackgroundProcessing(banInput, requesterObjectId).ConfigureAwait(false);
                return response;
            }
            else
            {
                var userManagementService = this.Services.UserManagementService;
                var liveOpsService = this.Services.LiveOpsService;
                var response = await this.BanPlayers(banInput, requesterObjectId, liveOpsService, userManagementService).ConfigureAwait(false);
                return this.Ok(response);
            }
        }

        // Bans players using a background job.
        private async Task<CreatedResult> BanPlayersUseBackgroundProcessing(IList<WoodstockBanParametersInput> banInput, string requesterObjectId)
        {
            var jobId = await this.jobTracker.CreateNewJobAsync(
                banInput.ToJson(),
                requesterObjectId,
                $"Woodstock Banning: {banInput.Count} recipients.",
                this.Response).ConfigureAwait(true);

            var userManagementService = this.Services.UserManagementService;
            var liveOpsService = this.Services.LiveOpsService;

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.BanPlayers(banInput, requesterObjectId, liveOpsService, userManagementService).ConfigureAwait(false);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus(response);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response).ConfigureAwait(true);
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

        // Bans players.
        private async Task<IList<BanResult>> BanPlayers(
            IList<WoodstockBanParametersInput> banInput,
            string requesterObjectId,
            ILiveOpsService liveOpsService,
            IUserManagementService userManagementService)
        {
            var banResults = new List<BanResult>();

            const int maxXuidsPerRequest = 10;

            foreach (var ban in banInput)
            {
                if (ban.Xuid == default)
                {
                    if (string.IsNullOrWhiteSpace(ban.Gamertag))
                    {
                        throw new InvalidArgumentsStewardException("No XUID or Gamertag provided.");
                    }

                    try
                    {
                        var userResult = await liveOpsService.GetLiveOpsUserDataByGamerTagV2(ban.Gamertag).ConfigureAwait(false);

                        ban.Xuid = userResult.userData.Xuid;
                    }
                    catch (Exception ex)
                    {
                        throw new NotFoundStewardException(
                            $"No profile found for Gamertag: {ban.Gamertag}.",
                            ex);
                    }
                }
            }

            try
            {
                for (var i = 0; i < banInput.Count; i += maxXuidsPerRequest)
                {
                    var paramBatch = banInput.ToList().GetRange(i, Math.Min(maxXuidsPerRequest, banInput.Count - i));
                    var mappedBanParameters = this.mapper.Map<IList<ForzaUserBanParametersV2>>(paramBatch);
                    var result = await userManagementService.BanUsersV2(mappedBanParameters.ToArray()).ConfigureAwait(false);

                    banResults.AddRange(this.mapper.Map<IList<BanResult>>(result.banResults));
                }

                foreach (var result in banResults)
                {
                    var parameters = banInput.Where(banAttempt => banAttempt.Xuid == result.Xuid).FirstOrDefault();

                    if (result.Error == null)
                    {
                        try
                        {
                            await
                                this.banHistoryProvider.UpdateBanHistoryAsync(
                                        parameters.Xuid.Value,
                                        result.BanDescription.BanEntryId,
                                        TitleConstants.WoodstockCodeName,
                                        requesterObjectId,
                                        parameters,
                                        result,
                                        this.WoodstockEndpoint.Value).ConfigureAwait(false);
                        }
                        catch (Exception ex)
                        {
                            result.Error = new FailedToSendStewardError(
                                $"Ban Successful. Ban history upload failed for XUID: {result.Xuid}.",
                                ex);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // More detail in ex?
                throw new UnknownFailureStewardException("User banning has failed.", ex);
            }

            var bannedXuids = banResults.Where(banResult => banResult.Error == null)
                .Select(banResult => Invariant($"{banResult.Xuid}")).ToList();

            await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, bannedXuids)
                .ConfigureAwait(true);

            return banResults;
        }
    }
}
