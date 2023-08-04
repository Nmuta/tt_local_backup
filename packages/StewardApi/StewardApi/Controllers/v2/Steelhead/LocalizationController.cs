using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using SteelheadLiveOpsContent;
using StewardGitApi;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
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
        UserRole.LiveOpsAdmin)]
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

        /// <summary>
        ///     Submits new localized strings to Pegasus.
        /// </summary>
        [HttpPost]
        [AuthorizeRoles(UserRole.LiveOpsAdmin, UserRole.GeneralUser)]
        [SwaggerResponse(200, type: typeof(Contracts.Git.PullRequest))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [Authorize(Policy = UserAttributeValues.AddLocalizedString)]
        public async Task<IActionResult> WriteLocalizedStringsToPegasus([FromBody] LocalizedStringBridge localizedStringBridge)
        {
            localizedStringBridge.ShouldNotBeNull(nameof(localizedStringBridge));

            var availableCategories = await this.pegasusService.GetLocalizationCategoriesFromRepoAsync().ConfigureAwait(true);
            if (!availableCategories.Contains(localizedStringBridge.Category.ToString()))
            {
                throw new BadRequestStewardException($"The selected category is invalid: {localizedStringBridge.Category})");
            }

            CommitRefProxy change = await this.pegasusService.WriteLocalizedStringToPegasusAsync(localizedStringBridge).ConfigureAwait(true);

            GitPush pushed = await this.pegasusService.CommitAndPushAsync(new CommitRefProxy[] { change }).ConfigureAwait(true);
            await this.pegasusService.RunFormatPipelineAsync(pushed).ConfigureAwait(true);

            var user = this.User.UserClaims();
            var pullRequestTitle = string.Format(CultureInfo.InvariantCulture, WelcomeCenterHelpers.StandardPullRequestTitle, "LocalizationString", user.EmailAddress);
            var pullRequestDescription = string.Format(CultureInfo.InvariantCulture, WelcomeCenterHelpers.StandardPullRequestDescription, DateTime.UtcNow);

            var pullrequest = await this.pegasusService.CreatePullRequestAsync(pushed, pullRequestTitle, pullRequestDescription).ConfigureAwait(true);

            return this.Ok(pullrequest);
        }
    }
}
