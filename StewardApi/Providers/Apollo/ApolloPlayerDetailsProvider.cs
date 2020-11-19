using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.WebServices.FM7.Generated;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <inheritdoc />
    public sealed class ApolloPlayerDetailsProvider : IApolloPlayerDetailsProvider
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 500;
        private const int VipUserGroupId = 1;
        private const int T10EmployeeUserGroupId = 3;
        private const int CommunityManagerUserGroupId = 4;
        private const int WhitelistUserGroupId = 5;

        private readonly IApolloUserService apolloUserService;
        private readonly IApolloGroupingService apolloGroupingService;
        private readonly IMapper mapper;
        private readonly IApolloBanHistoryProvider banHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloPlayerDetailsProvider"/> class.
        /// </summary>
        /// <param name="apolloUserService">The Apollo user service.</param>
        /// <param name="apolloGroupingService">The Apollo grouping service.</param>
        /// <param name="mapper">The mapper.</param>
        /// <param name="banHistoryProvider">The ban history provider.</param>
        public ApolloPlayerDetailsProvider(IApolloUserService apolloUserService, IApolloGroupingService apolloGroupingService, IMapper mapper, IApolloBanHistoryProvider banHistoryProvider)
        {
            apolloUserService.ShouldNotBeNull(nameof(apolloUserService));
            apolloGroupingService.ShouldNotBeNull(nameof(apolloGroupingService));
            mapper.ShouldNotBeNull(nameof(mapper));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));

            this.apolloUserService = apolloUserService;
            this.apolloGroupingService = apolloGroupingService;
            this.mapper = mapper;
            this.banHistoryProvider = banHistoryProvider;
        }

        /// <inheritdoc />
        public async Task<ApolloPlayerDetails> GetPlayerDetailsAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            try
            {
                var response = await this.apolloUserService.LiveOpsGetUserDataByGamertagAsync(gamertag).ConfigureAwait(false);

                return this.mapper.Map<ApolloPlayerDetails>(response.returnData);
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound) { return null; }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task<ApolloPlayerDetails> GetPlayerDetailsAsync(ulong xuid)
        {
            try
            {
                var response = await this.apolloUserService.LiveOpsGetUserDataByXuidAsync(xuid).ConfigureAwait(false);

                return this.mapper.Map<ApolloPlayerDetails>(response.returnData);
            }
            catch (ForzaClientException ex)
            {
                if (ex.ResultCode == LspResponse.Error && ex.ErrorCode == LspResponse.PlayerNotFound) { return null; }

                throw;
            }
        }

        /// <inheritdoc />
        public async Task<bool> EnsurePlayerExistsAsync(ulong xuid)
        {
            try
            {
                await this.apolloUserService.LiveOpsGetUserDataByXuidAsync(xuid).ConfigureAwait(false);

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc />
        public async Task<bool> EnsurePlayerExistsAsync(string gamertag)
        {
            try
            {
                await this.apolloUserService.LiveOpsGetUserDataByGamertagAsync(gamertag).ConfigureAwait(false);

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <inheritdoc />
        public async Task<IList<ApolloBanResult>> BanUsersAsync(IList<ApolloBanParameters> banParameters, string requestingAgent)
        {
            banParameters.ShouldNotBeNull(nameof(banParameters));
            requestingAgent.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requestingAgent));
            const int maxXuidsPerRequest = 10;

            try
            {
                foreach (var param in banParameters)
                {
                    param.FeatureArea.ShouldNotBeNullEmptyOrWhiteSpace(nameof(param.FeatureArea));

                    if (param.StartTimeUtc == DateTime.MinValue)
                    {
                        param.StartTimeUtc = DateTime.UtcNow;
                    }

                    if (param.Xuid == default && string.IsNullOrWhiteSpace(param.Gamertag))
                    {
                        throw new ArgumentException("No XUID or Gamertag provided.");
                    }

                    if (param.Xuid == default && !string.IsNullOrWhiteSpace(param.Gamertag))
                    {
                        var userResult = await this.apolloUserService.LiveOpsGetUserDataByGamertagAsync(param.Gamertag).ConfigureAwait(false);
                        if (userResult.returnData.Region <= 0)
                        {
                            throw new ArgumentException($"Player lookup for {param.Gamertag} failed.");
                        }

                        param.Xuid = userResult.returnData.qwXuid;
                    }
                }

                var banResults = new List<ApolloBanResult>();

                for (var i = 0; i < banParameters.Count; i += maxXuidsPerRequest)
                {
                    var paramBatch = banParameters.ToList().GetRange(i, Math.Min(maxXuidsPerRequest, banParameters.Count - i));
                    var mappedBanParameters = this.mapper.Map<IList<ForzaUserBanParameters>>(paramBatch);
                    var result = await this.apolloUserService.BanUsersAsync(mappedBanParameters.ToArray()).ConfigureAwait(false);

                    foreach (var param in paramBatch)
                    {
                        await this.banHistoryProvider.UpdateBanHistoryAsync(param.Xuid, TitleConstants.ApolloCodeName, requestingAgent, param).ConfigureAwait(false);
                    }

                    banResults.AddRange(this.mapper.Map<IList<ApolloBanResult>>(result.banResults));
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
        public async Task<IList<ApolloBanDescription>> GetUserBanHistoryAsync(ulong xuid)
        {
            try
            {
                var result = await this.apolloUserService.GetUserBanHistoryAsync(xuid, DefaultStartIndex, DefaultMaxResults).ConfigureAwait(false);

                if (result.availableCount > DefaultMaxResults)
                {
                    result = await this.apolloUserService.GetUserBanHistoryAsync(xuid, DefaultStartIndex, result.availableCount).ConfigureAwait(false);
                }

                var banResults = this.mapper.Map<List<ApolloBanDescription>>(result.bans);
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
        public async Task<IList<ApolloBanSummary>> GetUserBanSummariesAsync(IList<ulong> xuids)
        {
            try
            {
                if (xuids.Count == 0)
                {
                    return new List<ApolloBanSummary>();
                }

                var result = await this.apolloUserService.GetUserBanSummariesAsync(xuids.ToArray(), xuids.Count).ConfigureAwait(false);

                var banSummaryResults = this.mapper.Map<IList<ApolloBanSummary>>(result.banSummaries);

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
        public async Task<IList<ApolloConsoleDetails>> GetConsolesAsync(ulong xuid, int maxResults)
        {
            try
            {
                var response = await this.apolloUserService.GetConsolesAsync(xuid, maxResults).ConfigureAwait(false);

                return this.mapper.Map<IList<ApolloConsoleDetails>>(response.consoles);
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
            await this.apolloUserService.SetConsoleBanStatusAsync(consoleId, isBanned).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<IList<ApolloSharedConsoleUser>> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            try
            {
                var response = await this.apolloUserService.GetSharedConsoleUsersAsync(xuid, startIndex, maxResults).ConfigureAwait(false);

                return this.mapper.Map<IList<ApolloSharedConsoleUser>>(response.sharedConsoleUsers);
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
        public async Task<IList<ApolloLspGroup>> GetLspGroupsAsync(int startIndex, int maxResults)
        {
            var result = await this.apolloGroupingService.GetUserGroupsAsync(startIndex, maxResults).ConfigureAwait(false);
            var lspGroups = this.mapper.Map<IList<ApolloLspGroup>>(result.userGroups);

            return lspGroups;
        }

        /// <inheritdoc/>
        public async Task<ApolloUserFlags> GetUserFlagsAsync(ulong xuid)
        {
            try
            {
                var suspiciousResults = await this.apolloUserService.GetIsUnderReviewAsync(xuid).ConfigureAwait(false);
                var userGroupResults = await this.apolloGroupingService.GetUserGroupMembershipsAsync(xuid, Array.Empty<int>(), DefaultMaxResults).ConfigureAwait(false);

                userGroupResults.userGroups.ShouldNotBeNull(nameof(userGroupResults.userGroups));

                return new ApolloUserFlags
                {
                    IsVip = userGroupResults.userGroups.Any(r => r.Id == VipUserGroupId),
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
        public async Task SetUserFlagsAsync(ulong xuid, ApolloUserFlags userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));

            await this.apolloUserService.SetIsUnderReviewAsync(xuid, userFlags.IsUnderReview).ConfigureAwait(false);

            userFlags.ShouldNotBeNull(nameof(userFlags));

            var addGroupList = this.PrepareGroupIds(userFlags, true);
            var removeGroupList = this.PrepareGroupIds(userFlags, false);

            await this.apolloGroupingService.AddToUserGroupsAsync(xuid, addGroupList.ToArray()).ConfigureAwait(false);
            await this.apolloGroupingService.RemoveFromUserGroupsAsync(xuid, removeGroupList.ToArray()).ConfigureAwait(false);
            await this.apolloUserService.SetIsUnderReviewAsync(xuid, userFlags.IsUnderReview).ConfigureAwait(false);
        }

        private IList<int> PrepareGroupIds(ApolloUserFlags userFlags, bool toggleOn)
        {
            var resultGroupIds = new List<int>();
            if (userFlags.IsVip == toggleOn) { resultGroupIds.Add(VipUserGroupId); }
            if (userFlags.IsTurn10Employee == toggleOn) { resultGroupIds.Add(T10EmployeeUserGroupId); }
            if (userFlags.IsCommunityManager == toggleOn) { resultGroupIds.Add(CommunityManagerUserGroupId); }
            if (userFlags.IsEarlyAccess == toggleOn) { resultGroupIds.Add(WhitelistUserGroupId); }

            return resultGroupIds;
        }
    }
}
