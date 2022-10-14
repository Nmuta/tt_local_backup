using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
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
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.ProfileMappers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead.Services;
using Turn10.LiveOps.StewardApi.Validation;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.Player
{
    /// <summary>
    ///     Test controller for testing Steelhead LSP APIs.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/player/{xuid}/banHistory")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.CommunityManager)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Target.Player, Topic.BanHistory)]
    public class BanHistoryController : V2SteelheadControllerBase
    {
        private const int DefaultStartIndex = 0;
        private const int DefaultMaxResults = 500;
        private const TitleCodeName CodeName = TitleCodeName.Steelhead;
        private readonly IMapper mapper;
        private readonly ILoggingService loggingService;
        private readonly ISteelheadBanHistoryProvider banHistoryProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="BanHistoryController"/> class.
        /// </summary>
        public BanHistoryController(IMapper mapper, ILoggingService loggingService, ISteelheadBanHistoryProvider banHistoryProvider)
        {
            mapper.ShouldNotBeNull(nameof(mapper));
            loggingService.ShouldNotBeNull(nameof(loggingService));
            banHistoryProvider.ShouldNotBeNull(nameof(banHistoryProvider));

            this.mapper = mapper;
            this.banHistoryProvider = banHistoryProvider;
            this.loggingService = loggingService;
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IList<LiveOpsBanHistory>))]
        [LogTagDependency(DependencyLogTags.Lsp | DependencyLogTags.Kusto)]
        [LogTagAction(ActionTargetLogTags.Player, ActionAreaLogTags.Lookup | ActionAreaLogTags.Banning)]
        public async Task<IActionResult> GetBanHistory(
            ulong xuid)
        {
            var endpoint = this.SteelheadEndpoint.Value;
            var result = await this.GetBanHistoryAsync(xuid, endpoint).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Gets ban history.
        /// </summary>
        private async Task<IList<LiveOpsBanHistory>> GetBanHistoryAsync(ulong xuid, string endpoint)
        {
            async Task<List<LiveOpsBanHistory>> GetLspBanHistoryAsync()
            {
                var service = this.Services.UserManagementService;
                try
                {
                    var result = await service.GetUserBanHistory(xuid, DefaultStartIndex, DefaultMaxResults)
                        .ConfigureAwait(true);

                    if (result.availableCount > DefaultMaxResults)
                    {
                        result = await service.GetUserBanHistory(xuid, DefaultStartIndex, result.availableCount)
                            .ConfigureAwait(false);
                    }

                    var banResults = result.bans
                        .Select(ban => { return LiveOpsBanHistoryMapper.Map(ban, endpoint); }).ToList();
                    banResults.Sort((x, y) => DateTime.Compare(y.ExpireTimeUtc, x.ExpireTimeUtc));

                    return banResults;
                }
                catch (Exception ex)
                {
                    throw new UnknownFailureStewardException($"No ban history found. (XUID: {xuid})", ex);
                }
            }

            var getServicesBanHistory = GetLspBanHistoryAsync();
            var getLiveOpsBanHistory = this.banHistoryProvider.GetBanHistoriesAsync(
                xuid,
                CodeName.ToString(),
                endpoint);

            await Task.WhenAll(getServicesBanHistory, getLiveOpsBanHistory).ConfigureAwait(true);

            var servicesBanHistory = await getServicesBanHistory.ConfigureAwait(true);
            var liveOpsBanHistory = await getLiveOpsBanHistory.ConfigureAwait(true);

            var banHistories = BanHistoryConsolidationHelper.ConsolidateBanHistory(liveOpsBanHistory, servicesBanHistory, this.loggingService, CodeName.ToString());

            banHistories.Sort((x, y) => y.ExpireTimeUtc.CompareTo(x.ExpireTimeUtc));

            return banHistories;
        }
    }
}
