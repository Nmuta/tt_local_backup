﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Test controller for testing Steelhead LSP APIs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/flags")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Target.Player, Topic.Flags)]
    public class FlagsController : V2SteelheadControllerBase
    {
        private const int DefaultMaxResults = 500;
        private const int VipUserGroupId = 1;
        private const int UltimateVipUserGroupId = 2;
        private const int T10EmployeeUserGroupId = 4;
        private const int WhitelistUserGroupId = 6;

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
        [SwaggerResponse(200, type: typeof(SteelheadUserFlags))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Inventory)]
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

            var validatedFlags = this.mapper.Map<SteelheadUserFlags>(userFlags);

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

            var flags = new SteelheadUserFlags
            {
                IsVip = userGroupResults.userGroups.Any(r => r.Id == VipUserGroupId),
                IsUltimateVip = userGroupResults.userGroups.Any(r => r.Id == UltimateVipUserGroupId),
                IsTurn10Employee = userGroupResults.userGroups.Any(r => r.Id == T10EmployeeUserGroupId),
                IsEarlyAccess = userGroupResults.userGroups.Any(r => r.Id == WhitelistUserGroupId),
                IsUnderReview = suspiciousResults.isUnderReview
            };

            return flags;
        }

        private IList<int> PrepareGroupIds(SteelheadUserFlags userFlags, bool toggleState)
        {
            var resultGroupIds = new List<int>();
            if (userFlags.IsVip == toggleState) { resultGroupIds.Add(VipUserGroupId); }
            if (userFlags.IsUltimateVip == toggleState) { resultGroupIds.Add(UltimateVipUserGroupId); }
            if (userFlags.IsTurn10Employee == toggleState) { resultGroupIds.Add(T10EmployeeUserGroupId); }
            if (userFlags.IsEarlyAccess == toggleState) { resultGroupIds.Add(WhitelistUserGroupId); }

            return resultGroupIds;
        }
    }
}