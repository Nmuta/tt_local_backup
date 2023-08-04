using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

            var validatedFlags = this.mapper.SafeMap<SteelheadUserFlags>(userFlags);

            // If UltimateVip is selected we force normal Vip to true
            if (validatedFlags.IsGamecoreUltimateVip)
            {
                validatedFlags.IsGamecoreVip = true;
            }

            if (validatedFlags.IsSteamUltimateVip)
            {
                validatedFlags.IsSteamVip = true;
            }

            var service = this.Services.UserManagementService;
            try
            {
                var addGroupList = this.PrepareGroupIds(validatedFlags, true);
                var removeGroupList = this.PrepareGroupIds(validatedFlags, false);

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
            var userGroupResults = await service
                .GetUserGroupMemberships(xuid, Array.Empty<int>(), DefaultMaxResults).ConfigureAwait(true);
            var suspiciousResults = await service.GetIsUnderReview(xuid).ConfigureAwait(true);

            userGroupResults.userGroups.ShouldNotBeNull(nameof(userGroupResults.userGroups));

            var nonStandardUserGroups = NonStandardUserGroupHelpers.GetUserGroups(this.Services.Endpoint);

            var flags = new SteelheadUserFlags
            {
                IsGamecoreVip = userGroupResults.userGroups.Any(r => r.Id == GamecoreVipUserGroupId),
                IsGamecoreUltimateVip = userGroupResults.userGroups.Any(r => r.Id == GamecoreUltimateVipUserGroupId),
                IsSteamVip = userGroupResults.userGroups.Any(r => r.Id == SteamVipUserGroupId),
                IsSteamUltimateVip = userGroupResults.userGroups.Any(r => r.Id == SteamUltimateVipUserGroupId),
                IsTurn10Employee = userGroupResults.userGroups.Any(r => r.Id == T10EmployeeUserGroupId),
                IsEarlyAccess = userGroupResults.userGroups.Any(r => r.Id == WhitelistUserGroupId),
                IsUnderReview = suspiciousResults.isUnderReview,
                IsRaceMarshall = userGroupResults.userGroups.Any(r => r.Id == RaceMarshallUserGroupId),
                IsCommunityManager = userGroupResults.userGroups.Any(r => r.Id == CommunityManagerUserGroupId),
                IsContentCreator = userGroupResults.userGroups.Any(r => r.Id == nonStandardUserGroups.ContentCreatorId),
            };

            return flags;
        }

        private IList<int> PrepareGroupIds(SteelheadUserFlags userFlags, bool toggleState)
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
