﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Forza.Scoreboard.FH5_main.Generated;
using Forza.UserGeneratedContent.FH5_main.Generated;
using Kusto.Cloud.Platform.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.SystemFunctions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static System.FormattableString;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for Woodstock.
    /// </summary>
    [Route("api/v1/title/woodstock")]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.MediaTeam,
        UserRole.MotorsportDesigner,
        UserRole.HorizonDesigner)]
    [SuppressMessage(
        "Microsoft.Maintainability",
        "CA1506:AvoidExcessiveClassCoupling",
        Justification = "This can't be avoided.")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    public sealed class WoodstockController : ControllerBase
    {
        private const int DefaultMaxResults = 100;
        private const string DefaultEndpointKey = "Woodstock|Retail";
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KeyVaultUrl,
            ConfigurationKeyConstants.GroupGiftPasswordSecretName
        };

        private readonly IMemoryCache memoryCache;
        private readonly IActionLogger actionLogger;
        private readonly ILoggingService loggingService;
        private readonly IKustoProvider kustoProvider;
        private readonly IWoodstockPlayerInventoryProvider woodstockPlayerInventoryProvider;
        private readonly IWoodstockPlayerDetailsProvider woodstockPlayerDetailsProvider;
        private readonly IWoodstockServiceManagementProvider woodstockServiceManagementProvider;
        private readonly IWoodstockNotificationProvider woodstockNotificationProvider;
        private readonly IWoodstockGiftHistoryProvider giftHistoryProvider;
        private readonly IWoodstockBanHistoryProvider banHistoryProvider;
        private readonly INotificationHistoryProvider notificationHistoryProvider;
        private readonly IWoodstockStorefrontProvider storefrontProvider;
        private readonly IWoodstockLeaderboardProvider leaderboardProvider;
        private readonly IWoodstockItemsProvider itemsProvider;
        private readonly IJobTracker jobTracker;
        private readonly IMapper mapper;
        private readonly IScheduler scheduler;
        private readonly IRequestValidator<WoodstockMasterInventory> masterInventoryRequestValidator;
        private readonly IRequestValidator<WoodstockGift> giftRequestValidator;
        private readonly IRequestValidator<WoodstockGroupGift> groupGiftRequestValidator;
        private readonly IRequestValidator<WoodstockBanParametersInput> banParametersRequestValidator;
        private readonly IRequestValidator<WoodstockUserFlagsInput> userFlagsRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockController"/> class.
        /// </summary>
        public WoodstockController(
            IMemoryCache memoryCache,
            IActionLogger actionLogger,
            ILoggingService loggingService,
            IKustoProvider kustoProvider,
            IWoodstockPlayerDetailsProvider woodstockPlayerDetailsProvider,
            IWoodstockPlayerInventoryProvider woodstockPlayerInventoryProvider,
            IWoodstockServiceManagementProvider woodstockServiceManagementProvider,
            IWoodstockNotificationProvider woodstockNotificationProvider,
            IKeyVaultProvider keyVaultProvider,
            IWoodstockGiftHistoryProvider giftHistoryProvider,
            IWoodstockBanHistoryProvider banHistoryProvider,
            INotificationHistoryProvider notificationHistoryProvider,
            IWoodstockStorefrontProvider storefrontProvider,
            IWoodstockLeaderboardProvider leaderboardProvider,
            IWoodstockItemsProvider itemsProvider,
            IConfiguration configuration,
            IScheduler scheduler,
            IJobTracker jobTracker,
            IMapper mapper,
            IRequestValidator<WoodstockMasterInventory> masterInventoryRequestValidator,
            IRequestValidator<WoodstockGift> giftRequestValidator,
            IRequestValidator<WoodstockGroupGift> groupGiftRequestValidator,
            IRequestValidator<WoodstockBanParametersInput> banParametersRequestValidator,
            IRequestValidator<WoodstockUserFlagsInput> userFlagsRequestValidator)
        {
            memoryCache.ShouldNotBeNull(nameof(memoryCache));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));
            woodstockPlayerDetailsProvider.ShouldNotBeNull(nameof(woodstockPlayerDetailsProvider));
            woodstockPlayerInventoryProvider.ShouldNotBeNull(nameof(woodstockPlayerInventoryProvider));
            woodstockServiceManagementProvider.ShouldNotBeNull(nameof(woodstockServiceManagementProvider));
            woodstockNotificationProvider.ShouldNotBeNull(nameof(woodstockNotificationProvider));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            notificationHistoryProvider.ShouldNotBeNull(nameof(notificationHistoryProvider));
            storefrontProvider.ShouldNotBeNull(nameof(storefrontProvider));
            leaderboardProvider.ShouldNotBeNull(nameof(leaderboardProvider));
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            configuration.ShouldNotBeNull(nameof(configuration));
            scheduler.ShouldNotBeNull(nameof(scheduler));
            jobTracker.ShouldNotBeNull(nameof(jobTracker));
            mapper.ShouldNotBeNull(nameof(mapper));
            masterInventoryRequestValidator.ShouldNotBeNull(nameof(masterInventoryRequestValidator));
            giftRequestValidator.ShouldNotBeNull(nameof(giftRequestValidator));
            groupGiftRequestValidator.ShouldNotBeNull(nameof(groupGiftRequestValidator));
            banParametersRequestValidator.ShouldNotBeNull(nameof(banParametersRequestValidator));
            userFlagsRequestValidator.ShouldNotBeNull(nameof(userFlagsRequestValidator));
            configuration.ShouldContainSettings(RequiredSettings);

            this.memoryCache = memoryCache;
            this.actionLogger = actionLogger;
            this.loggingService = loggingService;
            this.kustoProvider = kustoProvider;
            this.woodstockPlayerDetailsProvider = woodstockPlayerDetailsProvider;
            this.woodstockPlayerInventoryProvider = woodstockPlayerInventoryProvider;
            this.woodstockServiceManagementProvider = woodstockServiceManagementProvider;
            this.woodstockNotificationProvider = woodstockNotificationProvider;
            this.giftHistoryProvider = giftHistoryProvider;
            this.banHistoryProvider = banHistoryProvider;
            this.notificationHistoryProvider = notificationHistoryProvider;
            this.storefrontProvider = storefrontProvider;
            this.leaderboardProvider = leaderboardProvider;
            this.itemsProvider = itemsProvider;
            this.scheduler = scheduler;
            this.jobTracker = jobTracker;
            this.mapper = mapper;
            this.masterInventoryRequestValidator = masterInventoryRequestValidator;
            this.giftRequestValidator = giftRequestValidator;
            this.groupGiftRequestValidator = groupGiftRequestValidator;
            this.banParametersRequestValidator = banParametersRequestValidator;
            this.userFlagsRequestValidator = userFlagsRequestValidator;
        }

        /// <summary>
        ///     Gets the player identity.
        /// </summary>
        [HttpPost("players/identities")]
        [SwaggerResponse(200, type: typeof(List<IdentityResultAlpha>))]
        [ResponseCache(Duration = CacheSeconds.PlayerIdentity, Location = ResponseCacheLocation.Any)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetPlayerIdentity(
            [FromBody] IList<IdentityQueryAlpha> identityQueries)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            string MakeKey(IdentityQueryAlpha identityQuery)
            {
                return WoodstockCacheKey.MakeIdentityLookupKey(endpoint, identityQuery.Gamertag, identityQuery.Xuid);
            }

            var cachedResults = identityQueries.Select(v => this.memoryCache.Get<IdentityResultAlpha>(MakeKey(v))).ToList();
            if (cachedResults.All(result => result != null))
            {
                return this.Ok(cachedResults.ToList());
            }

            var results = await this.woodstockPlayerDetailsProvider.GetPlayerIdentitiesAsync(
                identityQueries.ToList(),
                endpoint).ConfigureAwait(true);

            foreach (var result in results)
            {
                if (result.Error == null)
                {
                    this.memoryCache.GetOrCreate(
                        MakeKey(result.Query),
                        (entry) =>
                        {
                            entry.AbsoluteExpirationRelativeToNow =
                                TimeSpan.FromSeconds(CacheSeconds.PlayerIdentity);
                            return result;
                        });
                }
            }

            return this.Ok(results);
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        [HttpGet("player/gamertag({gamertag})/details")]
        [SwaggerResponse(200, type: typeof(WoodstockPlayerDetails))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetPlayerDetails(
            string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var playerDetails = await this.woodstockPlayerDetailsProvider.GetPlayerDetailsAsync(gamertag, endpoint)
                .ConfigureAwait(true);
            if (playerDetails == null)
            {
                throw new NotFoundStewardException($"Player {gamertag} was not found.");
            }

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Gets the player details.
        /// </summary>
        [HttpGet("player/xuid({xuid})/details")]
        [SwaggerResponse(200, type: typeof(WoodstockPlayerDetails))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetPlayerDetails(
            ulong xuid)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var playerDetails = await this.woodstockPlayerDetailsProvider.GetPlayerDetailsAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (playerDetails == null)
            {
                throw new NotFoundStewardException($"Player {xuid} was not found.");
            }

            return this.Ok(playerDetails);
        }

        /// <summary>
        ///     Gets the console details.
        /// </summary>
        [HttpGet("player/xuid({xuid})/consoleDetails")]
        [SwaggerResponse(200, type: typeof(List<ConsoleDetails>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetConsoles(
            ulong xuid,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var result = await this.woodstockPlayerDetailsProvider.GetConsolesAsync(xuid, maxResults, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Sets consoles ban status.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.SupportAgentNew)]
        [HttpPut("console/consoleId({consoleId})/consoleBanStatus/isBanned({isBanned})")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.Console)]
        [Authorize(Policy = UserAttribute.BanConsole)]
        public async Task<IActionResult> SetConsoleBanStatus(
            ulong consoleId,
            bool isBanned)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            await this.woodstockPlayerDetailsProvider.SetConsoleBanStatusAsync(consoleId, isBanned, endpoint)
                .ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        [HttpGet("player/xuid({xuid})/sharedConsoleUsers")]
        [SwaggerResponse(200, type: typeof(List<SharedConsoleUser>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetSharedConsoleUsers(
            ulong xuid,
            [FromQuery] int startIndex = 0,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var result = await this.woodstockPlayerDetailsProvider.GetSharedConsoleUsersAsync(
                xuid,
                startIndex,
                maxResults,
                endpoint).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets user flags.
        /// </summary>
        [HttpGet("player/xuid({xuid})/userFlags")]
        [SwaggerResponse(200, type: typeof(WoodstockUserFlags))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Group)]
        public async Task<IActionResult> GetUserFlags(
            ulong xuid)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var result = await this.woodstockPlayerDetailsProvider.GetUserFlagsAsync(xuid, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Sets user flags.
        /// </summary>
        [HttpPut("player/xuid({xuid})/userFlags")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.CommunityManager)]
        [SwaggerResponse(200, type: typeof(WoodstockUserFlags))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Group)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.UserFlags)]
        [Authorize(Policy = UserAttribute.UpdateUserFlags)]
        public async Task<IActionResult> SetUserFlags(
            ulong xuid,
            [FromBody] WoodstockUserFlagsInput userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));
            xuid.EnsureValidXuid();

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            this.userFlagsRequestValidator.Validate(userFlags, this.ModelState);
            if (!this.ModelState.IsValid)
            {
                var result = this.userFlagsRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var validatedFlags = this.mapper.Map<WoodstockUserFlags>(userFlags);
            await this.woodstockPlayerDetailsProvider.SetUserFlagsAsync(xuid, validatedFlags, endpoint)
                .ConfigureAwait(true);

            var results = await this.woodstockPlayerDetailsProvider.GetUserFlagsAsync(xuid, endpoint)
                .ConfigureAwait(true);

            return this.Ok(results);
        }

        /// <summary>
        ///     Gets the profile summary.
        /// </summary>
        [HttpGet("player/xuid({xuid})/profileSummary")]
        [SwaggerResponse(200, type: typeof(ProfileSummary))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetProfileSummary(
            ulong xuid)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var result = await this.woodstockPlayerDetailsProvider.GetProfileSummaryAsync(xuid, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets the user's profile notes.
        /// </summary>
        [HttpGet("player/xuid({xuid})/profileNotes")]
        [SwaggerResponse(200, type: typeof(IList<ProfileNote>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetProfileNotesAsync(
            ulong xuid)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var result = await this.woodstockPlayerDetailsProvider.GetProfileNotesAsync(xuid, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Adds a profile note to a user's profile.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin)]
        [HttpPost("player/xuid({xuid})/profileNotes")] // TODO: This should be /profileNotes/add
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(CodeName, StewardAction.Add, StewardSubject.ProfileNotes)]
        [Authorize(Policy = UserAttribute.AddProfileNote)]
        public async Task<IActionResult> AddProfileNoteAsync(
            ulong xuid,
            [FromBody] ProfileNote profileNote)
        {
            profileNote.ShouldNotBeNull(nameof(profileNote));
            xuid.EnsureValidXuid();

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var userClaims = this.User.UserClaims();
            profileNote.Author = userClaims.EmailAddress;

            await this.woodstockPlayerDetailsProvider.AddProfileNoteAsync(xuid, profileNote, endpoint)
                .ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        [HttpGet("player/xuid({xuid})/auctions")]
        [SwaggerResponse(200, type: typeof(IList<PlayerAuction>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Auctions)]
        public async Task<IActionResult> GetAuctions(
            ulong xuid,
            [FromQuery] short carId = short.MaxValue,
            [FromQuery] short makeId = short.MaxValue,
            [FromQuery] string status = "Any",
            [FromQuery] string sort = "ClosingDateDescending")
        {
            carId.ShouldNotBeNull(nameof(carId));
            makeId.ShouldNotBeNull(nameof(makeId));
            status.ShouldNotBeNull(nameof(status));
            sort.ShouldNotBeNull(nameof(sort));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            if (!Enum.TryParse(status, out AuctionStatus statusEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(AuctionStatus)} provided: {status}");
            }

            if (!Enum.TryParse(sort, out AuctionSort sortEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(AuctionSort)} provided: {sort}");
            }

            var results = await this.woodstockPlayerDetailsProvider
                .GetPlayerAuctionsAsync(xuid, new AuctionFilters(carId, makeId, statusEnum, sortEnum), endpoint)
                .ConfigureAwait(true);

            var cars = await this.itemsProvider.GetCarsAsync<SimpleCar>().ConfigureAwait(true);
            var carsDict = cars.ToDictionary(car => car.Id);

            foreach (var auction in results)
            {
                auction.ItemName = carsDict.TryGetValue(auction.ModelId, out var car) ? $"{car.Make} {car.Model}" : "No car name in Pegasus.";
            }

            return this.Ok(results);
        }

        /// <summary>
        ///     Gets a log of player auction actions.
        /// </summary>
        [HttpGet("player/xuid({xuid})/auctionLog")]
        [SwaggerResponse(200, type: typeof(IList<AuctionHistoryEntry>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Auctions)]
        public async Task<IActionResult> GetAuctionLog(ulong xuid, [FromQuery] string skipToken = null)
        {
            DateTime? skipTokenUtc = null;
            if (!string.IsNullOrWhiteSpace(skipToken))
            {
                if (!DateTimeOffset.TryParse(skipToken, out var skipTokenOffset))
                {
                    throw new BadRequestStewardException($"Invalid skipToken value '{skipToken}'. Could not convert to date-time.");
                }

                skipTokenUtc = skipTokenOffset.UtcDateTime;
            }

            var auctionLog = await this.kustoProvider.GetAuctionLogAsync(KustoGameDbSupportedTitle.Woodstock, xuid, skipTokenUtc).ConfigureAwait(true);

            return this.Ok(auctionLog);
        }

        /// <summary>
        ///     Gets a specific auction's details.
        /// </summary>
        [HttpGet("auction/{auctionId}/details")]
        [SwaggerResponse(200, type: typeof(AuctionData))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Auctions)]
        public async Task<IActionResult> GetAuctionDetails(string auctionId)
        {
            if (!Guid.TryParse(auctionId, out var parsedAuctionId))
            {
                throw new BadRequestStewardException("Auction ID could not be parsed as GUID.");
            }

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var auctionLog = await this.storefrontProvider.GetAuctionDataAsync(parsedAuctionId, endpoint).ConfigureAwait(true);

            return this.Ok(auctionLog);
        }

        /// <summary>
        ///     Cancels a specific auction.
        /// </summary>
        [HttpDelete("auction/{auctionId}")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Auctions)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.Auction)]
        [Authorize(Policy = UserAttribute.DeleteAuction)]
        public async Task<IActionResult> DeleteAuction(string auctionId)
        {
            if (!Guid.TryParse(auctionId, out var parsedAuctionId))
            {
                throw new BadRequestStewardException("Auction ID could not be parsed as GUID.");
            }

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var result = await this.storefrontProvider.DeleteAuctionAsync(parsedAuctionId, endpoint).ConfigureAwait(true);
            var realResult = result.result.First();
            if (!realResult.Success)
            {
                throw new CustomStewardException(
                    HttpStatusCode.BadGateway,
                    StewardErrorCode.ServicesFailure,
                    $"LSP failed to cancel auction {auctionId}");
            }

            return this.Ok();
        }

        /// <summary>
        ///     Gets auction house block list entries.
        /// </summary>
        [HttpGet("auctions/blocklist")]
        [SwaggerResponse(200, type: typeof(IList<AuctionBlockListEntry>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta | ActionAreaLogTags.Auctions)]
        public async Task<IActionResult> GetAuctionBlockList(
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0);

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var getCars = this.itemsProvider.GetCarsAsync<SimpleCar>(WoodstockPegasusSlot.LiveSteward);
            var getBlockList = this.woodstockServiceManagementProvider.GetAuctionBlockListAsync(maxResults, endpoint);

            await Task.WhenAll(getBlockList, getCars).ConfigureAwait(true);

            var blockList = getBlockList.GetAwaiter().GetResult();

            var carsDict = getCars.GetAwaiter().GetResult().ToDictionary(car => car.Id);
            foreach (var entry in blockList)
            {
                entry.Description = carsDict.TryGetValue(entry.CarId, out var car) ? $"{car.Make} {car.Model}" : "No car name in Pegasus.";
            }

            return this.Ok(blockList);
        }

        /// <summary>
        ///     Adds entries to auction house block list.
        /// </summary>
        [HttpPost("auctions/blocklist")]
        [SwaggerResponse(200, type: typeof(IList<AuctionBlockListEntry>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Create | ActionAreaLogTags.Meta | ActionAreaLogTags.Auctions)]
        [ManualActionLogging(CodeName, StewardAction.Add, StewardSubject.AuctionBlocklistEntry)]
        [Authorize(Policy = UserAttribute.UpdateAuctionBlocklist)]
        public async Task<IActionResult> AddEntriesToAuctionBlockList(
            [FromBody] IList<AuctionBlockListEntry> entries)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            await this.woodstockServiceManagementProvider.AddAuctionBlockListEntriesAsync(entries, endpoint).ConfigureAwait(true);

            var blockedCars = entries.Select(entry => Invariant($"{entry.CarId}")).ToList();
            await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.CarId, blockedCars).ConfigureAwait(true);

            return this.Ok(entries);
        }

        /// <summary>
        ///     Removes an entry from auction house block list.
        /// </summary>
        [HttpDelete("auctions/blocklist/carId({carId})")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Delete | ActionAreaLogTags.Meta | ActionAreaLogTags.Auctions)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.AuctionBlocklistEntry)]
        [Authorize(Policy = UserAttribute.UpdateAuctionBlocklist)]
        public async Task<IActionResult> RemoveEntryFromAuctionBlockList(
            int carId)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            await this.woodstockServiceManagementProvider.DeleteAuctionBlockListEntriesAsync(new List<int> { carId }, endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets player UGC items.
        /// </summary>
        [HttpGet("storefront/xuid({xuid})")]
        [SwaggerResponse(200, type: typeof(IList<WoodstockUgcItem>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcItems(ulong xuid, [FromQuery] string ugcType = "Unknown")
        {
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            if (!Enum.TryParse(ugcType, out UgcType typeEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(UgcType)} provided: {ugcType}");
            }

            var getUgcItems = this.storefrontProvider.GetPlayerUgcContentAsync(
                xuid,
                typeEnum,
                endpoint);
            var getCars = this.itemsProvider.GetCarsAsync<SimpleCar>();

            await Task.WhenAll(getUgcItems, getCars).ConfigureAwait(true);

            var ugcItems = getUgcItems.GetAwaiter().GetResult();
            var carsDict = getCars.GetAwaiter().GetResult().ToDictionary(car => car.Id);

            foreach (var item in ugcItems)
            {
                item.CarDescription = carsDict.TryGetValue(item.CarId, out var car) ? $"{car.Make} {car.Model}" : "No car name in Pegasus.";
            }

            return this.Ok(ugcItems);
        }

        /// <summary>
        ///     Gets UGC item by share code.
        /// </summary>
        [HttpGet("storefront/shareCode({shareCode})")]
        [SwaggerResponse(200, type: typeof(IList<WoodstockUgcItem>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcItems(string shareCode, [FromQuery] string ugcType = "Unknown")
        {
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            if (!Enum.TryParse(ugcType, out UgcType typeEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(UgcType)} provided: {ugcType}");
            }

            var filters = this.mapper.Map<ForzaUGCSearchRequest>(new UgcFilters(ulong.MaxValue, shareCode));

            var getUgcItems = this.storefrontProvider.SearchUgcContentAsync(
                typeEnum,
                filters,
                endpoint,
                includeThumbnails: true);
            var getCars = this.itemsProvider.GetCarsAsync<SimpleCar>();

            await Task.WhenAll(getUgcItems, getCars).ConfigureAwait(true);

            var ugCItems = getUgcItems.GetAwaiter().GetResult();
            var carsDict = getCars.GetAwaiter().GetResult().ToDictionary(car => car.Id);

            foreach (var item in ugCItems)
            {
                item.CarDescription = carsDict.TryGetValue(item.CarId, out var car) ? $"{car.Make} {car.Model}" : "No car name in Pegasus.";
            }

            return this.Ok(ugCItems);
        }

        /// <summary>
        ///     Gets a UGC livery by ID.
        /// </summary>
        [HttpGet("storefront/livery({id})")]
        [Obsolete("Use v2/woodstock/ugc/livery/{id}")]
        [SwaggerResponse(200, type: typeof(WoodstockUgcLiveryItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcLivery(Guid id)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var getLivery = this.storefrontProvider.GetUgcLiveryAsync(id, endpoint);
            var getCars = this.itemsProvider.GetCarsAsync<SimpleCar>();

            await Task.WhenAll(getLivery, getCars).ConfigureAwait(true);

            var livery = getLivery.GetAwaiter().GetResult();
            var cars = getCars.GetAwaiter().GetResult();

            var carData = cars.FirstOrDefault(car => car.Id == livery.CarId);
            livery.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : "No car name in Pegasus.";

            return this.Ok(livery);
        }

        /// <summary>
        ///     Gets a UGC photo by ID.
        /// </summary>
        [HttpGet("storefront/photo({id})")]
        [Obsolete("Use v2/woodstock/ugc/photo/{id}")]
        [SwaggerResponse(200, type: typeof(WoodstockUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcPhoto(Guid id)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var getPhoto = this.storefrontProvider.GetUgcPhotoAsync(id, endpoint);
            var getCars = this.itemsProvider.GetCarsAsync<SimpleCar>();

            await Task.WhenAll(getPhoto, getCars).ConfigureAwait(true);

            var photo = getPhoto.GetAwaiter().GetResult();
            var cars = getCars.GetAwaiter().GetResult();

            var carData = cars.FirstOrDefault(car => car.Id == photo.CarId);
            photo.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : "No car name in Pegasus.";

            return this.Ok(photo);
        }

        /// <summary>
        ///     Gets a UGC tune by ID.
        /// </summary>
        [HttpGet("storefront/tune({id})")]
        [Obsolete("Use v2/woodstock/ugc/tune/{id}")]
        [SwaggerResponse(200, type: typeof(WoodstockUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcTune(Guid id)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var getTune = this.storefrontProvider.GetUgcTuneAsync(id, endpoint);
            var getCars = this.itemsProvider.GetCarsAsync<SimpleCar>();

            await Task.WhenAll(getTune, getCars).ConfigureAwait(true);

            var tune = getTune.GetAwaiter().GetResult();
            var cars = getCars.GetAwaiter().GetResult();

            var carData = cars.FirstOrDefault(car => car.Id == tune.CarId);
            tune.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : "No car name in Pegasus.";

            return this.Ok(tune);
        }

        /// <summary>
        ///     Gets a UGC tune by ID.
        /// </summary>
        [HttpGet("storefront/eventBlueprint({id})")]
        [Obsolete("Use v2/woodstock/ugc/eventBlueprint/{id}")]
        [SwaggerResponse(200, type: typeof(WoodstockUgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcEventBlueprint(string id)
        {
            if (!Guid.TryParse(id, out var idAsGuid))
            {
                throw new InvalidArgumentsStewardException($"UGC item id provided is not a valid Guid: {id}");
            }

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var eventBlueprint = await this.storefrontProvider.GetUgcEventBlueprintAsync(idAsGuid, endpoint).ConfigureAwait(true);

            return this.Ok(eventBlueprint);
        }

        /// <summary>
        ///     Gets a UGC tune by ID.
        /// </summary>
        [HttpGet("storefront/communityChallenge({id})")]
        [Obsolete("Use v2/woodstock/ugc/communityChallenge/{id}")]
        [SwaggerResponse(200, type: typeof(UgcItem))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcCommunityChallenge(string id)
        {
            if (!Guid.TryParse(id, out var idAsGuid))
            {
                throw new InvalidArgumentsStewardException($"UGC item id provided is not a valid Guid: {id}");
            }

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var eventBlueprint = await this.storefrontProvider.GetUgcCommunityChallengeAsync(idAsGuid, endpoint).ConfigureAwait(true);

            return this.Ok(eventBlueprint);
        }

        /// <summary>
        ///     Sets featured status of a UGC content item.
        /// </summary>
        [HttpPost("storefront/itemId({ugcId})/featuredStatus")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Meta | ActionAreaLogTags.Ugc)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.UserGeneratedContent)]
        [Authorize(Policy = UserAttribute.FeatureUgc)]
        public async Task<IActionResult> SetUgcFeaturedStatus(
            string ugcId,
            [FromBody] UgcFeaturedStatus status)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            if (!Guid.TryParse(ugcId, out var itemIdGuid))
            {
                throw new InvalidArgumentsStewardException($"UGC item id provided is not a valid Guid: {ugcId}");
            }

            if (status.IsFeatured && !status.Expiry.HasValue)
            {
                throw new InvalidArgumentsStewardException($"Required query param is missing: {nameof(status.Expiry)}");
            }

            if (status.IsFeatured)
            {
                status.Expiry?.ShouldBeOverMinimumDuration(TimeSpan.FromDays(1), nameof(status.Expiry));
            }

            await this.storefrontProvider.SetUgcFeaturedStatusAsync(
                itemIdGuid,
                status.IsFeatured,
                status.Expiry,
                endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets hidden player UGC content.
        /// </summary>
        [HttpGet("storefront/xuid({xuid})/hidden")]
        [SwaggerResponse(200, type: typeof(IList<HideableUgc>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Delete | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetPlayerHiddenUGC(ulong xuid)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var hiddenUgc = await this.storefrontProvider.GetHiddenUgcForUserAsync(xuid, endpoint).ConfigureAwait(true);

            return this.Ok(hiddenUgc);
        }

        /// <summary>
        ///     Unhides player UGC content.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.CommunityManager)]
        [HttpPost("storefront/{xuid}/ugc/{fileType}/{ugcId}/unhide")]
        [SwaggerResponse(200)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.UserGeneratedContent)]
        [Authorize(Policy = UserAttribute.UnhideUgc)]
        public async Task<IActionResult> UnhideUGC(ulong xuid, string fileType, string ugcId)
        {
            fileType.ShouldNotBeNull(nameof(fileType));
            xuid.EnsureValidXuid();

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            if (!Guid.TryParse(ugcId, out var itemIdGuid))
            {
                throw new InvalidArgumentsStewardException($"UGC item id provided is not a valid Guid: {ugcId}");
            }

            if (!Enum.TryParse(fileType, out FileType fileTypeEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(FileType)} provided: {fileType}");
            }

            await this.storefrontProvider.UnhideUgcAsync(xuid, itemIdGuid, fileTypeEnum, endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets backstage pass updates.
        /// </summary>
        [NonAction] // TODO: Remove when ready (https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/888818)
        [HttpGet("player/xuid({xuid})/backstagePassUpdates")]
        [SwaggerResponse(200, type: typeof(List<BackstagePassUpdate>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetBackstagePassUpdates(
            ulong xuid)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No account inventory found for XUID: {xuid}");
            }

            var result = await this.woodstockPlayerDetailsProvider.GetBackstagePassUpdatesAsync(xuid, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.SupportAgentNew)]
        [HttpPost("players/ban/useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.BackgroundProcessing)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Banning)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
        [Authorize(Policy = UserAttribute.BanPlayer)]
        public async Task<IActionResult> BanPlayersUseBackgroundProcessing(
            [FromBody] IList<WoodstockBanParametersInput> banInput)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            banInput.ShouldNotBeNull(nameof(banInput));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            foreach (var banParam in banInput)
            {
                this.banParametersRequestValidator.ValidateIds(banParam, this.ModelState);
                this.banParametersRequestValidator.Validate(banParam, this.ModelState);
            }

            var banParameters = this.mapper.Map<IList<WoodstockBanParameters>>(banInput);

            if (!this.ModelState.IsValid)
            {
                var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            var jobId = await this.jobTracker.CreateNewJobAsync(
                banParameters.ToJson(),
                requesterObjectId,
                $"Woodstock Banning: {banParameters.Count} recipients.",
                this.Response).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var results = await this.woodstockPlayerDetailsProvider.BanUsersAsync(
                        banParameters,
                        requesterObjectId,
                        endpoint).ConfigureAwait(true);

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

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.SupportAgentNew)]
        [HttpPost("players/ban")]
        [SwaggerResponse(201, type: typeof(List<BanResult>))]
        [SwaggerResponse(202)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Banning)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
        [Authorize(Policy = UserAttribute.BanPlayer)]
        public async Task<IActionResult> BanPlayers(
            [FromBody] IList<WoodstockBanParametersInput> banInput)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            banInput.ShouldNotBeNull(nameof(banInput));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            foreach (var banParam in banInput)
            {
                this.banParametersRequestValidator.ValidateIds(banParam, this.ModelState);
                this.banParametersRequestValidator.Validate(banParam, this.ModelState);
            }

            var banParameters = this.mapper.Map<IList<WoodstockBanParameters>>(banInput);

            if (!this.ModelState.IsValid)
            {
                var result = this.banParametersRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            var results = await this.woodstockPlayerDetailsProvider.BanUsersAsync(
                banParameters,
                requesterObjectId,
                endpoint).ConfigureAwait(true);

            var bannedXuids = results.Where(banResult => banResult.Error == null)
                .Select(banResult => Invariant($"{banResult.Xuid}")).ToList();

            await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, bannedXuids)
                .ConfigureAwait(true);

            return this.Ok(results);
        }

        /// <summary>
        ///     Expire ban.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent)]
        [HttpPost("ban/{banEntryId}/expire")]
        [SwaggerResponse(201, type: typeof(UnbanResult))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Banning)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
        [Authorize(Policy = UserAttribute.DeleteBan)]
        public async Task<IActionResult> ExpireBan(int banEntryId)
        {
            banEntryId.ShouldBeGreaterThanValue(-1);

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var result = await this.woodstockPlayerDetailsProvider.ExpireBanAsync(banEntryId, endpoint)
                .ConfigureAwait(true);

            if (!result.Success)
            {
                throw new BadRequestStewardException($"Failed to expire ban with ID: {banEntryId}");
            }

            return this.Ok(result);
        }

        /// <summary>
        ///     Delete ban.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent)]
        [HttpPost("ban/{banEntryId}/delete")]
        [SwaggerResponse(201, type: typeof(UnbanResult))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Delete | ActionAreaLogTags.Banning)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.Players)]
        [Authorize(Policy = UserAttribute.DeleteBan)]
        public async Task<IActionResult> DeleteBan(int banEntryId)
        {
            banEntryId.ShouldBeGreaterThanValue(-1);

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var result = await this.woodstockPlayerDetailsProvider.DeleteBanAsync(banEntryId, endpoint)
                .ConfigureAwait(true);

            if (!result.Success && !result.Deleted)
            {
                throw new BadRequestStewardException($"Failed to delete ban with ID: {banEntryId}");
            }

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        [HttpPost("players/banSummaries")]
        [SwaggerResponse(200, type: typeof(IList<BanSummary>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Banning)]
        public async Task<IActionResult> GetBanSummaries(
            [FromBody] IList<ulong> xuids)
        {
            xuids.ShouldNotBeNull(nameof(xuids));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var result = await this.woodstockPlayerDetailsProvider.GetUserBanSummariesAsync(xuids, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        [HttpGet("player/xuid({xuid})/banHistory")]
        [SwaggerResponse(200, type: typeof(IList<LiveOpsBanHistory>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Banning)]
        public async Task<IActionResult> GetBanHistory(
            ulong xuid)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var result = await this.GetBanHistoryAsync(xuid, endpoint).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        [HttpGet("player/gamertag({gamertag})/banHistory")]
        [SwaggerResponse(200, type: typeof(IList<LiveOpsBanHistory>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Banning)]
        public async Task<IActionResult> GetBanHistory(
            string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var playerDetails = await this.woodstockPlayerDetailsProvider.GetPlayerDetailsAsync(gamertag, endpoint)
                .ConfigureAwait(true);

            if (playerDetails == null)
            {
                throw new NotFoundStewardException($"Player {gamertag} was not found.");
            }

            var result = await this.GetBanHistoryAsync(playerDetails.Xuid, endpoint).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets groups.
        /// </summary>
        [HttpGet("groups")]
        [SwaggerResponse(200, type: typeof(IList<LspGroup>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Group)]
        public async Task<IActionResult> GetGroups()
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var result = await this.woodstockServiceManagementProvider.GetLspGroupsAsync(
                endpoint).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet("player/xuid({xuid})/inventory")]
        [SwaggerResponse(200, type: typeof(WoodstockPlayerInventory))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.UserInventory | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Group)]
        public async Task<IActionResult> GetPlayerInventory(
            ulong xuid)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var getPlayerInventory = this.woodstockPlayerInventoryProvider.GetPlayerInventoryAsync(xuid, endpoint);
            var getMasterInventory = this.itemsProvider.GetMasterInventoryAsync();

            await Task.WhenAll(getPlayerInventory, getMasterInventory).ConfigureAwait(true);

            var playerInventory = await getPlayerInventory.ConfigureAwait(true);
            var masterInventory = await getMasterInventory.ConfigureAwait(true);

            if (playerInventory == null)
            {
                throw new NotFoundStewardException($"No inventory found for XUID: {xuid}.");
            }

            playerInventory.SetItemDescriptions(
                masterInventory,
                $"XUID: {xuid}",
                this.loggingService);
            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet("player/profileId({profileId})/inventory")]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.UserInventory | DependencyLogTags.Kusto)]
        [SwaggerResponse(200, type: typeof(WoodstockPlayerInventory))]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        public async Task<IActionResult> GetPlayerInventoryByProfileId(
            int profileId)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var getPlayerInventory = this.woodstockPlayerInventoryProvider.GetPlayerInventoryAsync(
                profileId,
                endpoint);
            var getMasterInventory = this.itemsProvider.GetMasterInventoryAsync();

            await Task.WhenAll(getPlayerInventory, getMasterInventory).ConfigureAwait(true);

            var playerInventory = await getPlayerInventory.ConfigureAwait(true);
            var masterInventory = await getMasterInventory.ConfigureAwait(true);

            if (playerInventory == null)
            {
                throw new NotFoundStewardException($"No inventory found for Profile ID: {profileId}.");
            }

            playerInventory.SetItemDescriptions(
                masterInventory,
                $"Profile Id: {profileId}",
                this.loggingService);
            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gets the player inventory profiles.
        /// </summary>
        [HttpGet("player/xuid({xuid})/inventoryProfiles")]
        [SwaggerResponse(200, type: typeof(IList<WoodstockInventoryProfile>))]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.UserInventory)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        public async Task<IActionResult> GetPlayerInventoryProfiles(
            ulong xuid)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var inventoryProfileSummary = await this.woodstockPlayerInventoryProvider.GetInventoryProfilesAsync(
                xuid,
                endpoint).ConfigureAwait(true);

            if (inventoryProfileSummary == null)
            {
                throw new NotFoundStewardException($"No inventory profiles found for XUID: {xuid}.");
            }

            return this.Ok(inventoryProfileSummary);
        }

        /// <summary>
        ///     Gets the account inventory.
        /// </summary>
        [NonAction] // TODO: Remove when ready (https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/888818)
        [HttpGet("player/xuid({xuid})/accountInventory")]
        [SwaggerResponse(200, type: typeof(WoodstockAccountInventory))]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.UserInventory)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        public async Task<IActionResult> GetAccountInventory(
            ulong xuid)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No account inventory found for XUID: {xuid}");
            }

            var inventoryProfileSummary = await this.woodstockPlayerInventoryProvider.GetAccountInventoryAsync(
                xuid,
                endpoint).ConfigureAwait(true);

            return this.Ok(inventoryProfileSummary);
        }

        /// <summary>
<<<<<<< HEAD
=======
        ///     Updates player inventories with given items.
        /// </summary>
        [HttpPost("gifting/players/useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Kusto | DependencyLogTags.BackgroundProcessing)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerInventories)]
        [Authorize(Policy = UserAttribute.GiftPlayer)]
        public async Task<IActionResult> UpdateGroupInventoriesUseBackgroundProcessing(
            [FromBody] WoodstockGroupGift groupGift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var stringBuilder = new StringBuilder();

            this.groupGiftRequestValidator.ValidateIds(groupGift, this.ModelState);
            this.groupGiftRequestValidator.Validate(groupGift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var errorResponse = this.groupGiftRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(errorResponse);
            }

            foreach (var xuid in groupGift.Xuids)
            {
                var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                    .ConfigureAwait(true);
                if (!playerExists)
                {
                    stringBuilder.Append($"{xuid} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Players with XUIDs: {stringBuilder} were not found.");
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventoryAsync(groupGift.Inventory)
                .ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Invalid items found. {invalidItems}");
            }

            var jobId = await this.jobTracker.CreateNewJobAsync(
                groupGift.ToJson(),
                requesterObjectId,
                $"Woodstock Gifting: {groupGift.Xuids.Count} recipients.",
                this.Response).ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var allowedToExceedCreditLimit =
                        userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
                    var response = await this.woodstockPlayerInventoryProvider.UpdatePlayerInventoriesAsync(
                        groupGift,
                        requesterObjectId,
                        allowedToExceedCreditLimit,
                        endpoint).ConfigureAwait(true);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus(response);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response)
                        .ConfigureAwait(true);

                    var giftedXuids = response.Select(successfulResponse => Invariant($"{successfulResponse.PlayerOrLspGroup}")).ToList();

                    await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, giftedXuids)
                        .ConfigureAwait(true);
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed)
                        .ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }

        /// <summary>
        ///     Updates player inventories with given items.
        /// </summary>
        [HttpPost("gifting/players")]
        [SwaggerResponse(200, type: typeof(IList<GiftResponse<ulong>>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerInventories)]
        [Authorize(Policy = UserAttribute.GiftPlayer)]
        public async Task<IActionResult> UpdateGroupInventories(
            [FromBody] WoodstockGroupGift groupGift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var stringBuilder = new StringBuilder();

            this.groupGiftRequestValidator.ValidateIds(groupGift, this.ModelState);
            this.groupGiftRequestValidator.Validate(groupGift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var errorResponse = this.groupGiftRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(errorResponse);
            }

            foreach (var xuid in groupGift.Xuids)
            {
                var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                    .ConfigureAwait(true);
                if (!playerExists)
                {
                    stringBuilder.Append($"{xuid} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Players with XUIDs: {stringBuilder} were not found.");
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventoryAsync(groupGift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Invalid items found. {invalidItems}");
            }

            var allowedToExceedCreditLimit =
                userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
            var response = await this.woodstockPlayerInventoryProvider.UpdatePlayerInventoriesAsync(
                groupGift,
                requesterObjectId,
                allowedToExceedCreditLimit,
                endpoint).ConfigureAwait(true);

            var giftedXuids = response.Select(successfulResponse => Invariant($"{successfulResponse.PlayerOrLspGroup}")).ToList();

            await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, giftedXuids)
                .ConfigureAwait(true);

            return this.Ok(response);
        }

        /// <summary>
        ///     Updates inventories for an LSP group.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [HttpPost("gifting/groupId({groupId})")]
        [SwaggerResponse(200, type: typeof(GiftResponse<int>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.GroupInventories)]
        [Authorize(Policy = UserAttribute.GiftGroup)]
        public async Task<IActionResult> UpdateGroupInventories(
            int groupId,
            [FromBody] WoodstockGift gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            gift.ShouldNotBeNull(nameof(gift));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            this.giftRequestValidator.Validate(gift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var result = this.masterInventoryRequestValidator.GenerateErrorResponse(this.ModelState);

                throw new InvalidArgumentsStewardException(result);
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventoryAsync(gift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Invalid items found. {invalidItems}");
            }

            var allowedToExceedCreditLimit =
                userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
            var response = await this.woodstockPlayerInventoryProvider.UpdateGroupInventoriesAsync(
                groupId,
                gift,
                requesterObjectId,
                allowedToExceedCreditLimit,
                endpoint).ConfigureAwait(true);
            return this.Ok(response);
        }

        /// <summary>
        ///     Gift players a car livery.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager,
            UserRole.MediaTeam)]
        [HttpPost("gifting/livery({liveryId})/players/useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto | DependencyLogTags.BackgroundProcessing)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerInventories)]
        [Authorize(Policy = UserAttribute.GiftPlayer)]
        public async Task<IActionResult> GiftLiveryToPlayersUseBackgroundProcessing(Guid liveryId, [FromBody] ExpirableGroupGift groupGift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Xuids.EnsureValidXuids();
            groupGift.GiftReason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(groupGift.GiftReason));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var stringBuilder = new StringBuilder();

            foreach (var xuid in groupGift.Xuids)
            {
                if (!await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint).ConfigureAwait(true))
                {
                    stringBuilder.Append($"{xuid} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Players with XUIDs: {stringBuilder} were not found.");
            }

            var livery = await this.storefrontProvider.GetUgcLiveryAsync(liveryId, endpoint).ConfigureAwait(true);
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
                    var response = await this.woodstockPlayerInventoryProvider.SendCarLiveryAsync(groupGift, livery, requesterObjectId, endpoint).ConfigureAwait(true);

                    var jobStatus = BackgroundJobHelpers.GetBackgroundJobStatus<ulong>(response);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response).ConfigureAwait(true);

                    var giftedXuids = response.Select(successfulResponse => Invariant($"{successfulResponse.PlayerOrLspGroup}")).ToList();

                    await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, giftedXuids)
                        .ConfigureAwait(true);
                }
                catch (Exception)
                {
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, BackgroundJobStatus.Failed).ConfigureAwait(true);
                }
            }

            this.scheduler.QueueBackgroundWorkItem(BackgroundProcessing);

            return BackgroundJobHelpers.GetCreatedResult(this.Created, this.Request.Scheme, this.Request.Host, jobId);
        }

        /// <summary>
        ///     Updates inventories for an LSP group.
        /// </summary>
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [HttpPost("gifting/livery({liveryId})/groupId({groupId})")]
        [SwaggerResponse(200, type: typeof(GiftResponse<int>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.GroupInventories)]
        [Authorize(Policy = UserAttribute.GiftGroup)]
        public async Task<IActionResult> GiftLiveryToUserGroup(Guid liveryId, int groupId, [FromBody] ExpirableGift gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            groupId.ShouldNotBeNull(nameof(groupId));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var livery = await this.storefrontProvider.GetUgcLiveryAsync(liveryId, endpoint).ConfigureAwait(true);
            if (livery == null)
            {
                throw new InvalidArgumentsStewardException($"Invalid livery id: {liveryId}");
            }

            var response = await this.woodstockPlayerInventoryProvider.SendCarLiveryAsync(gift, groupId, livery, requesterObjectId, endpoint).ConfigureAwait(true);
            return this.Ok(response);
        }

        /// <summary>
>>>>>>> 6859ac9bebafc141552615d635ff3df7994af4ba
        ///     Gets the gift histories.
        /// </summary>
        [HttpGet("player/xuid({xuid})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<WoodstockGiftHistory>))]
        [LogTagDependency(DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta | ActionAreaLogTags.Gifting)]
        public async Task<IActionResult> GetGiftHistoriesAsync(
            ulong xuid,
            [FromQuery] DateTimeOffset? startDate,
            [FromQuery] DateTimeOffset? endDate)
        {
            if (startDate.HasValue && endDate.HasValue && DateTimeOffset.Compare(startDate.Value, endDate.Value) >= 0)
            {
                throw new BadRequestStewardException("Start date must come before end date: " +
                    $"({nameof(startDate)}: {startDate}) ({nameof(endDate)}: {endDate})");
            }

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(
                xuid.ToString(CultureInfo.InvariantCulture),
                TitleConstants.WoodstockCodeName,
                GiftIdentityAntecedent.Xuid,
                endpoint,
                startDate,
                endDate).ConfigureAwait(true);

            return this.Ok(giftHistory);
        }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        [HttpGet("group/groupId({groupId})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<WoodstockGiftHistory>))]
        [LogTagDependency(DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta | ActionAreaLogTags.Gifting)]
        public async Task<IActionResult> GetGiftHistoriesAsync(
            int groupId,
            [FromQuery] DateTimeOffset? startDate,
            [FromQuery] DateTimeOffset? endDate)
        {
            if (startDate.HasValue && endDate.HasValue && DateTimeOffset.Compare(startDate.Value, endDate.Value) >= 0)
            {
                throw new BadRequestStewardException("Start date must come before end date: " +
                    $"({nameof(startDate)}: {startDate}) ({nameof(endDate)}: {endDate})");
            }

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(
                groupId.ToString(CultureInfo.InvariantCulture),
                TitleConstants.WoodstockCodeName,
                GiftIdentityAntecedent.LspGroupId,
                endpoint,
                startDate,
                endDate).ConfigureAwait(true);

            return this.Ok(giftHistory);
        }

        /// <summary>
        ///     Gets the notification histories.
        /// </summary>
        [HttpGet("notification/{notificationId}/history")]
        [SwaggerResponse(200, type: typeof(IList<NotificationHistory>))]
        [LogTagDependency(DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta | ActionAreaLogTags.Notification)]
        public async Task<IActionResult> GetNotificationHistoriesAsync(
            string notificationId)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var notificationHistory = await this.notificationHistoryProvider.GetNotificationHistoriesAsync(
                notificationId,
                TitleConstants.WoodstockCodeName,
                endpoint).ConfigureAwait(true);

            return this.Ok(notificationHistory);
        }

        /// <summary>
        ///     Gets the player notifications.
        /// </summary>
        [HttpGet("player/xuid({xuid})/notifications")]
        [SwaggerResponse(200, type: typeof(IList<Notification>))]
        [LogTagDependency(DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Notification)]
        public async Task<IActionResult> GetPlayerNotifications(
            ulong xuid,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var notifications = await this.woodstockNotificationProvider.GetPlayerNotificationsAsync(
                xuid,
                maxResults,
                endpoint).ConfigureAwait(true);

            return this.Ok(notifications);
        }

        /// <summary>
        ///     Gets the user group notifications.
        /// </summary>
        [HttpGet("group/groupId({groupId})/notifications")]
        [SwaggerResponse(200, type: typeof(IList<UserGroupNotification>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Lookup | ActionAreaLogTags.Notification)]
        public async Task<IActionResult> GetGroupNotifications(
            int groupId,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var notifications = await this.woodstockNotificationProvider.GetGroupNotificationsAsync(
                groupId,
                maxResults,
                endpoint).ConfigureAwait(true);

            return this.Ok(notifications);
        }

        /// <summary>
        ///     Sends the players notifications.
        /// </summary>
        [HttpPost("notifications/send")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200, type: typeof(IList<MessageSendResult<ulong>>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Create | ActionAreaLogTags.Notification)]
        [ManualActionLogging(CodeName, StewardAction.Add, StewardSubject.PlayerMessages)]
        [Authorize(Policy = UserAttribute.MessagePlayer)]
        public async Task<IActionResult> SendPlayerNotifications(
            [FromBody] BulkCommunityMessage communityMessage)
        {
            communityMessage.ShouldNotBeNull(nameof(communityMessage));
            communityMessage.Xuids.EnsureValidXuids();
            communityMessage.Message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(communityMessage.Message));
            communityMessage.Message.ShouldBeUnderMaxLength(512, nameof(communityMessage.Message));
            communityMessage.ExpireTimeUtc.IsAfterOrThrows(communityMessage.StartTimeUtc, nameof(communityMessage.ExpireTimeUtc), nameof(communityMessage.StartTimeUtc));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            var stringBuilder = new StringBuilder();

            foreach (var xuid in communityMessage.Xuids)
            {
                var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                    .ConfigureAwait(true);
                if (!playerExists)
                {
                    stringBuilder.Append($"{xuid} ");
                }
            }

            if (stringBuilder.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Players with XUIDs: {stringBuilder} were not found.");
            }

            var notifications = await this.woodstockNotificationProvider.SendNotificationsAsync(
                communityMessage.Xuids,
                communityMessage.Message,
                communityMessage.StartTimeUtc,
                communityMessage.ExpireTimeUtc,
                requesterObjectId,
                endpoint).ConfigureAwait(true);

            var recipientXuids = notifications.Where(result => result.Error == null)
                .Select(result => Invariant($"{result.PlayerOrLspGroup}")).ToList();

            await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.Xuid, recipientXuids)
                .ConfigureAwait(true);

            return this.Ok(notifications);
        }

        /// <summary>
        ///     Sends the group notifications.
        /// </summary>
        [HttpPost("notifications/send/groupId({groupId})")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200, type: typeof(MessageSendResult<int>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Create | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.Add, StewardSubject.GroupMessages)]
        [Authorize(Policy = UserAttribute.MessageGroup)]
        public async Task<IActionResult> SendGroupNotifications(
            int groupId,
            [FromBody] LspGroupCommunityMessage communityMessage)
        {
            communityMessage.ShouldNotBeNull(nameof(communityMessage));
            communityMessage.Message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(communityMessage.Message));
            communityMessage.Message.ShouldBeUnderMaxLength(512, nameof(communityMessage.Message));
            communityMessage.ExpireTimeUtc.IsAfterOrThrows(communityMessage.StartTimeUtc, nameof(communityMessage.ExpireTimeUtc), nameof(communityMessage.StartTimeUtc));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            var groups = await this.woodstockServiceManagementProvider.GetLspGroupsAsync(
                endpoint).ConfigureAwait(true);
            if (groups.All(x => x.Id != groupId))
            {
                throw new InvalidArgumentsStewardException($"Group ID: {groupId} could not be found.");
            }

            var result = await this.woodstockNotificationProvider.SendGroupNotificationAsync(
                groupId,
                communityMessage.Message,
                communityMessage.StartTimeUtc,
                communityMessage.ExpireTimeUtc,
                communityMessage.DeviceType,
                requesterObjectId,
                endpoint).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Edit the player notification.
        /// </summary>
        [HttpPost("player/xuid({xuid})/notifications/notificationId({notificationId})")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerMessages)]
        [Authorize(Policy = UserAttribute.MessagePlayer)]
        public async Task<IActionResult> EditPlayerNotification(
            Guid notificationId,
            ulong xuid,
            [FromBody] CommunityMessage editParameters)
        {
            editParameters.ShouldNotBeNull(nameof(editParameters));
            editParameters.Message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(editParameters.Message));
            editParameters.Message.ShouldBeUnderMaxLength(512, nameof(editParameters.Message));
            xuid.EnsureValidXuid();
            editParameters.ExpireTimeUtc.IsAfterOrThrows(editParameters.StartTimeUtc, nameof(editParameters.ExpireTimeUtc), nameof(editParameters.StartTimeUtc));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            /* TODO: Verify notification exists and is a CommunityMessageNotification before allowing edit.
            // Tracked by: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/903790
            */
            await this.woodstockNotificationProvider.EditNotificationAsync(
                notificationId,
                xuid,
                editParameters.Message,
                editParameters.ExpireTimeUtc,
                requesterObjectId,
                endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Edit the group notification.
        /// </summary>
        [HttpPost("notifications/notificationId({notificationId})")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Update | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.Update, StewardSubject.GroupMessages)]
        [Authorize(Policy = UserAttribute.MessageGroup)]
        public async Task<IActionResult> EditGroupNotification(
            Guid notificationId,
            [FromBody] LspGroupCommunityMessage editParameters)
        {
            editParameters.ShouldNotBeNull(nameof(editParameters));
            editParameters.Message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(editParameters.Message));
            editParameters.Message.ShouldBeUnderMaxLength(512, nameof(editParameters.Message));
            editParameters.ExpireTimeUtc.IsAfterOrThrows(editParameters.StartTimeUtc, nameof(editParameters.ExpireTimeUtc), nameof(editParameters.StartTimeUtc));

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            var notification = await this.woodstockNotificationProvider.GetGroupNotificationAsync(notificationId, endpoint)
                .ConfigureAwait(true);

            if (notification.NotificationType != "CommunityMessageNotification")
            {
                throw new FailedToSendStewardException(
                    $"Cannot edit notification of type: {notification.NotificationType}.");
            }

            await this.woodstockNotificationProvider.EditGroupNotificationAsync(
                notificationId,
                editParameters.Message,
                editParameters.ExpireTimeUtc,
                editParameters.DeviceType,
                requesterObjectId,
                endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Deletes the player notification.
        /// </summary>
        [HttpDelete("player/xuid({xuid})/notifications/notificationId({notificationId})")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Delete | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.PlayerMessages)]
        [Authorize(Policy = UserAttribute.MessagePlayer)]
        public async Task<IActionResult> DeletePlayerNotification(Guid notificationId, ulong xuid)
        {
            xuid.EnsureValidXuid();

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            var playerExists = await this.woodstockPlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            await this.woodstockNotificationProvider.DeleteNotificationAsync(
                notificationId,
                xuid,
                requesterObjectId,
                endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Deletes group notification.
        /// </summary>
        [HttpDelete("notifications/notificationId({notificationId})")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Delete | ActionAreaLogTags.Notification)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.GroupMessages)]
        [Authorize(Policy = UserAttribute.MessageGroup)]
        public async Task<IActionResult> DeleteGroupNotification(Guid notificationId)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            await this.woodstockNotificationProvider.DeleteGroupNotificationAsync(
                notificationId,
                requesterObjectId,
                endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets the leaderboards.
        /// </summary>
        [HttpGet("leaderboards")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager,
            UserRole.HorizonDesigner)]
        [SwaggerResponse(200, type: typeof(IEnumerable<Leaderboard>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Leaderboards)]
        public async Task<IActionResult> GetLeaderboards([FromQuery] string pegasusEnvironment = null)
        {
            var environment = WoodstockPegasusEnvironment.RetrieveEnvironment(pegasusEnvironment);

            var leaderboards = await this.leaderboardProvider.GetLeaderboardsAsync(environment).ConfigureAwait(true);

            return this.Ok(leaderboards);
        }

        /// <summary>
        ///     Gets leaderboard metadata.
        /// </summary>
        [HttpGet("leaderboard/metadata")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager,
            UserRole.HorizonDesigner)]
        [SwaggerResponse(200, type: typeof(Leaderboard))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta | ActionAreaLogTags.Leaderboards)]
        public async Task<IActionResult> GetLeaderboardMetadata(
            [FromQuery] ScoreboardType scoreboardType,
            [FromQuery] ScoreType scoreType,
            [FromQuery] int trackId,
            [FromQuery] string pivotId,
            [FromQuery] string pegasusEnvironment = null)
        {
            var environment = WoodstockPegasusEnvironment.RetrieveEnvironment(pegasusEnvironment);

            var allLeaderboards = await this.leaderboardProvider.GetLeaderboardsAsync(environment).ConfigureAwait(true);

            var leaderboard = allLeaderboards.FirstOrDefault(leaderboard => leaderboard.ScoreboardTypeId == (int)scoreboardType
                && leaderboard.ScoreTypeId == (int)scoreType
                && leaderboard.TrackId == trackId
                && leaderboard.GameScoreboardId.ToString() == pivotId);

            if (leaderboard == null)
            {
                throw new BadRequestStewardException($"Could not find leaderboard from provided params. ScoreboardType: " +
                                                     $"{scoreboardType}, ScoreType: {scoreType}, TrackId: {trackId}, PivotId: {pivotId},");
            }

            return this.Ok(leaderboard);
        }

        /// <summary>
        ///     Gets the leaderboard scores.
        /// </summary>
        [HttpGet("leaderboard/scores/top")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager,
            UserRole.HorizonDesigner)]
        [SwaggerResponse(200, type: typeof(IEnumerable<LeaderboardScore>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Leaderboards)]
        public async Task<IActionResult> GetLeaderboardScores(
            [FromQuery] ScoreboardType scoreboardType,
            [FromQuery] ScoreType scoreType,
            [FromQuery] int trackId,
            [FromQuery] string pivotId,
            [FromQuery] DeviceType[] deviceTypes,
            [FromQuery] int startAt = 0,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var scores = await this.leaderboardProvider.GetLeaderboardScoresAsync(
                scoreboardType,
                scoreType,
                trackId,
                pivotId,
                deviceTypes,
                startAt,
                maxResults,
                endpoint).ConfigureAwait(true);

            return this.Ok(scores);
        }

        /// <summary>
        ///     Gets the leaderboard scores around a player.
        /// </summary>
        [HttpGet("leaderboard/scores/near-player/{xuid}")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager,
            UserRole.HorizonDesigner)]
        [SwaggerResponse(200, type: typeof(IEnumerable<LeaderboardScore>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Leaderboards)]
        public async Task<IActionResult> GetLeaderboardScoresAroundXuid(
            ulong xuid,
            [FromQuery] ScoreboardType scoreboardType,
            [FromQuery] ScoreType scoreType,
            [FromQuery] int trackId,
            [FromQuery] string pivotId,
            [FromQuery] DeviceType[] deviceTypes,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            xuid.EnsureValidXuid();

            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            var scores = await this.leaderboardProvider.GetLeaderboardScoresAsync(
                xuid,
                scoreboardType,
                scoreType,
                trackId,
                pivotId,
                deviceTypes,
                maxResults,
                endpoint).ConfigureAwait(true);

            return this.Ok(scores);
        }

        /// <summary>
        ///     Deletes leaderboard scores.
        /// </summary>
        [HttpPost("leaderboard/scores/delete")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager,
            UserRole.HorizonDesigner)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Leaderboards)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Delete | ActionAreaLogTags.Leaderboards)]
        [ManualActionLogging(CodeName, StewardAction.Delete, StewardSubject.Leaderboards)]
        [Authorize(Policy = UserAttribute.DeleteLeaderboardScores)]
        public async Task<IActionResult> DeleteLeaderboardScores([FromBody] Guid[] scoreIds)
        {
            var endpoint = WoodstockEndpoint.GetEndpoint(this.Request.Headers);

            await this.leaderboardProvider.DeleteLeaderboardScoresAsync(scoreIds, endpoint).ConfigureAwait(true);

            var deletedScores = scoreIds.Select(scoreId => Invariant($"{scoreId}")).ToList();
            await this.actionLogger.UpdateActionTrackingTableAsync(
                RecipientType.ScoreId,
                deletedScores).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        private async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid, string endpoint)
        {
            var getServicesBanHistory = this.woodstockPlayerDetailsProvider.GetUserBanHistoryAsync(xuid, endpoint);
            var getLiveOpsBanHistory = this.banHistoryProvider.GetBanHistoriesAsync(
                xuid,
                TitleConstants.WoodstockCodeName,
                endpoint);

            await Task.WhenAll(getServicesBanHistory, getLiveOpsBanHistory).ConfigureAwait(true);

            var servicesBanHistory = await getServicesBanHistory.ConfigureAwait(true);
            var liveOpsBanHistory = await getLiveOpsBanHistory.ConfigureAwait(true);

            var banHistories = BanHistoryConsolidationHelper.ConsolidateBanHistory(liveOpsBanHistory, servicesBanHistory, this.loggingService, CodeName.ToString());

            banHistories.Sort((x, y) => y.ExpireTimeUtc.CompareTo(x.ExpireTimeUtc));

            return banHistories;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        private async Task<string> VerifyGiftAgainstMasterInventoryAsync(WoodstockMasterInventory gift)
        {
            var masterInventoryItem = await this.itemsProvider.GetMasterInventoryAsync().ConfigureAwait(true);
            var error = string.Empty;

            foreach (var car in gift.Cars)
            {
                var validItem = masterInventoryItem.Cars.Any(data => data.Id == car.Id);
                error += validItem
                    ? string.Empty : $"Car: {car.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var carHorn in gift.CarHorns)
            {
                var validItem = masterInventoryItem.CarHorns.Any(data => data.Id == carHorn.Id);
                error += validItem
                    ? string.Empty : $"CarHorn: {carHorn.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var vanityItem in gift.VanityItems)
            {
                var validItem = masterInventoryItem.VanityItems.Any(data => data.Id == vanityItem.Id);
                error += validItem
                    ? string.Empty : $"VanityItem: {vanityItem.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var emote in gift.Emotes)
            {
                var validItem = masterInventoryItem.Emotes.Any(data => data.Id == emote.Id);
                error += validItem ? string.Empty : $"Emote: {emote.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var quickChatLine in gift.QuickChatLines)
            {
                var validItem = masterInventoryItem.QuickChatLines.Any(data => data.Id == quickChatLine.Id);
                error += validItem
                    ? string.Empty : $"QuickChatLine: {quickChatLine.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            return error;
        }
    }
}
