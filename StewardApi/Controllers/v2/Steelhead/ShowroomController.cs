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
using SteelheadLiveOpsContent;
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
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Handles requests for Steelhead showroom.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/showroom")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [AuthorizeRoles(UserRole.GeneralUser, UserRole.LiveOpsAdmin)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Showroom)]
    public class ShowroomController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService steelheadPegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ShowroomController"/> class.
        /// </summary>
        public ShowroomController(ISteelheadPegasusService steelheadPegasusService)
        {
            steelheadPegasusService.ShouldNotBeNull(nameof(steelheadPegasusService));

            this.steelheadPegasusService = steelheadPegasusService;
        }

        /// <summary>
        ///     Gets showroom featured car showcase.
        /// </summary>
        [HttpGet("carFeatured")]
        [SwaggerResponse(200, type: typeof(CarFeaturedShowcase[]))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarFeaturedShowcases()
        {
            CarFeaturedShowcase[] carFeaturedShowcase;

            try
            {
                carFeaturedShowcase = await this.steelheadPegasusService.GetCarFeaturedShowcasesAsync().ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get car featured showcases.", ex);
            }

            return this.Ok(carFeaturedShowcase);
        }

        /// <summary>
        ///     Gets showroom car sales.
        /// </summary>
        [HttpGet("carSales")]
        [SwaggerResponse(200, type: typeof(CarListingCategoryV2[]))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarSales()
        {
            CarListingCategoryV2[] carSales;

            try
            {
                carSales = await this.steelheadPegasusService.GetCarSalesAsync().ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to get car sales.", ex);
            }

            return this.Ok(carSales);
        }

        /// <summary>
        ///     Gets showroom car listing.
        /// </summary>
        [HttpGet("carListing/{carId}")]
        [SwaggerResponse(200, type: typeof(CarListingV2))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetCarListings(int carId)
        {
            CarListingV2 carListingByCarId;

            try
            {
                var carListings = await this.steelheadPegasusService.GetCarListingsAsync().ConfigureAwait(true);
                carListingByCarId = carListings.First(x => x.CarId == carId);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to find car listing by car ID. (carId: {carId})", ex);
            }

            return this.Ok(carListingByCarId);
        }
    }
}
