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
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
using Xls.Security.FM8.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using SteelheadContracts = Turn10.LiveOps.StewardApi.Contracts.Steelhead;

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
        private readonly IList<BanReasonGroup<FeatureAreas>> banReasonGroups = new List<BanReasonGroup<FeatureAreas>>()
        {
            new BanReasonGroup<FeatureAreas>()
            {
                Name = "Extreme Violations",
                Reasons = new List<string>
                {
                    "Hate Speech",
                    "Credible threat of violent acts",
                    "CSEAI - child sexual exploitive abusive imagery",
                    "TVEC - terrorism or violent extremism content",
                    "Sexual/Nude imagery",
                    "Credit/XP/Wheelspin hacking",
                    "Ban dodging",
                    "Employee harassment",
                    "Breaching NDA"
                },
                BanConfigurationId = new Guid("1049fa1f-7ffe-4188-ae21-89ef661e1a7b"),
                FeatureAreas = new List<FeatureAreas>
                {
                    FeatureAreas.AllRequests
                }
            },
            new BanReasonGroup<FeatureAreas>()
            {
                Name = "Cheating/Unallowed Modding",
                Reasons = new List<string>
                {
                    "Obtaining unreleased cars",
                    "Device exploitation",
                    "In-game glitches or exploits",
                    "Modifying game files",
                    "Running cheat software on client alongside game",
                    "Audio Mods",
                    "Fraudulent leaderboards",
                    "Auction house automated scripts",
                    "Stream-Sniping",
                },
                BanConfigurationId = new Guid("5394efb9-8cc1-4f93-98ea-ab7e2693b7d2"),
                FeatureAreas = new List<FeatureAreas>
                {
                    FeatureAreas.AllRequests
                }
            },
            new BanReasonGroup<FeatureAreas>()
            {
                Name = "Inappropriate User Generated Content (UGC)",
                Reasons = new List<string>
                {
                    "Pornographic logo",
                    "Notorious iconography",
                    "Drug/Marijuana Symbolism & Imagery",
                    "Profanity",
                    "Sharing Personal Information",
                    "Spam/Advertising",
                    "Political Statement",
                    "Defamation & Impersonation",
                    "Harm Against People/Animals",
                    "Crude Humor/Imagery",
                    "Low Effort/Quality Content",
                    "Child Endangerment",
                    "Sexually Inappropriate/Suggestive",
                    "Threat of Self Harm"
                },
                BanConfigurationId = new Guid("563a4a85-9f0d-4678-a86c-f4d71fb9f424"),
                FeatureAreas = new List<FeatureAreas>
                {
                    FeatureAreas.UserGeneratedContent,
                    FeatureAreas.AuctionHouse
                }
            },
            new BanReasonGroup<FeatureAreas>()
            {
                Name = "Unsportsmanlike Conduct",
                Reasons = new List<string>
                {
                    "Intentional ramming/wrecking, pinning, pitting, spearing, shoving, and blocking in races",
                    "Light Bullying",
                    "Vulgar language",
                    "Track cutting/extending to pass"
                },
                BanConfigurationId = new Guid("253c7ad6-68ac-4ac7-b784-1452753acaef"),
                FeatureAreas = new List<FeatureAreas>
                {
                    FeatureAreas.Matchmaking,
                    FeatureAreas.DailyCredit,
                    FeatureAreas.Community,
                    FeatureAreas.Drivatar
                }
            },
            new BanReasonGroup<FeatureAreas>()
            {
                Name = "Developer",
                Reasons = new List<string>
                {
                    "Testing"
                },
                BanConfigurationId = new Guid("c8ec2fac-6132-4c87-85dc-1b799e08aca4"),
                FeatureAreas = new List<FeatureAreas>
                {
                    FeatureAreas.Test
                }
            }
        };

        private readonly ISteelheadPegasusService pegasusService;
        private readonly IMapper mapper;
        private readonly IActionLogger actionLogger;
        private readonly IJobTracker jobTracker;
        private readonly IScheduler scheduler;
        private readonly ILoggingService loggingService;
        private readonly ISteelheadBanHistoryProvider banHistoryProvider;
        private readonly IRequestValidator<V2BanParametersInput> banParametersRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BanController"/> class for Steelhead.
        /// </summary>
        public BanController(
            ISteelheadPegasusService pegasusService,
            IMapper mapper,
            IActionLogger actionLogger,
            IJobTracker jobTracker,
            IScheduler scheduler,
            ILoggingService loggingService,
            ISteelheadBanHistoryProvider banHistoryProvider,
            IRequestValidator<V2BanParametersInput> banParametersRequestValidator)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            mapper.ShouldNotBeNull(nameof(mapper));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            banParametersRequestValidator.ShouldNotBeNull(nameof(banParametersRequestValidator));

            this.pegasusService = pegasusService;
            this.mapper = mapper;
            this.actionLogger = actionLogger;
            this.jobTracker = jobTracker;
            this.scheduler = scheduler;
            this.loggingService = loggingService;
            this.banHistoryProvider = banHistoryProvider;
            this.banParametersRequestValidator = banParametersRequestValidator;
        }

        /// <summary>
        ///    Return a list of report reason group.
        /// </summary>
        [HttpGet("banReasonGroups")]
        [SwaggerResponse(200, type: typeof(Dictionary<string, BanReasonGroup<FeatureAreas>>))]
        public IActionResult GetBanReasonGroups()
        {
            return this.Ok(this.banReasonGroups);
        }

        /// <summary>
        ///    Return a list of ugc ban configuration.
        /// </summary>
        [HttpGet("banConfigurations")]
        [SwaggerResponse(200, type: typeof(IList<BanConfiguration>))]
        public async Task<IActionResult> GetBanConfigurations()
        {
            var pegasusEnvironment = this.SteelheadEndpoint.Value == SteelheadContracts.SteelheadEndpoint.Studio 
                                  || this.SteelheadEndpoint.Value == SteelheadContracts.SteelheadEndpoint.Flight
                                   ? SteelheadPegasusEnvironment.Dev : SteelheadPegasusEnvironment.Prod;

            var banConfiguration = await this.pegasusService.GetBanConfigurationsAsync(pegasusEnvironment).ConfigureAwait(true);

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
        [Authorize(Policy = UserAttributeValues.BanPlayer)]
        public async Task<IActionResult> BanPlayers(
            [FromBody] IList<V2BanParametersInput> banInput,
            [FromQuery] bool useBackgroundProcessing = false)
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
                var response = await this.BanPlayersUseBackgroundProcessing(banInput, requesterObjectId).ConfigureAwait(true);
                return response;
            }
            else
            {
                var userManagementService = this.Services.UserManagementService;
                var response = await this.BanPlayers(banInput, requesterObjectId, userManagementService).ConfigureAwait(true);
                return this.Ok(response);
            }
        }

        // Bans players using a background job.
        private async Task<CreatedResult> BanPlayersUseBackgroundProcessing(IList<V2BanParametersInput> banInput, string requesterObjectId)
        {
            var jobId = await this.jobTracker.CreateNewJobAsync(
                banInput.ToJson(),
                requesterObjectId,
                $"Woodstock Banning: {banInput.Count} recipients.",
                this.Response).ConfigureAwait(true);

            var userManagementService = this.Services.UserManagementService;

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var response = await this.BanPlayers(banInput, requesterObjectId, userManagementService).ConfigureAwait(false);

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
            IList<V2BanParametersInput> banInput,
            string requesterObjectId,
            IUserManagementService userManagementService)
        {
            var banResults = new List<BanResult>();

            const int maxXuidsPerRequest = 10;
            var emptyDuration = new ForzaTimeSpan();

            try
            {
                // This assume that the parameters are the same for every ban input which is how Steward currently works
                var banReasonGroup = this.banReasonGroups.First(x => x.Name == banInput[0].ReasonGroupName);
                var formattedBanAreas = string.Join(", ", banReasonGroup.FeatureAreas);
                var calculatedBanAreas = banReasonGroup.FeatureAreas.Select(x => (uint)x).Aggregate((a, b) => a | b);
                for (var i = 0; i < banInput.Count; i += maxXuidsPerRequest)
                {
                    var paramBatch = banInput.ToList().GetRange(i, Math.Min(maxXuidsPerRequest, banInput.Count - i));

                    var mappedBanParameters = paramBatch.Select(x => new ForzaUserBanParametersV2()
                    {
                        xuids = new ulong[] { x.Xuid.Value },
                        DeleteLeaderboardEntries = x.DeleteLeaderboardEntries.Value,
                        BanEntryReason = x.Reason,
                        PegasusBanConfigurationId = banReasonGroup.BanConfigurationId,
                        FeatureArea = calculatedBanAreas,
                        OverrideBanDuration = x.Override,
                        // ForzaBanDuration is completely ignored by services if OverrideBanDuration is not set to true
                        BanDurationOverride = new ForzaBanDuration()
                        {
                            IsDeviceBan = x.OverrideBanConsoles.Value,
                            IsPermaBan = x.OverrideDurationPermanent.Value,
                            BanDuration = x.OverrideDuration.HasValue ? new ForzaTimeSpan()
                            {
                                Days = (uint)x.OverrideDuration.Value.Days,
                                Hours = (uint)x.OverrideDuration.Value.Hours,
                                Minutes = (uint)x.OverrideDuration.Value.Minutes,
                                Seconds = (uint)x.OverrideDuration.Value.Seconds,
                            }
                            : emptyDuration,
                        }
                    });

                    var result = new UserManagementService.BanUsersV2Output();
                    try
                    {
                        result = await userManagementService.BanUsersV2(mappedBanParameters.ToArray()).ConfigureAwait(false);
                        banResults.AddRange(this.mapper.SafeMap<IList<BanResult>>(result.banResults));
                    }
                    catch (Exception ex)
                    {
                        var failureResult = mappedBanParameters.Select(ban => new BanResult()
                        {
                            Xuid = ban.xuids.First(),
                            BanDescription = null,
                            Error = new ServicesFailureStewardError("Ban Request Failed", ex)
                        });
                        banResults.AddRange(failureResult);
                    }
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
                                        TitleConstants.SteelheadCodeName,
                                        requesterObjectId,
                                        parameters,
                                        result,
                                        this.SteelheadEndpoint.Value,
                                        formattedBanAreas).ConfigureAwait(false);
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
