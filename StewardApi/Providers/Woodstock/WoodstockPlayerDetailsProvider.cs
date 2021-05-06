﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH5_master.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;

namespace Turn10.LiveOps.StewardApi.Providers.Woodstock
{
    /// <inheritdoc />
    public sealed class WoodstockPlayerDetailsProvider : IWoodstockPlayerDetailsProvider
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 500;
        private const int VipUserGroupId = 1;
        private const int UltimateVipUserGroupId = 2;
        private const int T10EmployeeUserGroupId = 4;
        private const int CommunityManagerUserGroupId = 5;
        private const int WhitelistUserGroupId = 6;

        private readonly IWoodstockUserService woodstockUserService;
        private readonly IWoodstockBanHistoryProvider banHistoryProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockPlayerDetailsProvider"/> class.
        /// </summary>
        public WoodstockPlayerDetailsProvider(IWoodstockUserService woodstockUserService, IWoodstockBanHistoryProvider banHistoryProvider, IMapper mapper)
        {
            woodstockUserService.ShouldNotBeNull(nameof(woodstockUserService));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.woodstockUserService = woodstockUserService;
            this.banHistoryProvider = banHistoryProvider;
            this.mapper = mapper;
        }

        /// <inheritdoc />
        public async Task<IdentityResultAlpha> GetPlayerIdentityAsync(IdentityQueryAlpha query)
        {
            query.ShouldNotBeNull(nameof(query));

            try
            {
                var result = new WoodstockPlayerDetails();

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
        public async Task<WoodstockPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                var response = await this.woodstockUserService.GetUserDataByGamertagAsync(gamertag).ConfigureAwait(false);

                return this.mapper.Map<WoodstockPlayerDetails>(response.userData);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No player found for Gamertag: {gamertag}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<WoodstockPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            try
            {
                var response = await this.woodstockUserService.GetUserDataByXuidAsync(xuid).ConfigureAwait(false);

                if (response.userData.region <= 0) { return null; }

                return this.mapper.Map<WoodstockPlayerDetails>(response.userData);
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
                var response = await this.woodstockUserService.GetUserDataByXuidAsync(xuid)
                    .ConfigureAwait(false);

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
                var response = await this.woodstockUserService.GetUserDataByGamertagAsync(gamertag).ConfigureAwait(false);

                return response.userData.region > 0;
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
                var response = await this.woodstockUserService.GetConsolesAsync(xuid, maxResults).ConfigureAwait(false);

                return this.mapper.Map<IList<ConsoleDetails>>(response.consoles);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No consoles found for Xuid: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned)
        {
            try
            {
                await this.woodstockUserService.SetConsoleBanStatusAsync(consoleId, isBanned).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No console found for Console ID: {consoleId}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<SharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            try
            {
                var response = await this.woodstockUserService.GetSharedConsoleUsersAsync(xuid, startIndex, maxResults)
                    .ConfigureAwait(false);

                return this.mapper.Map<IList<SharedConsoleUser>>(response.sharedConsoleUsers);
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No shared console users found for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<LspGroup>> GetLspGroupsAsync(int startIndex, int maxResults)
        {
            try
            {
                var result = await this.woodstockUserService.GetUserGroupsAsync(startIndex, maxResults)
                    .ConfigureAwait(false);
                var lspGroups = this.mapper.Map<IList<LspGroup>>(result.userGroups);

                return lspGroups;
            }
            catch (Exception ex)
            {
                throw new NotFoundStewardException($"No LSP groups found for {TitleConstants.WoodstockFullName}", ex);
            }
        }

        /// <inheritdoc/>
        public async Task<WoodstockUserFlags> GetUserFlagsAsync(ulong xuid)
        {
            try
            {
                var userGroupResults = await this.woodstockUserService
                    .GetUserGroupMembershipsAsync(xuid, Array.Empty<int>(), DefaultMaxResults).ConfigureAwait(false);
                var suspiciousResults = await this.woodstockUserService.GetIsUnderReviewAsync(xuid).ConfigureAwait(false);

                userGroupResults.userGroups.ShouldNotBeNull(nameof(userGroupResults.userGroups));

                return new WoodstockUserFlags
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
        public async Task SetUserFlagsAsync(ulong xuid, WoodstockUserFlags userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));

            try
            {
                var addGroupList = this.PrepareGroupIds(userFlags, true);
                var removeGroupList = this.PrepareGroupIds(userFlags, false);

                await this.woodstockUserService.AddToUserGroupsAsync(xuid, addGroupList.ToArray()).ConfigureAwait(false);
                await this.woodstockUserService.RemoveFromUserGroupsAsync(xuid, removeGroupList.ToArray())
                    .ConfigureAwait(false);
                await this.woodstockUserService.SetIsUnderReviewAsync(xuid, userFlags.IsUnderReview)
                    .ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new FailedToSendStewardException($"Update user flags failed for XUID: {xuid}.", ex);
            }
        }

        /// <inheritdoc />
        public async Task<IList<BanResult>> BanUsersAsync(IList<WoodstockBanParameters> banParameters, string requestingAgent)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
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
                        var userResult = await this.woodstockUserService.GetUserDataByGamertagAsync(param.Gamertag)
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
                    var result = await this.woodstockUserService.BanUsersAsync(mappedBanParameters.ToArray(), mappedBanParameters.Count)
                        .ConfigureAwait(false);

                    foreach (var param in paramBatch)
                    {
                        var successfulBan = result.banResults.Where(banAttempt => banAttempt.Xuid == param.Xuid).FirstOrDefault()?.Success ?? false;
                        if (successfulBan)
                        {
                            await
                                this.banHistoryProvider.UpdateBanHistoryAsync(
                                    param.Xuid,
                                    TitleConstants.WoodstockCodeName,
                                    requestingAgent,
                                    param)
                                .ConfigureAwait(false);
                        }
                    }

                    banResults.AddRange(this.mapper.Map<IList<BanResult>>(result.banResults));
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

                var result = await this.woodstockUserService.GetUserBanSummariesAsync(xuids.ToArray()).ConfigureAwait(false);

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
                var result = await this.woodstockUserService
                    .GetUserBanHistoryAsync(xuid, DefaultStartIndex, DefaultMaxResults).ConfigureAwait(false);

                if (result.availableCount > DefaultMaxResults)
                {
                    result = await this.woodstockUserService
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

        private IList<int> PrepareGroupIds(WoodstockUserFlags userFlags, bool toggleOn)
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
