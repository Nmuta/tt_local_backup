using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
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
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead players.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/players")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.MediaTeam,
        UserRole.MotorsportDesigner,
        UserRole.HorizonDesigner)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Players, Target.Details, Dev.ReviseTags)]
    public class PlayersController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private readonly IMemoryCache memoryCache;
        private readonly IMapper mapper;
        private readonly IActionLogger actionLogger;
        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;
        private readonly ISteelheadBanHistoryProvider banHistoryProvider;
        private readonly IRequestValidator<SteelheadBanParametersInput> banParametersRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PlayersController"/> class for Steelhead.
        /// </summary>
        public PlayersController(
            IMemoryCache memoryCache,
            IMapper mapper,
            IActionLogger actionLogger,
            IJobTracker jobTracker,
            IScheduler scheduler,
            ISteelheadBanHistoryProvider banHistoryProvider,
            IRequestValidator<SteelheadBanParametersInput> banParametersRequestValidator)
        {
            memoryCache.ShouldNotBeNull(nameof(memoryCache));
            mapper.ShouldNotBeNull(nameof(mapper));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            banParametersRequestValidator.ShouldNotBeNull(nameof(banParametersRequestValidator));

            this.memoryCache = memoryCache;
            this.mapper = mapper;
            this.actionLogger = actionLogger;
            this.jobTracker = jobTracker;
            this.scheduler = scheduler;
            this.banHistoryProvider = banHistoryProvider;
            this.banParametersRequestValidator = banParametersRequestValidator;
        }

        /// <summary>
        ///     Searches for identities of provided Steelhead user queries.
        /// </summary>
        [HttpPost("identities")]
        [SwaggerResponse(200, type: typeof(IList<IdentityResultAlpha>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> SearchIdentities([FromBody] IList<IdentityQueryAlpha> identityQueries)
        {
            string MakeKey(IdentityQueryAlpha identityQuery)
            {
                return SteelheadCacheKey.MakeIdentityLookupKey(this.SteelheadEndpoint.Value, identityQuery.Gamertag, identityQuery.Xuid);
            }

            var cachedResults = identityQueries.Select(v => this.memoryCache.Get<IdentityResultAlpha>(MakeKey(v))).ToList();
            if (cachedResults.All(result => result != null))
            {
                return this.Ok(cachedResults.ToList());
            }

            var service = this.Services.UserManagementService;
            try
            {
                var convertedQueries = this.mapper.Map<ForzaPlayerLookupParameters[]>(identityQueries);

                var result = await service.GetUserIds(convertedQueries.Length, convertedQueries).ConfigureAwait(true);

                var identityResults = this.mapper.Map<IList<IdentityResultAlpha>>(result.playerLookupResult);
                identityResults.SetErrorsForInvalidXuids();

                return this.Ok(identityResults);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Identity lookup has failed for an unknown reason.", ex);
            }
        }

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        [HttpPost("banSummaries")]
        [SwaggerResponse(200, type: typeof(IList<BanSummary>))]
        public async Task<IActionResult> GetBanSummaries(
            [FromBody] IList<ulong> xuids)
        {
            xuids.ShouldNotBeNull(nameof(xuids));
            await this.EnsurePlayersExist(this.Services, xuids).ConfigureAwait(true);

            if (xuids.Count == 0)
            {
                return this.Ok(new List<BanSummary>());
            }

            try
            {
                var result = await this.Services.UserManagementService.GetUserBanSummaries(xuids.ToArray(), xuids.Count)
                    .ConfigureAwait(true);

                var banSummaryResults = this.mapper.Map<IList<BanSummary>>(result.banSummaries);

                return this.Ok(banSummaryResults);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Ban Summary lookup has failed.", ex);
            }
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        [HttpPost("ban")]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent)]
        [SwaggerResponse(201, type: typeof(List<BanResult>))]
        [SwaggerResponse(202)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
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

            var banParameters = this.mapper.Map<IList<SteelheadBanParameters>>(banInput);

            if (!this.ModelState.IsValid)
            {
                var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            var results = await this.BanUsersAsync(
                banParameters,
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
        [HttpPost("ban/useBackgroundProcessing")]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent)]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
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

            var banParameters = this.mapper.Map<IList<SteelheadBanParameters>>(banInput);

            if (!this.ModelState.IsValid)
            {
                var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            var jobId = await this.AddJobIdToHeaderAsync(
                banParameters.ToJson(),
                requesterObjectId,
                $"Steelhead Banning: {banParameters.Count} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var results = await this.BanUsersAsync(
                        banParameters,
                        requesterObjectId).ConfigureAwait(true);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus(results);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, results)
                        .ConfigureAwait(true);

                    var bannedXuids = results.Where(banResult => banResult.Error == null)
                        .Select(banResult => Invariant($"{banResult.Xuid}")).ToList();

                    await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, bannedXuids)
                        .ConfigureAwait(true);
                }
                catch (Exception)
                {
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
            string requesterObjectId)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            const int maxXuidsPerRequest = 10;
            var endpoint = this.SteelheadEndpoint.Value;
            var services = this.Services;

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
                        var userResult = await services.LiveOpsService.GetLiveOpsUserDataByGamerTag(
                                param.Gamertag).ConfigureAwait(false);

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
                    var result = await services.UserManagementService
                        .BanUsers(mappedBanParameters.ToArray(), mappedBanParameters.Count)
                        .ConfigureAwait(false);

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
                                        endpoint).ConfigureAwait(false);
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

        private async Task<string> AddJobIdToHeaderAsync(string requestBody, string userObjectId, string reason)
        {
            var jobId = await this.jobTracker.CreateNewJobAsync(requestBody, userObjectId, reason)
                .ConfigureAwait(true);

            this.Response.Headers.Add("jobId", jobId);

            return jobId;
        }
    }
}
