using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Handles requests for Steelhead player auctions.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/ugc")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.SupportAgentNew,
        UserRole.CommunityManager,
        UserRole.MediaTeam,
        UserRole.MotorsportDesigner,
        UserRole.HorizonDesigner)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Target.Player, Topic.Ugc)]
    public class UgcController : V2SteelheadControllerBase
    {
        private readonly int ugcMaxResults = 8_000;
        private readonly ISteelheadItemsProvider itemsProvider;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="UgcController"/> class.
        /// </summary>
        public UgcController(ISteelheadItemsProvider itemsProvider, IMapper mapper)
        {
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.itemsProvider = itemsProvider;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets player UGC items.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<UgcItem>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Ugc | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Ugc)]
        public async Task<IActionResult> GetUgcItems(ulong xuid, [FromQuery] string ugcType = "Unknown")
        {
            ugcType.ShouldNotBeNullEmptyOrWhiteSpace(nameof(ugcType));

            if (!Enum.TryParse(ugcType, out UgcType parseUgcType))
            {
                throw new InvalidArgumentsStewardException($"Invalid UGC type provided. (type: {ugcType})");
            }

            if (parseUgcType == UgcType.Unknown)
            {
                throw new InvalidArgumentsStewardException($"Invalid UGC item type to search: (type: {parseUgcType})");
            }

            async Task<IList<UgcItem>> GetPlayerUgcAsync(ulong xuid, UgcType ugcType)
            {
                try
                {
                    var mappedContentType = this.mapper.Map<ForzaUGCContentType>(ugcType);
                    var results = await this.Services.StorefrontManagementService.GetUGCForUser(xuid, mappedContentType, false, this.ugcMaxResults).ConfigureAwait(false);

                    return this.mapper.Map<IList<UgcItem>>(results.result);
                }
                catch (Exception ex)
                {
                    throw new UnknownFailureStewardException($"Failed to get player UGC. (xuid: {xuid}) (ugcType: {ugcType})", ex);
                }
            }

            var getUgcItems = GetPlayerUgcAsync(xuid, parseUgcType);
            var getCars = this.itemsProvider.GetCarsAsync();

            await Task.WhenAll(getUgcItems, getCars).ConfigureAwait(true);

            var ugcItems = getUgcItems.GetAwaiter().GetResult();
            var carsDict = getCars.GetAwaiter().GetResult().ToDictionary(car => car.Id);

            foreach (var item in ugcItems)
            {
                item.CarDescription = carsDict.TryGetValue(item.CarId, out var car) ? $"{car.Make} {car.Model}" : "No car name in Pegasus.";
            }

            return this.Ok(ugcItems);
        }
    }
}
