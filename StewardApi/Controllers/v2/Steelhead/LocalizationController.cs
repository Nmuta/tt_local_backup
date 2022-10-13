using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Forza.UserInventory.FM8.Generated;
using Forza.WebServices.FH5_main.Generated;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SteelheadLiveOpsContent;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
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
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Localization, Target.Details, Dev.ReviseTags)]
    public class LocalizationController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService pegasusService;
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LocalizationController"/> class.
        /// </summary>
        public LocalizationController(
            ISteelheadPegasusService pegasusService,
            IMapper mapper)
        {
            pegasusService.ShouldNotBeNull(nameof(pegasusService));
            mapper.ShouldNotBeNull(nameof(mapper));

            this.pegasusService = pegasusService;
            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the localized string data.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(Dictionary<Guid, LiveOpsContracts.LocalizedString>))]
        public async Task<IActionResult> GetLocalizedStrings()
        {
            var locStrings = await this.pegasusService.GetLocalizedStringsAsync().ConfigureAwait(true);
            return this.Ok(locStrings);
        }

        /// <summary>
        ///     Add string for localization.
        /// </summary>
        [HttpPost]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(Guid))]
        public async Task<IActionResult> AddStringToLocalization([FromBody] LocalizedStringData data)
        {
            if (!Enum.IsDefined(typeof(LocCategory), data.Category))
            {
                throw new InvalidArgumentsStewardException($"Invalid {nameof(LocCategory)} provided: {data.Category}");
            }

            try
            {
                var forzaLocalizedStringData = this.mapper.Map<ForzaLocalizedStringData>(data);

                var result = await this.Services.LocalizationManagementService.AddStringToLocalize(forzaLocalizedStringData)
                    .ConfigureAwait(true);

                return this.Ok(result.localizedStringId);
            }
            catch (Exception ex)
            {
                throw new UnknownFailureStewardException($"Failed to add string for localization: \"{data.StringToLocalize}\"", ex);
            }

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
