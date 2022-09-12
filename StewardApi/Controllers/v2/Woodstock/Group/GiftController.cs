using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Bond;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.SystemFunctions;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using static Turn10.Services.LiveOps.FH5_main.Generated.StorefrontManagementService;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Group
{
    /// <summary>
    ///     Controller for woodstock user group gifting.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/group/{groupId}/gift")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock, Target.LspGroup, Topic.Gifting)]
    public class GiftController : V2WoodstockControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        private readonly IMapper mapper;
        private readonly IWoodstockPlayerInventoryProvider playerInventoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="GiftController"/> class.
        /// </summary>
        public GiftController(IMapper mapper, IWoodstockPlayerInventoryProvider playerInventoryProvider)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            playerInventoryProvider.ShouldNotBeNull(nameof(playerInventoryProvider));

            this.mapper = mapper;
            this.playerInventoryProvider = playerInventoryProvider;
        }

        /// <summary>
        ///     Gifts liveries to user group.
        /// </summary>
        [HttpPost("livery")]
        [SwaggerResponse(202, type: typeof(GiftResponse<int>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Group, ActionAreaLogTags.Action | ActionAreaLogTags.Gifting)]
        [ManualActionLogging(CodeName, StewardAction.Update, StewardSubject.PlayerInventories)]
        public async Task<IActionResult> GiftLiveryToUserGroup(int groupId, [FromBody] BulkLiveryGift<Gift> gift)
        {
            var userClaims = this.User.UserClaims();
            var requesterObjectId = userClaims.ObjectId;
            var endpoint = this.WoodstockEndpoint.Value;

            gift.ShouldNotBeNull(nameof(gift));
            groupId.ShouldNotBeNull(nameof(groupId));
            gift.Target.GiftReason.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gift.Target.GiftReason));
            requesterObjectId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(requesterObjectId));

            var liveries = await this.LookupLiveries(gift.LiveryIds).ConfigureAwait(true);

            // TODO: Move livery gifting logic out of the provider
            var jobs = liveries.Select(livery => this.playerInventoryProvider.SendCarLiveryAsync(gift.Target, groupId, livery, requesterObjectId, endpoint)).ToList();
            await Task.WhenAll(jobs).ConfigureAwait(false);

            var responses = jobs.Select(j => j.GetAwaiter().GetResult()).ToList();
            var response = responses.MergeGiftResponse();

            return this.Ok(response);
        }

        private async Task<IEnumerable<UgcItem>> LookupLiveries(IEnumerable<string> liveryIds)
        {
            var lookups = liveryIds.Select(this.LookupLivery).ToList();
            await Task.WhenAll(lookups).ConfigureAwait(false);
            var results = lookups.Select(v => v.GetAwaiter().GetResult());
            return results;
        }

        private async Task<UgcItem> LookupLivery(string liveryId)
        {
            if (!Guid.TryParse(liveryId, out var liveryGuid))
            {
                throw new InvalidArgumentsStewardException($"Invalid livery id: {liveryId}");
            }

            GetUGCLiveryOutput livery;

            try
            {
                livery = await this.Services.StorefrontManagement.GetUGCLivery(liveryGuid).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get livery. (liveryId: {liveryId})", ex);
            }

            if (livery == null)
            {
                throw new InvalidArgumentsStewardException($"Livery not found: {liveryId}");
            }

            var mappedLivery = this.mapper.SafeMap<UgcLiveryItem>(livery.result);
            return mappedLivery;
        }
    }
}
