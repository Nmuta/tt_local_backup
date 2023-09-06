using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using Xls.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Steelhead user flags controller.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/flags")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.Flags)]
    public class FlagsController : V2SteelheadControllerBase
    {
        private const int DefaultMaxResults = 500;
        private const int SteamVipUserGroupId = 25;
        private const int SteamUltimateVipUserGroupId = 26;
        private const int GamecoreVipUserGroupId = 27;
        private const int GamecoreUltimateVipUserGroupId = 28;
        private const int T10EmployeeUserGroupId = 4;
        private const int WhitelistUserGroupId = 6;
        private const int RaceMarshallUserGroupId = 9;
        private const int CommunityManagerUserGroupId = 5;

        private readonly IMapper mapper;
        private readonly IRequestValidator<SteelheadUserFlagsInput> userFlagsRequestValidator;

        /// <summary>
        ///     Initializes a new instance of the <see cref="FlagsController"/> class.
        /// </summary>
        public FlagsController(IMapper mapper, IRequestValidator<SteelheadUserFlagsInput> userFlagsRequestValidator)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            userFlagsRequestValidator.ShouldNotBeNull(nameof(userFlagsRequestValidator));

            this.mapper = mapper;
            this.userFlagsRequestValidator = userFlagsRequestValidator;
        }

        /// <summary>
        ///     Gets flags for given steelhead user.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(SteelheadUserFlags))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        public async Task<IActionResult> GetFlags(ulong xuid)
        {
            await this.EnsurePlayerExist(this.Services, xuid).ConfigureAwait(true);

            var service = this.Services.UserManagementService;
            try
            {
                var results = await this.BuildUserFlags(xuid, service).ConfigureAwait(true);
                results.IsCommunityManager.HasConflict = true;
                return this.Ok(results);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"User flags not found. (XUID: {xuid})", ex);
            }
        }

        /// <summary>
        ///     Sets flags for given steelhead user.
        /// </summary>
        [HttpPut]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(SteelheadUserFlags))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
        [Authorize(Policy = UserAttributeValues.UpdateUserFlags)]
        public async Task<IActionResult> SetFlags(ulong xuid, [FromBody] SteelheadUserFlagsInput userFlags)
        {
            userFlags.ShouldNotBeNull(nameof(userFlags));
            await this.EnsurePlayerExist(this.Services, xuid).ConfigureAwait(true);

            this.userFlagsRequestValidator.Validate(userFlags, this.ModelState);
            if (!this.ModelState.IsValid)
            {
                var result = this.userFlagsRequestValidator.GenerateErrorResponse(this.ModelState);
                throw new InvalidArgumentsStewardException(result);
            }

            // If UltimateVip is selected we force normal Vip to true
            if (userFlags.IsGamecoreUltimateVip.Value)
            {
                userFlags.IsGamecoreVip = true;
            }

            if (userFlags.IsSteamUltimateVip.Value)
            {
                userFlags.IsSteamVip = true;
            }

            var service = this.Services.UserManagementService;
            try
            {
                var addGroupList = this.PrepareGroupIds(userFlags, true);
                var removeGroupList = this.PrepareGroupIds(userFlags, false);

                await service.AddToUserGroups(xuid, addGroupList.ToArray()).ConfigureAwait(true);
                await service.RemoveFromUserGroups(xuid, removeGroupList.ToArray()).ConfigureAwait(true);
                await service.SetIsUnderReview(xuid, userFlags.IsUnderReview.Value).ConfigureAwait(true);

                var results = await this.BuildUserFlags(xuid, service).ConfigureAwait(true);

                return this.Ok(results);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"User flags not updated. (XUID: {xuid})", ex);
            }
        }

        private async Task<SteelheadUserFlags> BuildUserFlags(ulong xuid, IUserManagementService service)
        {
            var userGroupQuery = service
                .GetUserGroupMemberships(xuid, Array.Empty<int>(), DefaultMaxResults);
            var suspiciousQuery = service.GetIsUnderReview(xuid);

            var verificationQuery = service.GetUserDetails(xuid);

            await Task.WhenAll(userGroupQuery, suspiciousQuery, verificationQuery).ConfigureAwait(true);

            var userGroupResults = userGroupQuery.GetAwaiter().GetResult();
            var suspiciousResults = suspiciousQuery.GetAwaiter().GetResult();
            var verificationResults = verificationQuery.GetAwaiter().GetResult();

            userGroupResults.userGroups.ShouldNotBeNull(nameof(userGroupResults.userGroups));
            verificationResults.forzaUser.ShouldNotBeNull(nameof(verificationResults.forzaUser));

            var nonStandardUserGroups = NonStandardUserGroupHelpers.GetUserGroups(this.Services.Endpoint);

            var verificationEnum = (ForzaUserFlags)verificationResults.forzaUser.Flags;

            var isGamecoreVip = userGroupResults.userGroups.Any(r => r.Id == GamecoreVipUserGroupId);
            var isGamecoreUltimateVip = userGroupResults.userGroups.Any(r => r.Id == GamecoreUltimateVipUserGroupId);
            var isSteamVip = userGroupResults.userGroups.Any(r => r.Id == SteamVipUserGroupId);
            var isSteamUltimateVip = userGroupResults.userGroups.Any(r => r.Id == SteamUltimateVipUserGroupId);
            var isTurn10Employee = userGroupResults.userGroups.Any(r => r.Id == T10EmployeeUserGroupId);
            var isEarlyAccess = userGroupResults.userGroups.Any(r => r.Id == WhitelistUserGroupId);
            var isUnderReview = suspiciousResults.isUnderReview;
            var isRaceMarshall = userGroupResults.userGroups.Any(r => r.Id == RaceMarshallUserGroupId);
            var isCommunityManager = userGroupResults.userGroups.Any(r => r.Id == CommunityManagerUserGroupId);
            var isContentCreator = userGroupResults.userGroups.Any(r => r.Id == nonStandardUserGroups.ContentCreatorId);

            var flags = new SteelheadUserFlags
            {
                IsGamecoreVip = new SteelheadUserFlag
                {
                    IsMember = isGamecoreVip,
                    HasConflict = isGamecoreVip != verificationEnum.HasFlag(ForzaUserFlags.GameCoreVip),
                },
                IsGamecoreUltimateVip = new SteelheadUserFlag
                {
                    IsMember = isGamecoreUltimateVip,
                    HasConflict = isGamecoreUltimateVip != verificationEnum.HasFlag(ForzaUserFlags.GameCoreUltimateVip),
                },
                IsSteamVip = new SteelheadUserFlag
                {
                    IsMember = isSteamVip,
                    HasConflict = isSteamVip != verificationEnum.HasFlag(ForzaUserFlags.SteamVip),
                },
                IsSteamUltimateVip = new SteelheadUserFlag
                {
                    IsMember = isSteamUltimateVip,
                    HasConflict = isSteamUltimateVip != verificationEnum.HasFlag(ForzaUserFlags.SteamUltimateVip),
                },
                IsTurn10Employee = new SteelheadUserFlag
                {
                    IsMember = isTurn10Employee,
                    HasConflict = isTurn10Employee != verificationEnum.HasFlag(ForzaUserFlags.Turn10Employee),
                },
                IsEarlyAccess = new SteelheadUserFlag
                {
                    IsMember = isEarlyAccess,
                    HasConflict = isEarlyAccess != verificationEnum.HasFlag(ForzaUserFlags.UltimateVip), // Correct flag per LukeFoust/TomBojarski
                },
                IsUnderReview = new SteelheadUserFlag
                {
                    IsMember = isUnderReview,
                    HasConflict = isUnderReview != verificationResults.forzaUser.IsUserUnderReview,
                },
                IsRaceMarshall = new SteelheadUserFlag
                {
                    IsMember = isRaceMarshall,
                    HasConflict = isRaceMarshall != verificationEnum.HasFlag(ForzaUserFlags.RaceMarshall),
                },
                IsCommunityManager = new SteelheadUserFlag
                {
                    IsMember = isCommunityManager,
                    HasConflict = isCommunityManager != verificationEnum.HasFlag(ForzaUserFlags.CommunityManager),
                },
                IsContentCreator = new SteelheadUserFlag
                {
                    IsMember = isContentCreator,
                    HasConflict = isContentCreator != verificationEnum.HasFlag(ForzaUserFlags.ContentCreator),
                },
            };

            return flags;
        }

        private IList<int> PrepareGroupIds(SteelheadUserFlagsInput userFlags, bool toggleState)
        {
            var nonStandardUserGroups = NonStandardUserGroupHelpers.GetUserGroups(this.Services.Endpoint);

            var resultGroupIds = new List<int>();
            if (userFlags.IsGamecoreVip == toggleState) { resultGroupIds.Add(GamecoreVipUserGroupId); }
            if (userFlags.IsGamecoreUltimateVip == toggleState) { resultGroupIds.Add(GamecoreUltimateVipUserGroupId); }
            if (userFlags.IsSteamVip == toggleState) { resultGroupIds.Add(SteamVipUserGroupId); }
            if (userFlags.IsSteamUltimateVip == toggleState) { resultGroupIds.Add(SteamUltimateVipUserGroupId); }
            if (userFlags.IsTurn10Employee == toggleState) { resultGroupIds.Add(T10EmployeeUserGroupId); }
            if (userFlags.IsEarlyAccess == toggleState) { resultGroupIds.Add(WhitelistUserGroupId); }
            if (userFlags.IsRaceMarshall == toggleState) { resultGroupIds.Add(RaceMarshallUserGroupId); }
            if (userFlags.IsCommunityManager == toggleState) { resultGroupIds.Add(CommunityManagerUserGroupId); }
            if (userFlags.IsContentCreator == toggleState) { resultGroupIds.Add(nonStandardUserGroups.ContentCreatorId); }

            return resultGroupIds;
        }
    }
}
