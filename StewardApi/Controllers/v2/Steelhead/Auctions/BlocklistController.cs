﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.V2;
using Turn10.Services.LiveOps.FM8.Generated;
using static System.FormattableString;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Auctions
{
    /// <summary>
    ///     Handles requests for Steelhead auctions blocklist.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/auctions/blocklist")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [AuthorizeRoles(
        UserRole.GeneralUser,
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
    [StandardTags(Topic.Auctions, Title.Steelhead)]
    public class BlocklistController : V2SteelheadControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private const int DefaultMaxResults = 100;

        private readonly ISteelheadItemsProvider itemsProvider;
        private readonly IActionLogger actionLogger;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BlocklistController"/> class.
        /// </summary>
        public BlocklistController(ISteelheadItemsProvider itemsProvider, IActionLogger actionLogger,  IMapper mapper)
        {
            itemsProvider.ShouldNotBeNull(nameof(itemsProvider));
            actionLogger.ShouldNotBeNull(nameof(actionLogger));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.itemsProvider = itemsProvider;
            this.actionLogger = actionLogger;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets auction house block list entries.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<AuctionBlockListEntry>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Meta | ActionAreaLogTags.Auctions)]
        public async Task<IActionResult> GetAuctionBlockList(
            [FromQuery] int maxResults = DefaultMaxResults)
        {
            maxResults.ShouldBeGreaterThanValue(0);

            var getCars = this.itemsProvider.GetCarsAsync();
            var getBlockList = this.Services.AuctionManagementService.GetAuctionBlocklist(maxResults);

            AuctionManagementService.GetAuctionBlocklistOutput getBlockListResults = null;

            try
            {
                await Task.WhenAll(getBlockList, getCars).ConfigureAwait(true);

                getBlockListResults = getBlockList.GetAwaiter().GetResult();
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get auction blocklist. (maxResults: {maxResults})", ex);
            }

            var blockList = this.mapper.SafeMap<IList<AuctionBlockListEntry>>(getBlockListResults.blocklistEntries);

            var carsDict = getCars.GetAwaiter().GetResult().ToDictionary(car => car.Id);
            foreach (var entry in blockList)
            {
                entry.Description = carsDict.TryGetValue(entry.CarId, out var car) ? $"{car.Make} {car.Model}" : "No car name in Pegasus.";
            }

            return this.Ok(blockList);
        }

        /// <summary>
        ///     Adds entries to auction house block list.
        /// </summary>
        [HttpPost]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent)]
        [SwaggerResponse(200, type: typeof(IList<AuctionBlockListEntry>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Create | ActionAreaLogTags.Meta | ActionAreaLogTags.Auctions)]
        [ManualActionLogging(CodeName, StewardAction.Add, StewardSubject.AuctionBlocklistEntry)]
        [Authorize(Policy = UserAttribute.UpdateAuctionBlocklist)]
        public async Task<IActionResult> AddEntriesToAuctionBlockList(
            [FromBody] IList<AuctionBlockListEntry> entries)
        {
            var convertedEntries = this.mapper.SafeMap<ForzaAuctionBlocklistEntry[]>(entries);

            try
            {
                await this.Services.AuctionManagementService.AddToAuctionBlocklist(convertedEntries).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Failed to add entires to auction block list.", ex);
            }

            var blockedCars = entries.Select(entry => Invariant($"{entry.CarId}")).ToList();
            await this.actionLogger.UpdateActionTrackingTableAsync(RecipientType.CarId, blockedCars).ConfigureAwait(true);

            return this.Ok(entries);
        }

        /// <summary>
        ///     Removes an entry from auction house block list.
        /// </summary>
        [HttpDelete("car/{carId}")]
        [AuthorizeRoles(
            UserRole.GeneralUser,
            UserRole.LiveOpsAdmin,
            UserRole.SupportAgentAdmin,
            UserRole.SupportAgent)]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Delete | ActionAreaLogTags.Meta | ActionAreaLogTags.Auctions)]
        [AutoActionLogging(CodeName, StewardAction.Delete, StewardSubject.AuctionBlocklistEntry)]
        [Authorize(Policy = UserAttribute.UpdateAuctionBlocklist)]
        public async Task<IActionResult> RemoveEntryFromAuctionBlockList(
            int carId)
        {
            try
            {
                await this.Services.AuctionManagementService.DeleteAuctionBlocklistEntries(new int[] { carId }).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to delete car from auction blocklist. (carId: {carId})", ex);
            }

            return this.Ok();
        }
    }
}
