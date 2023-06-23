using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
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
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Players
{
    /// <summary>
    ///     Handles requests for Steelhead players.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/players")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Players, Target.Details, Dev.ReviseTags)]
    public class IdentitiesController : V2SteelheadControllerBase
    {
        private readonly IMemoryCache memoryCache;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="IdentitiesController"/> class for Steelhead.
        /// </summary>
        public IdentitiesController(
            IMemoryCache memoryCache,
            IMapper mapper)
        {
            memoryCache.ShouldNotBeNull(nameof(memoryCache));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.memoryCache = memoryCache;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Searches for identities of provided Steelhead user queries.
        /// </summary>
        [HttpPost("identities")]
        [SwaggerResponse(200, type: typeof(IList<IdentityResultAlpha>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> SearchIdentities([FromBody] IList<IdentityQueryAlpha> identityQueries)
        {
            string MakeKey(IdentityQueryAlpha identityQuery)
            {
                return SteelheadCacheKey.MakeIdentityLookupKey(this.SteelheadEndpoint.Value, identityQuery.Gamertag, identityQuery.Xuid);
            }

            var cachedResults = identityQueries.Select(v => this.memoryCache.Get<IdentityResultAlpha>(MakeKey(v))).ToList();
            if (cachedResults.All(result => result != null))
            {
                return this.Ok(cachedResults.ToList());
            }

            var service = this.Services.UserManagementService;
            var convertedQueries = this.mapper.SafeMap<ForzaPlayerLookupParameters[]>(identityQueries);
            UserManagementService.GetUserIdsOutput result = null;

            try
            {
                result = await service.GetUserIds(convertedQueries.Length, convertedQueries).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException("Identity lookup has failed for an unknown reason.", ex);
            }

            var identityResults = this.mapper.SafeMap<IList<IdentityResultAlpha>>(result.playerLookupResult);
            identityResults.SetErrorsForInvalidXuids();

            return this.Ok(identityResults);
        }
    }
}
