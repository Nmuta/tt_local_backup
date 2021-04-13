using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FH4.master.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.ProfileMappers;

namespace Turn10.LiveOps.StewardApi.Providers.Sunrise
{
    /// <inheritdoc />
    public sealed class SunrisePlayerDetailsProvider : ISunrisePlayerDetailsProvider
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 500;
        private const int VipUserGroupId = 1;
        private const int UltimateVipUserGroupId = 2;
        private const int T10EmployeeUserGroupId = 4;
        private const int CommunityManagerUserGroupId = 5;
        private const int WhitelistUserGroupId = 6;
        private const string CreditUpdatesIdTemplate = "Sunrise|CreditUpdates|{0}|{1}|{2}";

        private readonly ISunriseUserService sunriseUserService;
        private readonly ISunriseEnforcementService sunriseEnforcementService;
        private readonly ISunriseNotificationsService sunriseNotificationsService;
        private readonly ISunriseBanHistoryProvider banHistoryProvider;
        private readonly IMapper mapper;
        private readonly IRefreshableCacheStore refreshableCacheStore;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunrisePlayerDetailsProvider"/> class.
        /// </summary>
        public SunrisePlayerDetailsProvider(ISunriseUserService sunriseUserService, ISunriseEnforcementService sunriseEnforcementService, ISunriseNotificationsService sunriseNotificationsService, ISunriseBanHistoryProvider banHistoryProvider, IMapper mapper, IRefreshableCacheStore refreshableCacheStore)
        {
            sunriseUserService.ShouldNotBeNull(nameof(sunriseUserService));
            sunriseEnforcementService.ShouldNotBeNull(nameof(sunriseEnforcementService));
            sunriseNotificationsService.ShouldNotBeNull(nameof(sunriseNotificationsService));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));

            this.sunriseUserService = sunriseUserService;
            this.sunriseEnforcementService = sunriseEnforcementService;
            this.sunriseNotificationsService = sunriseNotificationsService;
            this.banHistoryProvider = banHistoryProvider;
            this.mapper = mapper;
            this.refreshableCacheStore = refreshableCacheStore;
        }

        /// <inheritdoc />
        public async Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query)
        {
            query.ShouldNotBeNull(nameof(query));

            try
            {
                var result = new SunrisePlayerDetails();

                if (!query.Xuid.HasValue && string.IsNullOrWhiteSpace(query.Gamertag))
                {
                    throw new ArgumentException("Gamertag or Xuid must be provided.");
                }
                else if (query.Xuid.HasValue)
                {
                    var playerDetails = await this.GetPlayerDetailsAsync(query.Xuid.Value).ConfigureAwait(false);

                    result = playerDetails ??
                             throw new NotFoundStewardException($"No profile found for XUID: {query.Xuid}.");
                }
                else if (!string.IsNullOrWhiteSpace(query.Gamertag))
                {
                    var playerDetails = await this.GetPlayerDetailsAsync(query.Gamertag).ConfigureAwait(false);

                    result = playerDetails ??
                             throw new NotFoundStewardException($"No profile found for Gamertag: {query.Gamertag}.");
                }

                var identity = this.mapper.Map<IdentityResultAlpha>(result);
                identity.Query = query;

                return identity;
            }
            catch (Exception ex)
            {
                if (ex is StewardBaseException)
                {
                    throw;
                }

                throw new UnknownFailureStewardException("Identity lookup has failed for an unknown reason.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<SunrisePlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                var response = await this.sunriseUserService.GetLiveOpsUserDataByGamerTagAsync(gamertag).ConfigureAwait(false);

                return this.mapper.Map<SunrisePlayerDetails>(response.userData);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for Gamertag: {gamertag}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<SunrisePlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            try
            {
                var response = await this.sunriseUserService.GetLiveOpsUserDataByXuidAsync(xuid).ConfigureAwait(false);

                if (response.userData.region <= 0)
                {
                    throw new NotFoundStewardException($"No player found for XUID: {xuid}.");
                }

                return this.mapper.Map<SunrisePlayerDetails>(response.userData);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<bool> EnsurePlayerExistsAsync(ulong xuid)
        {
            var response = await this.sunriseUserService.GetLiveOpsUserDataByXuidAsync(xuid).ConfigureAwait(false);

            return response.userData.region > 0;
        }

        /// <inheritdoc />
        public async Task<bool> EnsurePlayerExistsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                await this.sunriseUserService.GetLiveOpsUserDataByGamerTagAsync(gamertag).ConfigureAwait(false);

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc />
        public async Task<IList<SunriseConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults)
        {
            try
            {
                var response = await this.sunriseUserService.GetConsolesAsync(xuid, maxResults).ConfigureAwait(false);

                return this.mapper.Map<IList<SunriseConsoleDetails>>(response.consoles);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No consoles found for Xuid: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SunriseSharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            try
            {
                var response = await this.sunriseUserService.GetSharedConsoleUsersAsync(xuid, startIndex, maxResults)
                    .ConfigureAwait(false);

                return this.mapper.Map<IList<SunriseSharedConsoleUser>>(response.sharedConsoleUsers);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No shared console users found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc/>
        public async Task<SunriseUserFlags> GetUserFlagsAsync(ulong xuid)
        {
            try
            {
                var userGroupResults = await this.sunriseUserService
                    .GetUserGroupMembershipsAsync(xuid, Array.Empty<int>(), DefaultMaxResults).ConfigureAwait(false);
                var suspiciousResults = await this.sunriseUserService.GetIsUnderReviewAsync(xuid).ConfigureAwait(false);

                userGroupResults.userGroups.ShouldNotBeNull(nameof(userGroupResults.userGroups));

                return new SunriseUserFlags
                {
                    IsVip = userGroupResults.userGroups.Any(r => r.Id == VipUserGroupId),
                    IsUltimateVip = userGroupResults.userGroups.Any(r => r.Id == UltimateVipUserGroupId),
                    IsTurn10Employee = userGroupResults.userGroups.Any(r => r.Id == T10EmployeeUserGroupId),
                    IsCommunityManager = userGroupResults.userGroups.Any(r => r.Id == CommunityManagerUserGroupId),
                    IsEarlyAccess = userGroupResults.userGroups.Any(r => r.Id == WhitelistUserGroupId),
                    IsUnderReview = suspiciousResults.isUnderReview
                };
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"User flags not found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task SetUserFlagsAsync(ulong xuid, SunriseUserFlags userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));

            try
            {
                var addGroupList = this.PrepareGroupIds(userFlags, true);
                var removeGroupList = this.PrepareGroupIds(userFlags, false);

                await this.sunriseUserService.AddToUserGroupsAsync(xuid, addGroupList.ToArray()).ConfigureAwait(false);
                await this.sunriseUserService.RemoveFromUserGroupsAsync(xuid, removeGroupList.ToArray())
                    .ConfigureAwait(false);
                await this.sunriseUserService.SetIsUnderReviewAsync(xuid, userFlags.IsUnderReview)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Update user flags failed for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<SunriseProfileSummary> GetProfileSummaryAsync(ulong xuid)
        {
            try
            {
                var result = await this.sunriseUserService.GetProfileSummaryAsync(xuid).ConfigureAwait(false);
                var profileSummary = this.mapper.Map<SunriseProfileSummary>(result.forzaProfileSummary);

                return profileSummary;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"Profile summary not found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SunriseCreditUpdate>> GetCreditUpdatesAsync(ulong xuid, int startIndex, int maxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            try
            {
                var creditUpdateId = string.Format(CultureInfo.InvariantCulture, CreditUpdatesIdTemplate, xuid, startIndex, maxResults);

                async Task<IList<SunriseCreditUpdate>> CreditUpdates()
                {
                    var result = await this.sunriseUserService.GetCreditUpdateEntriesAsync(xuid, startIndex, maxResults)
                        .ConfigureAwait(false);
                    var creditUpdates = this.mapper.Map<IList<SunriseCreditUpdate>>(result.credityUpdateEntries);

                    this.refreshableCacheStore.PutItem(creditUpdateId, TimeSpan.FromHours(1), creditUpdates);

                    return creditUpdates;
                }

                var result = this.refreshableCacheStore.GetItem<IList<SunriseCreditUpdate>>(creditUpdateId) ??
                             await CreditUpdates().ConfigureAwait(false);

                return result;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No credit updates found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SunriseBanResult>> BanUsersAsync(SunriseBanParameters banParameters, string requestingAgent)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));
            banParameters.FeatureArea.ShouldNotBeNullEmptyOrWhiteSpace(nameof(banParameters.FeatureArea));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));

            try
            {
                const int maxXuidsPerRequest = 10;

                var mappedBanParameters = this.mapper.Map<ForzaUserBanParameters>(banParameters);

                var xuids = new List<ulong>();
                if (banParameters.Xuids != null && banParameters.Xuids.Any())
                {
                    xuids = banParameters.Xuids.ToList();
                }

                if (banParameters.Gamertags != null && banParameters.Gamertags.Any())
                {
                    foreach (var gamertag in banParameters.Gamertags)
                    {
                        try
                        {
                            var userResult = await this.sunriseUserService.GetLiveOpsUserDataByGamerTagAsync(gamertag)
                            .ConfigureAwait(false);

                            xuids.Add(userResult.userData.qwXuid);
                        }
                        catch
                        {
                            throw new NotFoundStewardException($"Profile not found for gamertag: {gamertag}.");
                        }
                    }
                }

                xuids = xuids.Distinct().ToList();

                var banResults = new List<SunriseBanResult>();

                for (var i = 0; i < xuids.Count; i += maxXuidsPerRequest)
                {
                    var xuidBatch = xuids.GetRange(i, Math.Min(maxXuidsPerRequest, xuids.Count - i));
                    var result = await this.sunriseEnforcementService
                        .BanUsersAsync(xuidBatch.ToArray(), xuidBatch.Count, mappedBanParameters).ConfigureAwait(false);

                    foreach (var xuid in xuidBatch)
                    {
                        var successfulBan = result.banResults.Where(banAttempt => banAttempt.Xuid == xuid).FirstOrDefault()?.Success ?? false;
                        if (successfulBan)
                        {
                            await this.banHistoryProvider
                                .UpdateBanHistoryAsync(xuid, TitleConstants.SunriseCodeName, requestingAgent, banParameters).ConfigureAwait(false);
                        }
                    }

                    banResults.AddRange(this.mapper.Map<IList<SunriseBanResult>>(result.banResults));
                }

                return banResults;
            }
            catch (Exception ex)
            {
                if (ex is StewardBaseException)
                {
                    throw;
                }

                throw new UnknownFailureStewardException("Banning has failed.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SunriseBanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids)
        {
            try
            {
                if (xuids.Count == 0)
                {
                    return new List<SunriseBanSummary>();
                }

                var result = await this.sunriseEnforcementService.GetUserBanSummariesAsync(xuids.ToArray(), xuids.Count).ConfigureAwait(false);

                var banSummaryResults = this.mapper.Map<IList<SunriseBanSummary>>(result.banSummaries);

                return banSummaryResults;
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Ban Summary lookup has failed.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid)
        {
            try
            {
                var result = await this.sunriseEnforcementService
                    .GetUserBanHistoryAsync(xuid, DefaultStartIndex, DefaultMaxResults).ConfigureAwait(false);

                if (result.availableCount > DefaultMaxResults)
                {
                    result = await this.sunriseEnforcementService
                        .GetUserBanHistoryAsync(xuid, DefaultStartIndex, result.availableCount).ConfigureAwait(false);
                }

                var banResults = result.bans.Select(ban => { return LiveOpsBanHistoryMapper.Map(ban); }).ToList();
                banResults.Sort((x, y) => DateTime.Compare(y.ExpireTimeUtc, x.ExpireTimeUtc));

                return banResults;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No ban history found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned)
        {
            try
            {
                await this.sunriseUserService.SetConsoleBanStatusAsync(consoleId, isBanned).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No console found for Console ID: {consoleId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SunriseNotification>> GetPlayerNotificationsAsync(ulong xuid, int maxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            try
            {
                var notifications = await this.sunriseNotificationsService.LiveOpsRetrieveForUserAsync(xuid, maxResults).ConfigureAwait(false);

                return this.mapper.Map<IList<SunriseNotification>>(notifications.results);
            }
            catch (HttpRequestException ex)
            {
                throw new NotFoundStewardException($"Notifications for player with XUID: {xuid} could not be found.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<MessageSendResult<ulong>>> SendCommunityMessageAsync(IList<ulong> xuids, string message, DateTime expireTimeUtc)
        {
            xuids.ShouldNotBeNull(nameof(xuids));
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));

            try
            {
                var results = await this.sunriseNotificationsService.SendMessageNotificationToMultipleUsersAsync(xuids, message, expireTimeUtc).ConfigureAwait(false);

                return this.mapper.Map<IList<MessageSendResult<ulong>>>(results.messageSendResults);
            }
            catch (HttpRequestException ex)
            {
                throw new FailedToSendStewardException("Notifications failed to send.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<MessageSendResult<int>> SendCommunityMessageAsync(int groupId, string message, DateTime expireTimeUtc)
        {
            message.ShouldNotBeNullEmptyOrWhiteSpace(nameof(message));

            var messageResponse = new MessageSendResult<int>();
            messageResponse.PlayerOrLspGroup = groupId;
            messageResponse.IdentityAntecedent = GiftIdentityAntecedent.LspGroupId;

            try
            {
                await this.sunriseNotificationsService.SendGroupMessageNotificationAsync(groupId, message, expireTimeUtc).ConfigureAwait(false);
                messageResponse.Success = true;
            }
            catch
            {
                messageResponse.Success = false;
            }

            return messageResponse;
        }

        private IList<int> PrepareGroupIds(SunriseUserFlags userFlags, bool toggleOn)
        {
            var resultGroupIds = new List<int>();
            if (userFlags.IsVip == toggleOn) { resultGroupIds.Add(VipUserGroupId); }
            if (userFlags.IsUltimateVip == toggleOn) { resultGroupIds.Add(UltimateVipUserGroupId); }
            if (userFlags.IsTurn10Employee == toggleOn) { resultGroupIds.Add(T10EmployeeUserGroupId); }
            if (userFlags.IsCommunityManager == toggleOn) { resultGroupIds.Add(CommunityManagerUserGroupId); }
            if (userFlags.IsEarlyAccess == toggleOn) { resultGroupIds.Add(WhitelistUserGroupId); }

            return resultGroupIds;
        }
    }
}
