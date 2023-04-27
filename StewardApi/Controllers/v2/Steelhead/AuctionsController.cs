using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Forza.LiveOps.FH4.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Common.AuctionDataEndpoint;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead auctions.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/auctions")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Auctions, Target.Details, Dev.ReviseTags)]
    public class AuctionsController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="AuctionsController"/> class.
        /// </summary>
        public AuctionsController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets a specific auction's details.
        /// </summary>
        [HttpGet("{auctionId}")]
        [SwaggerResponse(200, type: typeof(AuctionData))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Auctions)]
        public async Task<IActionResult> GetAuctionDetails(string auctionId)
        {
            Turn10.Services.LiveOps.FM8.Generated.AuctionManagementService.GetAuctionDataOutput results = null;

            if (!Guid.TryParse(auctionId, out var auctionIdAsGuid))
            {
                throw new BadRequestStewardException("Auction ID could not be parsed as GUID.");
            }

            try
            {
                results = await this.Services.AuctionManagementService.GetAuctionData(auctionIdAsGuid).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get auction. (auctionId: {auctionId})", ex);
            }

            return this.Ok(this.mapper.SafeMap<AuctionData>(results.auction));
        }

        /// <summary>
        ///     Cancels a specific auction.
        /// </summary>
        [HttpDelete("{auctionId}")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Auctions)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.Auction)]
        [Authorize(Policy = UserAttribute.DeleteAuction)]
        public async Task<IActionResult> DeleteAuction(string auctionId)
        {
            if (!Guid.TryParse(auctionId, out var auctionIdAsGuid))
            {
                throw new BadRequestStewardException("Auction ID could not be parsed as GUID.");
            }

            try
            {
                var result = await this.Services.AuctionManagementService.DeleteAuctions(new[] { auctionIdAsGuid }).ConfigureAwait(true);

                var realResult = result.result.First();
                if (!realResult.Success)
                {
                    throw new CustomStewardException(
                        HttpStatusCode.BadGateway,
                        StewardErrorCode.ServicesFailure,
                        $"LSP failed to cancel auction {auctionId}");
                }

                return this.Ok();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to delete auction. (auctionId: {auctionId})", ex);
            }
        }
    }
}
