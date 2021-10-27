using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Sunrise;
using Turn10.LiveOps.StewardApi.Validation;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles requests for Sunrise.
    /// </summary>
    [Route("api/v1/title/Sunrise")]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager)]
    [System.Diagnostics.CodeAnalysis.SuppressMessage(
        "Microsoft.Maintainability",
        "CA1506:AvoidExcessiveClassCoupling",
        Justification = "This can't be avoided.")]
    public sealed class SunriseController : ControllerBase
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 100;
        private const string DefaultEndpointKey = "Sunrise|Retail";

        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.KeyVaultUrl,
            ConfigurationKeyConstants.GroupGiftPasswordSecretName
        };

        private readonly IMemoryCache memoryCache;
        private readonly ILoggingService loggingService;
        private readonly IKustoProvider kustoProvider;
        private readonly ISunrisePlayerInventoryProvider sunrisePlayerInventoryProvider;
        private readonly ISunrisePlayerDetailsProvider sunrisePlayerDetailsProvider;
        private readonly ISunriseServiceManagementProvider sunriseServiceManagementProvider;
        private readonly ISunriseNotificationProvider sunriseNotificationProvider;
        private readonly ISunriseGiftHistoryProvider giftHistoryProvider;
        private readonly ISunriseBanHistoryProvider banHistoryProvider;
        private readonly ISunriseStorefrontProvider storefrontProvider;
        private readonly IJobTracker jobTracker;
        private readonly IMapper mapper;
        private readonly IScheduler scheduler;
        private readonly IRequestValidator<SunriseMasterInventory> masterInventoryRequestValidator;
        private readonly IRequestValidator<SunriseGift> giftRequestValidator;
        private readonly IRequestValidator<SunriseGroupGift> groupGiftRequestValidator;
        private readonly IRequestValidator<SunriseBanParametersInput> banParametersRequestValidator;
        private readonly IRequestValidator<SunriseUserFlagsInput> userFlagsRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseController"/> class.
        /// </summary>
        public SunriseController(
            IMemoryCache memoryCache,
            ILoggingService loggingService,
            IKustoProvider kustoProvider,
            ISunrisePlayerDetailsProvider sunrisePlayerDetailsProvider,
            ISunrisePlayerInventoryProvider sunrisePlayerInventoryProvider,
            ISunriseServiceManagementProvider sunriseServiceManagementProvider,
            ISunriseNotificationProvider sunriseNotificationProvider,
            IKeyVaultProvider keyVaultProvider,
            ISunriseGiftHistoryProvider giftHistoryProvider,
            ISunriseBanHistoryProvider banHistoryProvider,
            ISunriseStorefrontProvider storefrontProvider,
            IConfiguration configuration,
            IScheduler scheduler,
            IJobTracker jobTracker,
            IMapper mapper,
            IRequestValidator<SunriseMasterInventory> masterInventoryRequestValidator,
            IRequestValidator<SunriseGift> giftRequestValidator,
            IRequestValidator<SunriseGroupGift> groupGiftRequestValidator,
            IRequestValidator<SunriseBanParametersInput> banParametersRequestValidator,
            IRequestValidator<SunriseUserFlagsInput> userFlagsRequestValidator)
        {
            memoryCache.ShouldNotBeNull(nameof(memoryCache));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            kustoProvider.ShouldNotBeNull(nameof(kustoProvider));
            sunrisePlayerDetailsProvider.ShouldNotBeNull(nameof(sunrisePlayerDetailsProvider));
            sunrisePlayerInventoryProvider.ShouldNotBeNull(nameof(sunrisePlayerInventoryProvider));
            sunriseServiceManagementProvider.ShouldNotBeNull(nameof(sunriseServiceManagementProvider));
            sunriseNotificationProvider.ShouldNotBeNull(nameof(sunriseNotificationProvider));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            giftHistoryProvider.ShouldNotBeNull(nameof(giftHistoryProvider));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            storefrontProvider.ShouldNotBeNull(nameof(storefrontProvider));
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
            this.loggingService = loggingService;
            this.kustoProvider = kustoProvider;
            this.sunrisePlayerDetailsProvider = sunrisePlayerDetailsProvider;
            this.sunrisePlayerInventoryProvider = sunrisePlayerInventoryProvider;
            this.storefrontProvider = storefrontProvider;
            this.sunriseServiceManagementProvider = sunriseServiceManagementProvider;
            this.sunriseNotificationProvider = sunriseNotificationProvider;
            this.giftHistoryProvider = giftHistoryProvider;
            this.banHistoryProvider = banHistoryProvider;
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
        ///     Gets the master inventory data.
        /// </summary>
        [HttpGet("masterInventory")]
        [SwaggerResponse(200, type: typeof(SunriseMasterInventory))]
        public async Task<IActionResult> GetMasterInventoryList()
        {
            var masterInventory = await this.RetrieveMasterInventoryList().ConfigureAwait(true);
            return this.Ok(masterInventory);
        }

        /// <summary>
        ///     Gets the master car list.
        /// </summary>
        [HttpGet("kusto/cars")]
        [SwaggerResponse(200, type: typeof(IList<KustoCar>))]
        public async Task<IActionResult> GetDetailedKustoCars()
        {
            var cars = await this.kustoProvider.GetDetailedKustoCars(KustoQueries.GetFH4CarsDetailed).ConfigureAwait(true);
            return this.Ok(cars);
        }

        /// <summary>
        ///     Gets the player identity.
        /// </summary>
        [HttpPost("players/identities")]
        [SwaggerResponse(200, type: typeof(List<IdentityResultAlpha>))]
        [ResponseCache(Duration = CacheSeconds.PlayerIdentity, Location = ResponseCacheLocation.Any)]
        public async Task<IActionResult> GetPlayerIdentity(
            [FromBody] IList<IdentityQueryAlpha> identityQueries)
        {
            identityQueries.ShouldNotBeNull(nameof(identityQueries));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            string MakeKey(IdentityQueryAlpha identityQuery)
            {
                return SunriseCacheKey.MakeIdentityLookupKey(endpoint, identityQuery.Gamertag, identityQuery.Xuid);
            }

            var cachedResults = identityQueries.Select(v => this.memoryCache.Get<IdentityResultAlpha>(MakeKey(v)));
            if (cachedResults.All(result => result != null))
            {
                return this.Ok(cachedResults.ToList());
            }

            var results = await this.sunrisePlayerDetailsProvider.GetPlayerIdentitiesAsync(
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
        [SwaggerResponse(200, type: typeof(SunrisePlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(
            string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var playerDetails = await this.sunrisePlayerDetailsProvider.GetPlayerDetailsAsync(gamertag, endpoint)
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
        [SwaggerResponse(200, type: typeof(SunrisePlayerDetails))]
        public async Task<IActionResult> GetPlayerDetails(
            ulong xuid)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var playerDetails = await this.sunrisePlayerDetailsProvider.GetPlayerDetailsAsync(xuid, endpoint)
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
        public async Task<IActionResult> GetConsoles(
            ulong xuid,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var result = await this.sunrisePlayerDetailsProvider.GetConsolesAsync(xuid, maxResults, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets shared console users.
        /// </summary>
        [HttpGet("player/xuid({xuid})/sharedConsoleUsers")]
        [SwaggerResponse(200, type: typeof(List<SharedConsoleUser>))]
        public async Task<IActionResult> GetSharedConsoleUsers(
            ulong xuid,
            [FromQuery] int startIndex = DefaultStartIndex,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var result = await this.sunrisePlayerDetailsProvider.GetSharedConsoleUsersAsync(
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
        [SwaggerResponse(200, type: typeof(SunriseUserFlags))]
        public async Task<IActionResult> GetUserFlags(
            ulong xuid)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var result = await this.sunrisePlayerDetailsProvider.GetUserFlagsAsync(xuid, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Sets user flags.
        /// </summary>
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent)]
        [HttpPut("player/xuid({xuid})/userFlags")]
        [SwaggerResponse(200, type: typeof(SunriseUserFlags))]
        public async Task<IActionResult> SetUserFlags(
            ulong xuid,
            [FromBody] SunriseUserFlagsInput userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            this.userFlagsRequestValidator.Validate(userFlags, this.ModelState);
            if (!this.ModelState.IsValid)
            {
                var result = this.userFlagsRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var validatedFlags = this.mapper.Map<SunriseUserFlags>(userFlags);
            await this.sunrisePlayerDetailsProvider.SetUserFlagsAsync(xuid, validatedFlags, endpoint)
                .ConfigureAwait(true);

            var results = await this.sunrisePlayerDetailsProvider.GetUserFlagsAsync(xuid, endpoint)
                .ConfigureAwait(true);

            return this.Ok(results);
        }

        /// <summary>
        ///     Gets the profile summary.
        /// </summary>
        [HttpGet("player/xuid({xuid})/profileSummary")]
        [SwaggerResponse(200, type: typeof(ProfileSummary))]
        public async Task<IActionResult> GetProfileSummary(
            ulong xuid)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var result = await this.sunrisePlayerDetailsProvider.GetProfileSummaryAsync(xuid, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets the user's profile notes.
        /// </summary>
        [HttpGet("player/xuid({xuid})/profileNotes")]
        [SwaggerResponse(200, type: typeof(IList<ProfileNote>))]
        public async Task<IActionResult> GetProfileNotesAsync(
            ulong xuid)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var result = await this.sunrisePlayerDetailsProvider.GetProfileNotesAsync(xuid, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Adds a profile note to a user's profile.
        /// </summary>
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin)]
        [HttpPost("player/xuid({xuid})/profileNotes")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> AddProfileNoteAsync(
            ulong xuid,
            [FromBody] ProfileNote profileNote)
        {
            profileNote.ShouldNotBeNull(nameof(profileNote));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var userClaims = this.User.UserClaims();
            profileNote.Author = userClaims.EmailAddress;

            await this.sunrisePlayerDetailsProvider.AddProfileNoteAsync(xuid, profileNote, endpoint)
                .ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets credit updates.
        /// </summary>
        [HttpGet("player/xuid({xuid})/creditUpdates")]
        [SwaggerResponse(200, type: typeof(List<CreditUpdate>))]
        public async Task<IActionResult> GetCreditUpdates(
            ulong xuid,
            [FromQuery] int startIndex = DefaultStartIndex,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var result = await this.sunrisePlayerDetailsProvider.GetCreditUpdatesAsync(
                xuid,
                startIndex,
                maxResults,
                endpoint).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets player auctions.
        /// </summary>
        [HttpGet("player/xuid({xuid})/auctions")]
        [SwaggerResponse(200, type: typeof(IList<PlayerAuction>))]
        public async Task<IActionResult> GetAuctions(
            ulong xuid,
            [FromQuery] short carId = short.MaxValue,
            [FromQuery] short makeId = short.MaxValue,
            [FromQuery] string status = "Any",
            [FromQuery] string sort = "ClosingDateDescending")
        {
            status.ShouldNotBeNullEmptyOrWhiteSpace(nameof(status));
            sort.ShouldNotBeNullEmptyOrWhiteSpace(nameof(sort));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            if (!Enum.TryParse(status, out AuctionStatus statusEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(AuctionStatus)} provided: {status}");
            }

            if (!Enum.TryParse(sort, out AuctionSort sortEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(AuctionSort)} provided: {sort}");
            }

            var getAuctions = this.sunrisePlayerDetailsProvider.GetPlayerAuctionsAsync(
                xuid,
                new AuctionFilters(carId, makeId, statusEnum, sortEnum),
                endpoint);
            var getKustoCars = this.kustoProvider.GetDetailedKustoCars(KustoQueries.GetFH4CarsDetailed);

            await Task.WhenAll(getAuctions, getKustoCars).ConfigureAwait(true);

            var auctions = getAuctions.Result;
            var kustoCars = getKustoCars.Result;

            foreach (var auction in auctions)
            {
                var carData = kustoCars.FirstOrDefault(car => car.Id == auction.ModelId);
                auction.ItemName = carData != null ? $"{carData.Make} {carData.Model}" : "No car name in Kusto.";
            }

            return this.Ok(auctions);
        }

        /// <summary>
        ///     Gets a log of player auction actions.
        /// </summary>
        [HttpGet("player/xuid({xuid})/auctionLog")]
        [SwaggerResponse(200, type: typeof(IList<AuctionHistoryEntry>))]
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

            var auctionLog = await this.kustoProvider.GetAuctionLogAsync(xuid, skipTokenUtc).ConfigureAwait(true);

            return this.Ok(auctionLog);
        }

        /// <summary>
        ///     Gets a specific auction's details.
        /// </summary>
        [HttpGet("auction/{auctionId}/details")]
        [SwaggerResponse(200, type: typeof(AuctionData))]
        public async Task<IActionResult> GetAuctionDetails(string auctionId)
        {
            if (!Guid.TryParse(auctionId, out var parsedAuctionId))
            {
                throw new BadRequestStewardException("Auction ID could not be parsed as GUID.");
            }

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var auctionLog = await this.storefrontProvider.GetAuctionDataAsync(parsedAuctionId, endpoint).ConfigureAwait(true);

            return this.Ok(auctionLog);
        }

        /// <summary>
        ///     Gets player UGC items.
        /// </summary>
        [HttpGet("storefront/xuid({xuid})")]
        [SwaggerResponse(200, type: typeof(IList<UGCItem>))]
        public async Task<IActionResult> GetUGCItems(ulong xuid, [FromQuery] string ugcType = "Unknown")
        {
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            if (!Enum.TryParse(ugcType, out UGCType typeEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(UGCType)} provided: {ugcType}");
            }

            var getUgcItems = this.storefrontProvider.SearchUGCItems(
                typeEnum,
                new UGCFilters(xuid, null),
                endpoint);
            var getKustoCars = this.kustoProvider.GetDetailedKustoCars(KustoQueries.GetFH4CarsDetailed);

            await Task.WhenAll(getUgcItems, getKustoCars).ConfigureAwait(true);

            var ugCItems = getUgcItems.Result;
            var kustoCars = getKustoCars.Result;

            foreach (var item in ugCItems)
            {
                var carData = kustoCars.FirstOrDefault(car => car.Id == item.CarId);
                item.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : string.Empty;
            }

            return this.Ok(ugCItems);
        }

        /// <summary>
        ///     Gets UGC item by share code.
        /// </summary>
        [HttpGet("storefront/shareCode({shareCode})")]
        [SwaggerResponse(200, type: typeof(IList<UGCItem>))]
        public async Task<IActionResult> GetUGCItems(string shareCode, [FromQuery] string ugcType = "Unknown")
        {
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            if (!Enum.TryParse(ugcType, out UGCType typeEnum))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(UGCType)} provided: {ugcType}");
            }

            var getUgcItems = this.storefrontProvider.SearchUGCItems(
                typeEnum,
                new UGCFilters(ulong.MaxValue, shareCode),
                endpoint);
            var getKustoCars = this.kustoProvider.GetDetailedKustoCars(KustoQueries.GetFH4CarsDetailed);

            await Task.WhenAll(getUgcItems, getKustoCars).ConfigureAwait(true);

            var ugCItems = getUgcItems.Result;
            var kustoCars = getKustoCars.Result;

            foreach (var item in ugCItems)
            {
                var carData = kustoCars.FirstOrDefault(car => car.Id == item.CarId);
                item.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : string.Empty;
            }

            return this.Ok(ugCItems);
        }

        /// <summary>
        ///     Gets a UGC livery by ID.
        /// </summary>
        [HttpGet("storefront/livery({id})")]
        [SwaggerResponse(200, type: typeof(UGCItem))]
        public async Task<IActionResult> GetUGCLivery(Guid id)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);

            var getLivery = this.storefrontProvider.GetUGCLivery(id, endpoint);
            var getKustoCars = this.kustoProvider.GetDetailedKustoCars(KustoQueries.GetFH4CarsDetailed);

            await Task.WhenAll(getLivery, getKustoCars).ConfigureAwait(true);

            var livery = getLivery.Result;
            var kustoCars = getKustoCars.Result;

            var carData = kustoCars.FirstOrDefault(car => car.Id == livery.CarId);
            livery.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : string.Empty;

            return this.Ok(livery);
        }

        /// <summary>
        ///     Gets a UGC photo by ID.
        /// </summary>
        [HttpGet("storefront/photo({id})")]
        [SwaggerResponse(200, type: typeof(UGCItem))]
        public async Task<IActionResult> GetUGCPhoto(Guid id)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);

            var getPhoto = this.storefrontProvider.GetUGCPhoto(id, endpoint);
            var getKustoCars = this.kustoProvider.GetDetailedKustoCars(KustoQueries.GetFH4CarsDetailed);

            await Task.WhenAll(getPhoto, getKustoCars).ConfigureAwait(true);

            var photo = getPhoto.Result;
            var kustoCars = getKustoCars.Result;

            var carData = kustoCars.FirstOrDefault(car => car.Id == photo.CarId);
            photo.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : string.Empty;

            return this.Ok(photo);
        }

        /// <summary>
        ///     Gets a UGC photo by ID.
        /// </summary>
        [HttpGet("storefront/tune({id})")]
        [SwaggerResponse(200, type: typeof(UGCItem))]
        public async Task<IActionResult> GetUGCTune(Guid id)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);

            var getTune = this.storefrontProvider.GetUGCTune(id, endpoint);
            var getKustoCars = this.kustoProvider.GetDetailedKustoCars(KustoQueries.GetFH4CarsDetailed);

            await Task.WhenAll(getTune, getKustoCars).ConfigureAwait(true);

            var tune = getTune.Result;
            var kustoCars = getKustoCars.Result;

            var carData = kustoCars.FirstOrDefault(car => car.Id == tune.CarId);
            tune.CarDescription = carData != null ? $"{carData.Make} {carData.Model}" : string.Empty;

            return this.Ok(tune);
        }

        /// <summary>
        ///     Sets featured status of a UGC content item.
        /// </summary>
        [HttpPost("storefront/itemId({itemId})/featuredStatus")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> SetUGCFeaturedStatus(
            string itemId,
            [FromBody] UGCFeaturedStatus status)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            if (!Guid.TryParse(itemId, out var itemIdGuid))
            {
                throw new InvalidArgumentsStewardException($"UGC item id provided is not a valid Guid: {itemId}");
            }

            if (status.IsFeatured && !status.Expiry.HasValue)
            {
                throw new InvalidArgumentsStewardException($"Required query param is missing: {nameof(status.Expiry)}");
            }

            if (status.IsFeatured && status.Expiry.HasValue)
            {
                status.Expiry.Value.ShouldBeOverMinimumDuration(TimeSpan.FromDays(1), nameof(status.Expiry));
            }

            await this.storefrontProvider.SetUGCFeaturedStatus(
                itemIdGuid,
                status.IsFeatured,
                status.Expiry,
                endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets auction house blocklist entries.
        /// </summary>
        [HttpGet("auctions/blocklist")]
        [SwaggerResponse(200, type: typeof(IList<AuctionBlocklistEntry>))]
        public async Task<IActionResult> GetAuctionBlocklist(
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0);

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var getBlocklist = this.sunriseServiceManagementProvider.GetAuctionBlocklistAsync(maxResults, endpoint);
            var getKustoCars = this.kustoProvider.GetDetailedKustoCars(KustoQueries.GetFH4CarsDetailed);

            await Task.WhenAll(getBlocklist, getKustoCars).ConfigureAwait(true);

            var blocklist = getBlocklist.Result;
            var kustoCars = getKustoCars.Result;

            foreach (var entry in blocklist)
            {
                var carData = kustoCars.FirstOrDefault(car => car.Id == entry.CarId);
                entry.Description = carData != null ? $"{carData.Make} {carData.Model}" : "No car name in Kusto.";
            }

            return this.Ok(blocklist);
        }

        /// <summary>
        ///     Adds entries to auction house blocklist.
        /// </summary>
        [HttpPost("auctions/blocklist")]
        [SwaggerResponse(200, type: typeof(IList<AuctionBlocklistEntry>))]
        public async Task<IActionResult> AddEntriesToAuctionBlocklist(
            [FromBody] IList<AuctionBlocklistEntry> entries)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            await this.sunriseServiceManagementProvider.AddAuctionBlocklistEntriesAsync(entries, endpoint).ConfigureAwait(true);

            return this.Ok(entries);
        }

        /// <summary>
        ///     Removes an entry from auction house blocklist.
        /// </summary>
        [HttpDelete("auctions/blocklist/carId({carId})")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> RemoveEntryFromAuctionBlocklist(
            int carId)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            await this.sunriseServiceManagementProvider.DeleteAuctionBlocklistEntriesAsync(new List<int> { carId }, endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets backstage pass updates.
        /// </summary>
        [HttpGet("player/xuid({xuid})/backstagePassUpdates")]
        [SwaggerResponse(200, type: typeof(List<BackstagePassUpdate>))]
        public async Task<IActionResult> GetBackstagePassUpdates(
            ulong xuid)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No account inventory found for XUID: {xuid}");
            }

            var result = await this.sunrisePlayerDetailsProvider.GetBackstagePassUpdatesAsync(xuid, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Bans players.
        /// </summary>
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.SupportAgentNew)]
        [HttpPost("players/ban/useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        public async Task<IActionResult> BanPlayersUseBackgroundProcessing(
            [FromBody] IList<SunriseBanParametersInput> banInput)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            banInput.ShouldNotBeNull(nameof(banInput));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
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

            var banParameters = this.mapper.Map<IList<SunriseBanParameters>>(banInput);
            var jobId = await this.AddJobIdToHeaderAsync(
                banParameters.ToJson(),
                requesterObjectId,
                $"Sunrise Banning: {banParameters.Count} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var results = await this.sunrisePlayerDetailsProvider.BanUsersAsync(
                        banParameters,
                        requesterObjectId,
                        endpoint).ConfigureAwait(true);
                    var jobStatus = BackgroundJobExtensions.GetBackgroundJobStatus(results);
                    await this.jobTracker
                        .UpdateJobAsync(
                            jobId,
                            requesterObjectId,
                            jobStatus,
                            results)
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

        /// <summary>
        ///     Bans players.
        /// </summary>
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.SupportAgentNew)]
        [HttpPost("players/ban")]
        [SwaggerResponse(201, type: typeof(List<BanResult>))]
        [SwaggerResponse(202)]
        public async Task<IActionResult> BanPlayers(
            [FromBody] IList<SunriseBanParametersInput> banInput)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            banInput.ShouldNotBeNull(nameof(banInput));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
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

            var banParameters = this.mapper.Map<IList<SunriseBanParameters>>(banInput);
            var results = await this.sunrisePlayerDetailsProvider.BanUsersAsync(
                banParameters,
                requesterObjectId,
                endpoint).ConfigureAwait(true);

            return this.Ok(results);
        }

        /// <summary>
        ///     Gets ban summaries.
        /// </summary>
        [HttpPost("players/banSummaries")]
        [SwaggerResponse(200, type: typeof(IList<BanSummary>))]
        public async Task<IActionResult> GetBanSummaries(
            [FromBody] IList<ulong> xuids)
        {
            xuids.ShouldNotBeNull(nameof(xuids));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var result = await this.sunrisePlayerDetailsProvider.GetUserBanSummariesAsync(xuids, endpoint)
                .ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        [HttpGet("player/xuid({xuid})/banHistory")]
        [SwaggerResponse(200, type: typeof(IList<LiveOpsBanHistory>))]
        public async Task<IActionResult> GetBanHistory(
            ulong xuid)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var result = await this.GetBanHistoryAsync(xuid, endpoint).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        [HttpGet("player/gamertag({gamertag})/banHistory")]
        [SwaggerResponse(200, type: typeof(IList<LiveOpsBanHistory>))]
        public async Task<IActionResult> GetBanHistory(
            string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var playerDetails = await this.sunrisePlayerDetailsProvider.GetPlayerDetailsAsync(gamertag, endpoint)
                .ConfigureAwait(true);

            if (playerDetails == null)
            {
                throw new NotFoundStewardException($"Player {gamertag} was not found.");
            }

            var result = await this.GetBanHistoryAsync(playerDetails.Xuid, endpoint).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Sets consoles ban status.
        /// </summary>
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent,
            UserRole.SupportAgentNew)]
        [HttpPut("console/consoleId({consoleId})/consoleBanStatus/isBanned({isBanned})")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> SetConsoleBanStatus(
            ulong consoleId,
            bool isBanned)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            await this.sunrisePlayerDetailsProvider.SetConsoleBanStatusAsync(consoleId, isBanned, endpoint)
                .ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet("player/xuid({xuid})/inventory")]
        [SwaggerResponse(200, type: typeof(SunrisePlayerInventory))]
        public async Task<IActionResult> GetPlayerInventory(
            ulong xuid)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var getPlayerInventory = this.sunrisePlayerInventoryProvider.GetPlayerInventoryAsync(xuid, endpoint);
            var getMasterInventory = this.RetrieveMasterInventoryList();

            await Task.WhenAll(getPlayerInventory, getMasterInventory).ConfigureAwait(true);

            var playerInventory = await getPlayerInventory.ConfigureAwait(true);
            var masterInventory = await getMasterInventory.ConfigureAwait(true);

            if (playerInventory == null)
            {
                throw new NotFoundStewardException($"No inventory found for XUID: {xuid}.");
            }

            playerInventory = StewardMasterItemHelpers.SetItemDescriptions(
                playerInventory,
                masterInventory,
                this.loggingService);
            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gets the player inventory.
        /// </summary>
        [HttpGet("player/profileId({profileId})/inventory")]
        [SwaggerResponse(200, type: typeof(SunrisePlayerInventory))]
        public async Task<IActionResult> GetPlayerInventoryByProfileId(
            int profileId)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var getPlayerInventory = this.sunrisePlayerInventoryProvider.GetPlayerInventoryAsync(
                profileId,
                endpoint);
            var getMasterInventory = this.RetrieveMasterInventoryList();

            await Task.WhenAll(getPlayerInventory, getMasterInventory).ConfigureAwait(true);

            var playerInventory = await getPlayerInventory.ConfigureAwait(true);
            var masterInventory = await getMasterInventory.ConfigureAwait(true);

            if (playerInventory == null)
            {
                throw new NotFoundStewardException($"No inventory found for Profile ID: {profileId}.");
            }

            playerInventory = StewardMasterItemHelpers.SetItemDescriptions(
                playerInventory,
                masterInventory,
                this.loggingService);
            return this.Ok(playerInventory);
        }

        /// <summary>
        ///     Gets the player inventory profiles.
        /// </summary>
        [HttpGet("player/xuid({xuid})/inventoryProfiles")]
        [SwaggerResponse(200, type: typeof(IList<SunriseInventoryProfile>))]
        [SwaggerResponse(200)]
        public async Task<IActionResult> GetPlayerInventoryProfiles(
            ulong xuid)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var inventoryProfileSummary = await this.sunrisePlayerInventoryProvider.GetInventoryProfilesAsync(
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
        [HttpGet("player/xuid({xuid})/accountInventory")]
        [SwaggerResponse(200, type: typeof(SunriseAccountInventory))]
        [SwaggerResponse(200)]
        public async Task<IActionResult> GetAccountInventory(
            ulong xuid)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No account inventory found for XUID: {xuid}");
            }

            var accountInventory = await this.sunrisePlayerInventoryProvider.GetAccountInventoryAsync(
                xuid,
                endpoint).ConfigureAwait(true);

            return this.Ok(accountInventory);
        }

        /// <summary>
        ///     Gets groups.
        /// </summary>
        [HttpGet("groups")]
        [SwaggerResponse(200, type: typeof(IList<LspGroup>))]
        public async Task<IActionResult> GetGroups()
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var result = await this.sunriseServiceManagementProvider.GetLspGroupsAsync(
                endpoint).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Updates player inventories with given items.
        /// </summary>
        [HttpPost("gifting/players/useBackgroundProcessing")]
        [SwaggerResponse(202, type: typeof(BackgroundJob))]
        public async Task<IActionResult> UpdateGroupInventoriesUseBackgroundProcessing(
            [FromBody] SunriseGroupGift groupGift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var stringBuilder = new StringBuilder();
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);

            this.groupGiftRequestValidator.ValidateIds(groupGift, this.ModelState);
            this.groupGiftRequestValidator.Validate(groupGift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var errorResponse = this.groupGiftRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(errorResponse);
            }

            foreach (var xuid in groupGift.Xuids)
            {
                var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
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

            var invalidItems = await this.VerifyGiftAgainstMasterInventory(groupGift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Invalid items found. {invalidItems}");
            }

            var jobId = await this.AddJobIdToHeaderAsync(
                groupGift.ToJson(),
                requesterObjectId,
                $"Sunrise Gifting: {groupGift.Xuids.Count} recipients.").ConfigureAwait(true);

            async Task BackgroundProcessing(CancellationToken cancellationToken)
            {
                // Throwing within the hosting environment background worker seems to have significant consequences.
                // Do not throw.
                try
                {
                    var allowedToExceedCreditLimit =
                        userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
                    var response = await this.sunrisePlayerInventoryProvider.UpdatePlayerInventoriesAsync(
                        groupGift,
                        requesterObjectId,
                        allowedToExceedCreditLimit,
                        endpoint).ConfigureAwait(true);

                    var jobStatus = BackgroundJobExtensions.GetBackgroundJobStatus<ulong>(response);
                    await this.jobTracker.UpdateJobAsync(jobId, requesterObjectId, jobStatus, response)
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

        /// <summary>
        ///     Updates player inventories with given items.
        /// </summary>
        [HttpPost("gifting/players")]
        [SwaggerResponse(200, type: typeof(IList<GiftResponse<ulong>>))]
        public async Task<IActionResult> UpdateGroupInventories(
            [FromBody] SunriseGroupGift groupGift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;

            groupGift.ShouldNotBeNull(nameof(groupGift));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            groupGift.Inventory.ShouldNotBeNull(nameof(groupGift.Inventory));
            groupGift.Xuids.ShouldNotBeNull(nameof(groupGift.Xuids));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
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
                var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
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

            var invalidItems = await this.VerifyGiftAgainstMasterInventory(groupGift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Invalid items found. {invalidItems}");
            }

            var allowedToExceedCreditLimit =
                userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
            var response = await this.sunrisePlayerInventoryProvider.UpdatePlayerInventoriesAsync(
                groupGift,
                requesterObjectId,
                allowedToExceedCreditLimit,
                endpoint).ConfigureAwait(true);
            return this.Ok(response);
        }

        /// <summary>
        ///     Updates inventories for an LSP group.
        /// </summary>
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin)]
        [HttpPost("gifting/groupId({groupId})")]
        [SwaggerResponse(200, type: typeof(GiftResponse<int>))]
        public async Task<IActionResult> UpdateGroupInventories(
            int groupId,
            [FromBody] SunriseGift gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            gift.ShouldNotBeNull(nameof(gift));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            this.giftRequestValidator.Validate(gift, this.ModelState);

            if (!this.ModelState.IsValid)
            {
                var result = this.masterInventoryRequestValidator.GenerateErrorResponse(this.ModelState);

                throw new InvalidArgumentsStewardException(result);
            }

            var invalidItems = await this.VerifyGiftAgainstMasterInventory(gift.Inventory).ConfigureAwait(true);
            if (invalidItems.Length > 0)
            {
                throw new InvalidArgumentsStewardException($"Invalid items found. {invalidItems}");
            }

            var allowedToExceedCreditLimit =
                userClaims.Role == UserRole.SupportAgentAdmin || userClaims.Role == UserRole.LiveOpsAdmin;
            var response = await this.sunrisePlayerInventoryProvider.UpdateGroupInventoriesAsync(
                groupId,
                gift,
                requesterObjectId,
                allowedToExceedCreditLimit,
                endpoint).ConfigureAwait(true);
            return this.Ok(response);
        }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        [HttpGet("player/xuid({xuid})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<SunriseGiftHistory>))]
        public async Task<IActionResult> GetGiftHistoriesAsync(
            ulong xuid)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(
                xuid.ToString(CultureInfo.InvariantCulture),
                TitleConstants.SunriseCodeName,
                GiftIdentityAntecedent.Xuid,
                endpoint).ConfigureAwait(true);

            return this.Ok(giftHistory);
        }

        /// <summary>
        ///     Gets the gift histories.
        /// </summary>
        [HttpGet("group/groupId({groupId})/giftHistory")]
        [SwaggerResponse(200, type: typeof(IList<SunriseGiftHistory>))]
        public async Task<IActionResult> GetGiftHistoriesAsync(
            int groupId)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var giftHistory = await this.giftHistoryProvider.GetGiftHistoriesAsync(
                groupId.ToString(CultureInfo.InvariantCulture),
                TitleConstants.SunriseCodeName,
                GiftIdentityAntecedent.LspGroupId,
                endpoint).ConfigureAwait(true);

            return this.Ok(giftHistory);
        }

        /// <summary>
        ///     Gets the player notifications.
        /// </summary>
        [HttpGet("player/xuid({xuid})/notifications")]
        [SwaggerResponse(200, type: typeof(IList<Notification>))]
        public async Task<IActionResult> GetPlayerNotifications(
            ulong xuid,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var notifications = await this.sunriseNotificationProvider.GetPlayerNotificationsAsync(
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
        public async Task<IActionResult> GetGroupNotifications(
            int groupId,
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var notifications = await this.sunriseNotificationProvider.GetGroupNotificationsAsync(
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
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200, type: typeof(IList<MessageSendResult<ulong>>))]
        public async Task<IActionResult> SendPlayerNotifications(
            [FromBody] BulkCommunityMessage communityMessage)
        {
            communityMessage.ShouldNotBeNull(nameof(communityMessage));
            communityMessage.Message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(communityMessage.Message));
            communityMessage.Message.ShouldBeUnderMaxLength(512, nameof(communityMessage.Message));
            communityMessage.Duration.ShouldBeOverMinimumDuration(
                TimeSpan.FromDays(1),
                nameof(communityMessage.Duration));

            var stringBuilder = new StringBuilder();
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);

            foreach (var xuid in communityMessage.Xuids)
            {
                var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
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

            var expireTime = DateTime.UtcNow.Add(communityMessage.Duration);
            var notifications = await this.sunriseNotificationProvider.SendNotificationsAsync(
                communityMessage.Xuids,
                communityMessage.Message,
                expireTime,
                endpoint).ConfigureAwait(true);

            return this.Ok(notifications);
        }

        /// <summary>
        ///     Sends the group notifications.
        /// </summary>
        [HttpPost("notifications/send/groupId({groupId})")]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200, type: typeof(MessageSendResult<int>))]
        public async Task<IActionResult> SendGroupNotifications(
            int groupId,
            [FromBody] LspGroupCommunityMessage communityMessage)
        {
            communityMessage.ShouldNotBeNull(nameof(communityMessage));
            communityMessage.Message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(communityMessage.Message));
            communityMessage.Message.ShouldBeUnderMaxLength(512, nameof(communityMessage.Message));
            communityMessage.Duration.ShouldBeOverMinimumDuration(
                TimeSpan.FromDays(1),
                nameof(communityMessage.Duration));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);

            var groups = await this.sunriseServiceManagementProvider.GetLspGroupsAsync(
                endpoint).ConfigureAwait(false);
            if (!groups.Any(x => x.Id == groupId))
            {
                throw new InvalidArgumentsStewardException($"Group ID: {groupId} could not be found.");
            }

            var expireTime = DateTime.Now.Add(communityMessage.Duration);
            var result = await this.sunriseNotificationProvider.SendGroupNotificationAsync(
                groupId,
                communityMessage.Message,
                expireTime,
                communityMessage.DeviceType,
                endpoint).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Edit the player notification.
        /// </summary>
        [HttpPost("player/xuid({xuid})/notifications/notificationId({notificationId})")]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200, type: typeof(MessageSendResult<int>))]
        public async Task<IActionResult> EditPlayerNotification(
            Guid notificationId,
            ulong xuid,
            [FromBody] CommunityMessage editParameters)
        {
            editParameters.ShouldNotBeNull(nameof(editParameters));
            editParameters.Message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(editParameters.Message));
            editParameters.Message.ShouldBeUnderMaxLength(512, nameof(editParameters.Message));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            var expireTime = DateTime.UtcNow.Add(editParameters.Duration);
            await this.sunriseNotificationProvider.EditNotificationAsync(
                notificationId,
                xuid,
                editParameters.Message,
                expireTime,
                endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Edit the group notification.
        /// </summary>
        [HttpPost("notifications/notificationId({notificationId})")]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200)]
        public async Task<IActionResult> EditGroupNotification(
            Guid notificationId,
            [FromBody] LspGroupCommunityMessage editParameters)
        {
            editParameters.ShouldNotBeNull(nameof(editParameters));
            editParameters.Message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(editParameters.Message));
            editParameters.Message.ShouldBeUnderMaxLength(512, nameof(editParameters.Message));

            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);

            var notification = await this.sunriseNotificationProvider.GetGroupNotificationAsync(notificationId, endpoint)
                .ConfigureAwait(true);

            if (notification.NotificationType != "CommunityMessageNotification")
            {
                throw new FailedToSendStewardException(
                    $"Cannot edit notification of type: {notification.NotificationType}.");
            }

            var expireTime = DateTime.UtcNow.Add(editParameters.Duration);
            await this.sunriseNotificationProvider.EditGroupNotificationAsync(
                notificationId,
                editParameters.Message,
                expireTime,
                editParameters.DeviceType,
                endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Deletes the player notification.
        /// </summary>
        [HttpDelete("player/xuid({xuid})/notifications/notificationId({notificationId})")]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200)]
        public async Task<IActionResult> DeletePlayerNotification(Guid notificationId, ulong xuid)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);
            var playerExists = await this.sunrisePlayerDetailsProvider.DoesPlayerExistAsync(xuid, endpoint)
                .ConfigureAwait(true);
            if (!playerExists)
            {
                throw new NotFoundStewardException($"No profile found for XUID: {xuid}.");
            }

            await this.sunriseNotificationProvider.DeleteNotificationAsync(
                notificationId,
                xuid,
                endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        /// <summary>
        ///     Deletes group notification.
        /// </summary>
        [HttpDelete("notifications/notificationId({notificationId})")]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.CommunityManager)]
        [SwaggerResponse(200)]
        public async Task<IActionResult> DeleteGroupNotification(Guid notificationId)
        {
            var endpoint = this.GetSunriseEndpoint(this.Request.Headers);

            await this.sunriseNotificationProvider.DeleteGroupNotificationAsync(
                notificationId,
                endpoint).ConfigureAwait(true);

            return this.Ok();
        }

        private async Task<string> AddJobIdToHeaderAsync(string requestBody, string userObjectId, string reason)
        {
            var jobId = await this.jobTracker.CreateNewJobAsync(requestBody, userObjectId, reason)
                .ConfigureAwait(true);

            this.Response.Headers.Add("jobId", jobId);

            return jobId;
        }

        private async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid, string endpoint)
        {
            var getServicesBanHistory = this.sunrisePlayerDetailsProvider.GetUserBanHistoryAsync(xuid, endpoint);
            var getLiveOpsBanHistory = this.banHistoryProvider.GetBanHistoriesAsync(
                xuid,
                TitleConstants.SunriseCodeName,
                endpoint);

            await Task.WhenAll(getServicesBanHistory, getLiveOpsBanHistory).ConfigureAwait(true);

            var servicesBanHistory = await getServicesBanHistory.ConfigureAwait(true);
            var liveOpsBanHistory = await getLiveOpsBanHistory.ConfigureAwait(true);

            var banHistories = liveOpsBanHistory.Union(
                servicesBanHistory,
                new LiveOpsBanHistoryComparer()).ToList();

            foreach (var banHistory in banHistories)
            {
                banHistory.IsActive = DateTime.UtcNow.CompareTo(banHistory.ExpireTimeUtc) < 0;
            }

            banHistories.Sort((x, y) => DateTime.Compare(y.ExpireTimeUtc, x.ExpireTimeUtc));

            return banHistories;
        }

        /// <summary>
        ///     Gets the master inventory list.
        /// </summary>
        private async Task<SunriseMasterInventory> RetrieveMasterInventoryList()
        {
            var cars = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFH4Cars);
            var carHorns = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFH4CarHorns);
            var vanityItems = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFH4VanityItems);
            var emotes = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFH4Emotes);
            var quickChatLines = this.kustoProvider.GetMasterInventoryList(KustoQueries.GetFH4QuickChatLines);

            await Task.WhenAll(cars, carHorns, vanityItems, emotes, quickChatLines).ConfigureAwait(true);

            var masterInventory = new SunriseMasterInventory
            {
                CreditRewards = new List<MasterInventoryItem>
                {
                        new MasterInventoryItem { Id = -1, Description = "Credits" },
                        new MasterInventoryItem { Id = -1, Description = "ForzathonPoints" },
                        new MasterInventoryItem { Id = -1, Description = "SkillPoints" },
                        new MasterInventoryItem { Id = -1, Description = "WheelSpins" },
                        new MasterInventoryItem { Id = -1, Description = "SuperWheelSpins" },
                        new MasterInventoryItem { Id = -1, Description = "BackstagePasses" }
                },
                Cars = await cars.ConfigureAwait(true),
                CarHorns = await carHorns.ConfigureAwait(true),
                VanityItems = await vanityItems.ConfigureAwait(true),
                Emotes = await emotes.ConfigureAwait(true),
                QuickChatLines = await quickChatLines.ConfigureAwait(true)
            };

            return masterInventory;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        private async Task<string> VerifyGiftAgainstMasterInventory(SunriseMasterInventory gift)
        {
            var masterInventoryItem = await this.RetrieveMasterInventoryList().ConfigureAwait(true);
            var error = string.Empty;

            foreach (var car in gift.Cars)
            {
                var validItem = masterInventoryItem.Cars.Any(data => { return data.Id == car.Id; });
                error += validItem ? string.Empty : $"Car: {car.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var carHorn in gift.CarHorns)
            {
                var validItem = masterInventoryItem.CarHorns.Any(data => { return data.Id == carHorn.Id; });
                error += validItem
                    ? string.Empty : $"CarHorn: {carHorn.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var vanityItem in gift.VanityItems)
            {
                var validItem = masterInventoryItem.VanityItems.Any(data => { return data.Id == vanityItem.Id; });
                error += validItem
                    ? string.Empty : $"VanityItem: {vanityItem.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var emote in gift.Emotes)
            {
                var validItem = masterInventoryItem.Emotes.Any(data => { return data.Id == emote.Id; });
                error += validItem
                    ? string.Empty : $"Emote: {emote.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            foreach (var quickChatLine in gift.QuickChatLines)
            {
                var validItem = masterInventoryItem.QuickChatLines.Any(data => { return data.Id == quickChatLine.Id; });
                error += validItem
                    ? string.Empty : $"QuickChatLine: {quickChatLine.Id.ToString(CultureInfo.InvariantCulture)}, ";
            }

            return error;
        }

        private string GetSunriseEndpoint(IHeaderDictionary headers)
        {
            if (!headers.TryGetValue("endpointKey", out var headerValue))
            {
                headerValue = DefaultEndpointKey;
            }

            var endpointKeyValue = headerValue.ToString();
            endpointKeyValue.ShouldNotBeNullEmptyOrWhiteSpace(nameof(endpointKeyValue));

            var splitValue = endpointKeyValue.Split('|');
            var title = splitValue.ElementAtOrDefault(0);
            var key = splitValue.ElementAtOrDefault(1);

            if (title != TitleConstants.SunriseCodeName)
            {
                throw new BadHeaderStewardException(
                    $"Endpoint key designated for title: {title}, but expected {TitleConstants.SunriseCodeName}.");
            }

            return SunriseEndpoint.GetEndpoint(key);
        }
    }
}
