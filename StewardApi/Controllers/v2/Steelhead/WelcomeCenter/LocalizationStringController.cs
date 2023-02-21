﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using SteelheadLiveOpsContent;
using StewardGitApi;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Controller for managing localization strings in Pegasus.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/localization")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.Pegasus)]
    public class LocalizationStringController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService steelheadPegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LocalizationStringController"/> class.
        /// </summary>
        public LocalizationStringController(ISteelheadPegasusService steelheadPegasusService)
        {
            steelheadPegasusService.ShouldNotBeNull(nameof(steelheadPegasusService));

            this.steelheadPegasusService = steelheadPegasusService;
        }

        /// <summary>
        ///     Submits new localized strings to Pegasus.
        /// </summary>
        [HttpPost("{category}")]
        [AuthorizeRoles(UserRole.LiveOpsAdmin)]
        [SwaggerResponse(200, type: typeof(Contracts.Git.PullRequest))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup | ActionAreaLogTags.Update | ActionAreaLogTags.Meta)]
        [Authorize(Policy = UserAttribute.AddLocalizedString)]
        public async Task<IActionResult> WriteLocalizedStringsToPegasus(LocCategory category, [FromBody] IEnumerable<LocalizedStringBridge> localizedStringBridge)
        {
            localizedStringBridge.CheckForNullOrEmpty(nameof(localizedStringBridge));

            var availableCategories = await this.steelheadPegasusService.GetLocalizationCategoriesFromRepoAsync().ConfigureAwait(true);
            if (!availableCategories.Contains(category.ToString()))
            {
                throw new BadRequestStewardException($"The selected category is invalid: {category})");
            }

            CommitRefProxy change = await this.steelheadPegasusService.WriteLocalizedStringsToPegasusAsync(category, localizedStringBridge).ConfigureAwait(true);

            GitPush pushed = await this.steelheadPegasusService.CommitAndPushAsync(new CommitRefProxy[] { change }).ConfigureAwait(true);
            await this.steelheadPegasusService.RunFormatPipelineAsync(pushed).ConfigureAwait(true);

            var user = this.User.UserClaims();
            var pullRequestTitle = string.Format(CultureInfo.InvariantCulture, WelcomeCenterHelpers.StandardPullRequestTitle, "LocalizationString", user.EmailAddress);
            var pullRequestDescription = string.Format(CultureInfo.InvariantCulture, WelcomeCenterHelpers.StandardPullRequestDescription, DateTime.UtcNow);

            var pullrequest = await this.steelheadPegasusService.CreatePullRequestAsync(pushed, pullRequestTitle, pullRequestDescription).ConfigureAwait(true);

            return this.Ok(pullrequest);
        }
    }
}