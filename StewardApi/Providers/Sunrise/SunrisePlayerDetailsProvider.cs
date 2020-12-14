using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FH4.master.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
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
        private readonly ISunriseBanHistoryProvider banHistoryProvider;
        private readonly IMapper mapper;
        private readonly IRefreshableCacheStore refreshableCacheStore;

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunrisePlayerDetailsProvider"/> class.
        /// </summary>
        /// <param name="sunriseUserService">The Sunrise user service.</param>
        /// <param name="sunriseEnforcementService">The Sunrise enforcement service.</param>
        /// <param name="banHistoryProvider">The ban history provider.</param>
        /// <param name="mapper">The mapper.</param>
        /// <param name="refreshableCacheStore">The refreshable cache store.</param>
        public SunrisePlayerDetailsProvider(ISunriseUserService sunriseUserService, ISunriseEnforcementService sunriseEnforcementService, ISunriseBanHistoryProvider banHistoryProvider, IMapper mapper, IRefreshableCacheStore refreshableCacheStore)
        {
            sunriseUserService.ShouldNotBeNull(nameof(sunriseUserService));
            sunriseEnforcementService.ShouldNotBeNull(nameof(sunriseEnforcementService));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));
            refreshableCacheStore.ShouldNotBeNull(nameof(refreshableCacheStore));

            this.sunriseUserService = sunriseUserService;
            this.sunriseEnforcementService = sunriseEnforcementService;
            this.banHistoryProvider = banHistoryProvider;
            this.mapper = mapper;
            this.refreshableCacheStore = refreshableCacheStore;
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
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task<SunrisePlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            try
            {
                var response = await this.sunriseUserService.GetLiveOpsUserDataByXuidAsync(xuid).ConfigureAwait(false);

                if (response.userData.region <= 0) { return null; }

                return this.mapper.Map<SunrisePlayerDetails>(response.userData);
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
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
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task<IList<SunriseSharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            try
            {
                var response = await this.sunriseUserService.GetSharedConsoleUsersAsync(xuid, startIndex, maxResults).ConfigureAwait(false);

                return this.mapper.Map<IList<SunriseSharedConsoleUser>>(response.sharedConsoleUsers);
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<SunriseUserFlags> GetUserFlagsAsync(ulong xuid)
        {
            try
            {
                var userGroupResults = await this.sunriseUserService.GetUserGroupMembershipsAsync(xuid, Array.Empty<int>(), DefaultMaxResults).ConfigureAwait(false);
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
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task SetUserFlagsAsync(ulong xuid, SunriseUserFlags userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));

            var addGroupList = this.PrepareGroupIds(userFlags, true);
            var removeGroupList = this.PrepareGroupIds(userFlags, false);

            await this.sunriseUserService.AddToUserGroupsAsync(xuid, addGroupList.ToArray()).ConfigureAwait(false);
            await this.sunriseUserService.RemoveFromUserGroupsAsync(xuid, removeGroupList.ToArray()).ConfigureAwait(false);
            await this.sunriseUserService.SetIsUnderReviewAsync(xuid, userFlags.IsUnderReview).ConfigureAwait(false);
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
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task<IList<SunriseCreditUpdate>> GetCreditUpdatesAsync(ulong xuid, int startIndex, int maxResults)
        {
            startIndex.ShouldBeGreaterThanValue(-1, nameof(startIndex));
            maxResults.ShouldBeGreaterThanValue(0, nameof(maxResults));

            var creditUpdateId = string.Format(CultureInfo.InvariantCulture, CreditUpdatesIdTemplate, xuid, startIndex, maxResults);

            async Task<IList<SunriseCreditUpdate>> CreditUpdates()
            {
                var result = await this.sunriseUserService.GetCreditUpdateEntriesAsync(xuid, startIndex, maxResults).ConfigureAwait(false);
                var creditUpdates = this.mapper.Map<IList<SunriseCreditUpdate>>(result.credityUpdateEntries);

                this.refreshableCacheStore.PutItem(creditUpdateId, TimeSpan.FromHours(1), creditUpdates);

                return creditUpdates;
            }

            try
            {
                var result = this.refreshableCacheStore.GetItem<IList<SunriseCreditUpdate>>(creditUpdateId) ?? await CreditUpdates().ConfigureAwait(false);

                return result;
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task<IList<SunriseBanResult>> BanUsersAsync(SunriseBanParameters banParameters, string requestingAgent)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));
            banParameters.FeatureArea.ShouldNotBeNullEmptyOrWhiteSpace(nameof(banParameters.FeatureArea));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            const int maxXuidsPerRequest = 10;

            try
            {
                if (banParameters.StartTimeUtc == DateTime.MinValue)
                {
                    banParameters.StartTimeUtc = DateTime.UtcNow;
                }

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
                        var userResult = await this.sunriseUserService.GetLiveOpsUserDataByGamerTagAsync(gamertag).ConfigureAwait(false);
                        if (userResult.userData.region <= 0)
                        {
                            throw new ArgumentException($"Player lookup for {gamertag} failed.");
                        }

                        xuids.Add(userResult.userData.qwXuid);
                    }
                }

                var banResults = new List<SunriseBanResult>();

                for (var i = 0; i < xuids.Count; i += maxXuidsPerRequest)
                {
                    var xuidBatch = xuids.GetRange(i, Math.Min(maxXuidsPerRequest, xuids.Count - i));
                    var result = await this.sunriseEnforcementService.BanUsersAsync(xuidBatch.ToArray(), xuidBatch.Count, mappedBanParameters).ConfigureAwait(false);

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
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
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
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(ulong xuid)
        {
            try
            {
                var result = await this.sunriseEnforcementService.GetUserBanHistoryAsync(xuid, DefaultStartIndex, DefaultMaxResults).ConfigureAwait(false);

                if (result.availableCount > DefaultMaxResults)
                {
                    result = await this.sunriseEnforcementService.GetUserBanHistoryAsync(xuid, DefaultStartIndex, result.availableCount).ConfigureAwait(false);
                }

                var banResults = result.bans.Select(ban => { return LiveOpsBanHistoryMapper.Map(ban); }).ToList();
                banResults.Sort((x, y) => DateTime.Compare(y.ExpireTimeUtc, x.ExpireTimeUtc));

                return banResults;
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task<IList<LiveOpsBanHistory>> GetUserBanHistoryAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                var userResult = await this.sunriseUserService.GetLiveOpsUserDataByGamerTagAsync(gamertag).ConfigureAwait(false);

                if (userResult.userData.region > 0)
                {
                    return await this.GetUserBanHistoryAsync(userResult.userData.qwXuid).ConfigureAwait(false);
                }

                throw new ArgumentException("Player lookup for ${banHistoryRequest.Gamertag} failed.");
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound)
                {
                    return null;
                }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned)
        {
            await this.sunriseUserService.SetConsoleBanStatusAsync(consoleId, isBanned).ConfigureAwait(false);
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
