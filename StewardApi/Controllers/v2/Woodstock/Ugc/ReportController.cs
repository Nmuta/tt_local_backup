using System;
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
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.ServiceConnections;
using Turn10.UGC.Contracts;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock.Ugc
{
    /// <summary>
    ///     Controller for Woodstock Ugc reporting.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/ugc")]
    [LogTagTitle(TitleLogTags.Woodstock)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Woodstock, Topic.Ugc, Target.Details)]
    public class ReportController : V2WoodstockControllerBase
    {
        private const TitleCodeName CodeName = TitleCodeName.Woodstock;

        private readonly IWoodstockPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="ReportController"/> class.
        /// </summary>
        public ReportController(IWoodstockPegasusService pegasusService)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));

            this.pegasusService = pegasusService;
        }

        /// <summary>
        ///    Return a list of ugc report reason.
        /// </summary>
        [HttpGet("reportReasons")]
        [SwaggerResponse(200, type: typeof(IList<UgcReportReason>))]
        public async Task<IActionResult> GetUgcReportReasons()
        {
            var reportReasons = await this.pegasusService.GetUgcReportingReasonsAsync().ConfigureAwait(false);
            var supportedLocales = await this.pegasusService.GetSupportedLocalesAsync().ConfigureAwait(false);
            var englishId = supportedLocales.FirstOrDefault(x => x.Locale == "en-US").ClientLcid;

            var englishReasons = new List<UgcReportReason>();

            foreach (var reason in reportReasons)
            {
                englishReasons.Add(new UgcReportReason()
                {
                    Id = reason.Key,
                    Description = reason.Value.Description.LocalizedStrings[englishId]
                });
            }

            return this.Ok(englishReasons);
        }

        /// <summary>
        ///    Report a ugc item with a reason.
        /// </summary>
        [HttpPost("{ugcId}/report")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Ugc)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Ugc)]
        [AutoActionLogging(CodeName, StewardAction.Add, StewardSubject.UgcReport)]
        [Authorize(Policy = UserAttribute.ReportUgc)]
        public async Task<IActionResult> ReportUgc(string ugcId, string reasonId)
        {
            if (!Guid.TryParse(ugcId, out var parsedUgcId))
            {
                throw new BadRequestStewardException($"UGC ID could not be parsed as GUID. (ugcId: {ugcId})");
            }

            if (!Guid.TryParse(reasonId, out var parsedReasonId))
            {
                throw new BadRequestStewardException($"Reason ID could not be parsed as GUID. (reasonId: {reasonId})");
            }

            try
            {
                await this.Services.StorefrontManagement.ReportContentWithReason(parsedUgcId, parsedReasonId).ConfigureAwait(true);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to report UGC. (ugcId: {parsedUgcId}) (reasonId: {parsedReasonId})", ex);
            }

            return this.Ok();
        }
    }
}
