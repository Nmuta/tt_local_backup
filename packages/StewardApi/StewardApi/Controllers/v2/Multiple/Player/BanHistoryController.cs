using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Rest;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Multiple.Player
{
    /// <summary>
    ///     Handles requests for multiple titles ban history.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/multi/player/{xuid}/banHistory")]
    [LogTagTitle(TitleLogTags.Woodstock | TitleLogTags.Sunrise | TitleLogTags.Apollo | TitleLogTags.Steelhead)]
    [Authorize]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Topic.BanHistory, Title.Multiple, Title.Woodstock, Title.Sunrise, Title.Apollo, Title.Steelhead)]
    public class BanHistoryController : V2ControllerBase
    {
        private readonly IForumBanHistoryProvider forumBanHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BanHistoryController"/> class.
        /// </summary>
        public BanHistoryController(IForumBanHistoryProvider forumBanHistoryProvider)
        {
            this.forumBanHistoryProvider = forumBanHistoryProvider;
        }

        /// <summary>
        ///     Gets player ban count per titles.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(Dictionary<string, int>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Banning)]
        public async Task<IActionResult> Get(ulong xuid)
        {
            var banCounts = new Dictionary<string, int>();
            try
            {
                var getWoodstockBanHistory = this.WoodstockServices.Value.UserManagementService.GetUserBanSummaries(new ulong[] { xuid }, 1);
                var getSunriseBanHistory = this.SunriseServices.Value.UserManagementService.GetUserBanSummaries(new ulong[] { xuid }, 1);
                var getApolloBanHistory = this.ApolloServices.Value.UserService.GetUserBanSummariesV2(new ulong[] { xuid });
                var getSteelheadBanHistory = this.SteelheadServices.Value.UserManagementService.GetUserBanSummaries(new ulong[] { xuid }, 1);
                var getForumBanHistory = this.forumBanHistoryProvider.GetUserBanSummariesAsync(new List<ulong>() { xuid });

                await Task.WhenAll(getWoodstockBanHistory, getSunriseBanHistory, getApolloBanHistory, getSteelheadBanHistory, getForumBanHistory).ConfigureAwait(true);

                var woodstockBanHistory = getWoodstockBanHistory.GetAwaiter().GetResult();
                var sunriseBanHistory = getSunriseBanHistory.GetAwaiter().GetResult();
                var apolloBanHistory = getApolloBanHistory.GetAwaiter().GetResult();
                var steelheadBanHistory = getSteelheadBanHistory.GetAwaiter().GetResult();
                var forumBanHistory = getForumBanHistory.GetAwaiter().GetResult();

                if (woodstockBanHistory.banSummaries[0].UserExists && woodstockBanHistory.banSummaries[0].BanCount > 0)
                {
                    banCounts[TitleConstants.WoodstockAbbreviation] = woodstockBanHistory.banSummaries[0].BanCount;
                }

                if (sunriseBanHistory.banSummaries[0].UserExists && sunriseBanHistory.banSummaries[0].BanCount > 0)
                {
                    banCounts[TitleConstants.SunriseAbbreviation] = sunriseBanHistory.banSummaries[0].BanCount;
                }

                if (apolloBanHistory.banSummaries[0].UserExists && apolloBanHistory.banSummaries[0].BanCount > 0)
                {
                    banCounts[TitleConstants.ApolloAbbreviation] = apolloBanHistory.banSummaries[0].BanCount;
                }

                if (steelheadBanHistory.banSummaries[0].UserExists && steelheadBanHistory.banSummaries[0].BanCount > 0)
                {
                    banCounts[TitleConstants.SteelheadAbbreviation] = steelheadBanHistory.banSummaries[0].BanCount;
                }

                if (forumBanHistory.First().BanCount > 0)
                {
                    banCounts[TitleConstants.Forum] = forumBanHistory.First().BanCount;
                }
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Unable to get player ban counts for every titles. (XUID: {xuid})", ex);
            }

            return this.Ok(banCounts);
        }
    }
}
