using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SteelheadLiveOpsContent;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;
using LiveOpsContracts = Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for Steelhead localized string.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/localization")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin,
        UserRole.SupportAgentAdmin,
        UserRole.SupportAgent,
        UserRole.CommunityManager,
        UserRole.MediaTeam)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Localization, Target.Details, Dev.ReviseTags)]
    public class LocalizationController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService pegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LocalizationController"/> class.
        /// </summary>
        public LocalizationController(
            ISteelheadPegasusService pegasusService)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));

            this.pegasusService = pegasusService;
        }

        /// <summary>
        ///     Gets the localized string data.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, LiveOpsContracts.LocalizedString>))]
        public async Task<IActionResult> GetLocalizedStrings([FromQuery] bool useInternalIds = true)
        {
            var locStrings = await this.pegasusService.GetLocalizedStringsAsync(useInternalIds).ConfigureAwait(true);
            return this.Ok(locStrings);
        }

        /// <summary>
        ///     Retrieves a collection of supported locales.
        /// </summary>
        [HttpGet("supportedLocales")]
        [SwaggerResponse(200, type: typeof(IEnumerable<SupportedLocale>))]
        public async Task<IActionResult> GetSupportedLocales()
        {
            var supportedLocales = await this.pegasusService.GetSupportedLocalesAsync().ConfigureAwait(true);
            return this.Ok(supportedLocales);
        }
    }
}
