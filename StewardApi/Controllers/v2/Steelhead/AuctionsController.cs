using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
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
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead profile templates.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/auctions")]
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
    [Tags(Title.Steelhead, Topic.Auctions, Target.Details, Dev.ReviseTags)]
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
            if (!Guid.TryParse(auctionId, out var auctionIdAsGuid))
            {
                throw new BadRequestStewardException("Auction ID could not be parsed as GUID.");
            }

            try
            {
                var results = await this.Services.AuctionManagementService.GetAuctionData(auctionIdAsGuid).ConfigureAwait(true);

                return this.Ok(this.mapper.Map<AuctionData>(results.auction));
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get auction. (auctionId: {auctionId})", ex);
            }
        }

        /// <summary>
        ///     Cancels a specific auction.
        /// </summary>
        [HttpDelete("{auctionId}")]
        [AuthorizeRoles(
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.AuctionHouse)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Action | ActionAreaLogTags.Auctions)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.Auction)]
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
