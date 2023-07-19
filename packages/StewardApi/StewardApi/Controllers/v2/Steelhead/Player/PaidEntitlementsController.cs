using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Castle.Core.Internal;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FM8.Generated;
using Kusto.Data.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Controller for managing Steelhead paid entitlements.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/paidEntitlements")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.PaidEntitlements)]
    public class PaidEntitlementsController : V2SteelheadControllerBase
    {
        private const int DefaultMaxResults = 500;
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PaidEntitlementsController"/> class.
        /// </summary>
        public PaidEntitlementsController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets available Entitlements for a user's current profile and CMS slot.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<ProfileNote>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta)]
        public async Task<IActionResult> GetPaidEntitlementsAsync(ulong xuid)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            AdminForzaProfile currentProfile = null;
            try
            {
                var userProfiles = await this.Services.UserInventoryManagementService.GetAdminUserProfiles(xuid, uint.MaxValue).ConfigureAwait(true);
                currentProfile = userProfiles.profiles.Where(profile => profile.isCurrent == true).SingleOrDefault();
            }
            catch (Exception ex)
            {
                throw new InvalidArgumentsStewardException($"No current profile found. (XUID: {xuid})", ex);
            }

            try
            {
                var response = await this.Services.LiveOpsService.GetAdminPurchasables(currentProfile.profileId).ConfigureAwait(true);

                return this.Ok(response.purchasables);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to find valid entitlements for user. (XUID: {xuid}), (Profile ID: {currentProfile.profileId})", ex);
            }
        }

        /// <summary>
        ///     Grants user the paid entitlement.
        /// </summary>
        [HttpPut("{productId}")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [AutoActionLogging(TitleCodeName.Steelhead, StewardAction.Update, StewardSubject.PaidEntitlements)]
        [Authorize(Policy = UserAttribute.GrantPaidEntitlements)]
        public async Task<IActionResult> PutPaidEntitlement(ulong xuid, string productId)
        {
            await this.Services.EnsurePlayerExistAsync(xuid).ConfigureAwait(true);

            AdminForzaProfile currentProfile = null;
            LiveOpsService.GetAdminPurchasablesOutput validPurchasables = null;
            try
            {
                var userProfiles = await this.Services.UserInventoryManagementService.GetAdminUserProfiles(xuid, uint.MaxValue).ConfigureAwait(true);
                currentProfile = userProfiles.profiles.Where(profile => profile.isCurrent == true).SingleOrDefault();
            }
            catch (Exception ex)
            {
                throw new InvalidArgumentsStewardException($"No current profile found. (XUID: {xuid})", ex);
            }

            try
            {
                validPurchasables = await this.Services.LiveOpsService.GetAdminPurchasables(currentProfile.profileId).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to find valid entitlements for user. (XUID: {xuid}), (Profile ID: {currentProfile.profileId})", ex);
            }

            var validProductId = validPurchasables.purchasables.Any(purchasable => purchasable.ProductId == productId);
            if (!validProductId)
            {
                throw new InvalidArgumentsStewardException($"Product ID is not a valid entitlement for this user. (XUID: {xuid}), (Profile ID: {currentProfile.profileId}), Product ID: {productId})");
            }

            try
            {
                await this.Services.LiveOpsService.AdminEntitlePurchasable(currentProfile.profileId, productId).ConfigureAwait(true);

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to grant Profile VIP entitlement. (XUID: {xuid}), (Profile ID: {currentProfile.profileId}), (Product ID: {productId})", ex);
            }
        }
    }
}
