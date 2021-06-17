using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FH4.master.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers.Sunrise.ServiceConnections;
using ForzaUserBanParameters = Forza.LiveOps.FH4.master.Generated.ForzaUserBanParameters;

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
        private const string BackstagePassUpdatesIdTemplate = "Sunrise|BackstagePassUpdates|{0}";

        private readonly ISunriseService sunriseService;
        private readonly ISunriseBanHistoryProvider banHistoryProvider;
        private readonly IMapper mapper;
        private readonly IRefreshableCacheStore refreshableCacheStore;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunrisePlayerDetailsProvider"/> class.
        /// </summary>
        public SunrisePlayerDetailsProvider(ISunriseService sunriseService, ISunriseBanHistoryProvider banHistoryProvider, IMapper mapper, IRefreshableCacheStore refreshableCacheStore)
        {
            sunriseService.ShouldNotBeNull(nameof(sunriseService));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));

            this.sunriseService = sunriseService;
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
                var response = await this.sunriseService.GetLiveOpsUserDataByGamerTagAsync(gamertag).ConfigureAwait(false);

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
                var response = await this.sunriseService.GetLiveOpsUserDataByXuidAsync(xuid).ConfigureAwait(false);

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
            try
            {
                var response = await this.sunriseService.GetLiveOpsUserDataByXuidAsync(xuid).ConfigureAwait(false);

                return response.userData.region > 0;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc />
        public async Task<bool> EnsurePlayerExistsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                await this.sunriseService.GetLiveOpsUserDataByGamerTagAsync(gamertag).ConfigureAwait(false);

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc />
        public async Task<IList<ConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults)
        {
            try
            {
                var response = await this.sunriseService.GetConsolesAsync(xuid, maxResults).ConfigureAwait(false);

                return this.mapper.Map<IList<ConsoleDetails>>(response.consoles);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No consoles found for Xuid: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SunriseProfileNote>> GetProfileNotesAsync(ulong xuid)
        {
            try
            {
                var response = await this.sunriseService.GetProfileNotesAsync(xuid, 100).ConfigureAwait(false);

                return this.mapper.Map<IList<SunriseProfileNote>>(response.adminComments);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No profile notes found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task AddProfileNoteAsync(ulong xuid, SunriseProfileNote note)
        {
            note.ShouldNotBeNull(nameof(note));

            try
            {
                await this.sunriseService.AddProfileNote(xuid, note.Text, note.Author).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Could not add profile note for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            try
            {
                var response = await this.sunriseService.GetSharedConsoleUsersAsync(xuid, startIndex, maxResults)
                    .ConfigureAwait(false);

                return this.mapper.Map<IList<SharedConsoleUser>>(response.sharedConsoleUsers);
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
                var userGroupResults = await this.sunriseService
                    .GetUserGroupMembershipsAsync(xuid, Array.Empty<int>(), DefaultMaxResults).ConfigureAwait(false);
                var suspiciousResults = await this.sunriseService.GetIsUnderReviewAsync(xuid).ConfigureAwait(false);

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

                await this.sunriseService.AddToUserGroupsAsync(xuid, addGroupList.ToArray()).ConfigureAwait(false);
                await this.sunriseService.RemoveFromUserGroupsAsync(xuid, removeGroupList.ToArray())
                    .ConfigureAwait(false);
                await this.sunriseService.SetIsUnderReviewAsync(xuid, userFlags.IsUnderReview)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Update user flags failed for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<ProfileSummary> GetProfileSummaryAsync(ulong xuid)
        {
            try
            {
                var result = await this.sunriseService.GetProfileSummaryAsync(xuid).ConfigureAwait(false);
                var profileSummary = this.mapper.Map<ProfileSummary>(result.forzaProfileSummary);

                return profileSummary;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"Profile summary not found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<CreditUpdate>> GetCreditUpdatesAsync(ulong xuid, int startIndex, int maxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            try
            {
                var creditUpdateId = string.Format(CultureInfo.InvariantCulture, CreditUpdatesIdTemplate, xuid, startIndex, maxResults);

                async Task<IList<CreditUpdate>> CreditUpdates()
                {
                    var result = await this.sunriseService.GetCreditUpdateEntriesAsync(xuid, startIndex, maxResults)
                        .ConfigureAwait(false);
                    var creditUpdates = this.mapper.Map<IList<CreditUpdate>>(result.credityUpdateEntries);

                    this.refreshableCacheStore.PutItem(creditUpdateId, TimeSpan.FromHours(1), creditUpdates);

                    return creditUpdates;
                }

                var result = this.refreshableCacheStore.GetItem<IList<CreditUpdate>>(creditUpdateId) ??
                             await CreditUpdates().ConfigureAwait(false);

                return result;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No credit updates found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<BackstagePassUpdate>> GetBackstagePassUpdatesAsync(ulong xuid)
        {
            try
            {
                var backstagePassUpdateId = string.Format(CultureInfo.InvariantCulture, BackstagePassUpdatesIdTemplate, xuid);

                async Task<IList<BackstagePassUpdate>> BackstagePassUpdates()
                {
                    var result = await this.sunriseService.GetTokenTransactionsAsync(xuid)
                        .ConfigureAwait(false);
                    var backstagePasses = this.mapper.Map<IList<BackstagePassUpdate>>(result.transactions.Transactions);

                    this.refreshableCacheStore.PutItem(backstagePassUpdateId, TimeSpan.FromHours(1), backstagePasses);

                    return backstagePasses;
                }

                var result = this.refreshableCacheStore.GetItem<IList<BackstagePassUpdate>>(backstagePassUpdateId) ??
                             await BackstagePassUpdates().ConfigureAwait(false);

                return result;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No backstage pass updates found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<BanResult>> BanUsersAsync(IList<SunriseBanParameters> banParameters, string requesterObjectId)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));
            const int maxXuidsPerRequest = 10;

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
                        var userResult = await this.sunriseService.GetLiveOpsUserDataByGamerTagAsync(param.Gamertag)
                            .ConfigureAwait(false);

                        param.Xuid = userResult.userData.qwXuid;
                    }
                    catch (Exception ex)
                    {
                        throw new NotFoundStewardException($"No profile found for Gamertag: {param.Gamertag}.", ex);
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
                    var result = await this.sunriseService
                        .BanUsersAsync(mappedBanParameters.ToArray(), mappedBanParameters.Count)
                        .ConfigureAwait(false);

                    banResults.AddRange(this.mapper.Map<IList<BanResult>>(result.banResults));
                }

                foreach (var result in banResults)
                {
                    var parameters = banParameters.Where(banAttempt => banAttempt.Xuid == result.Xuid).FirstOrDefault();

                    if (result.Error == null)
                    {
                        try
                        {
                            await
                                this.banHistoryProvider.UpdateBanHistoryAsync(
                                        parameters.Xuid,
                                        TitleConstants.SunriseCodeName,
                                        requesterObjectId,
                                        parameters)
                                    .ConfigureAwait(false);
                        }
                        catch (Exception ex)
                        {
                            result.Error = new StewardError(
                                StewardErrorCode.FailedToSend,
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

        /// <inheritdoc />
        public async Task<IList<BanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids)
        {
            try
            {
                if (xuids.Count == 0)
                {
                    return new List<BanSummary>();
                }

                var result = await this.sunriseService.GetUserBanSummariesAsync(xuids.ToArray(), xuids.Count).ConfigureAwait(false);

                var banSummaryResults = this.mapper.Map<IList<BanSummary>>(result.banSummaries);

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
                var result = await this.sunriseService
                    .GetUserBanHistoryAsync(xuid, DefaultStartIndex, DefaultMaxResults).ConfigureAwait(false);

                if (result.availableCount > DefaultMaxResults)
                {
                    result = await this.sunriseService
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
                await this.sunriseService.SetConsoleBanStatusAsync(consoleId, isBanned).ConfigureAwait(false);
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
                var notifications = await this.sunriseService.LiveOpsRetrieveForUserAsync(xuid, maxResults).ConfigureAwait(false);

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
                var results = await this.sunriseService.SendMessageNotificationToMultipleUsersAsync(xuids, message, expireTimeUtc).ConfigureAwait(false);

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
                await this.sunriseService.SendGroupMessageNotificationAsync(groupId, message, expireTimeUtc).ConfigureAwait(false);
                messageResponse.Error = null;
            }
            catch
            {
                messageResponse.Error = new StewardError(StewardErrorCode.ServicesFailure, $"LSP failed to message group with ID: {groupId}");
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
