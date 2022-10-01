﻿using System;
using System.Collections.Generic;
using System.Linq;
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
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Steelhead.ServiceConnections;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;

using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for steelhead consoles.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/motd")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [Tags(Title.Steelhead, Topic.Consoles, Target.Details, Dev.ReviseTags)]
    public class MotdController : V2SteelheadControllerBase
    {
        private readonly ISteelheadPegasusService steelheadPegasusService;

        /// <summary>
        ///     Initializes a new instance of the <see cref="MotdController"/> class.
        /// </summary>
        /// <param name="steelheadPegasusService">The steelhead pegasus service.</param>
        public MotdController(ISteelheadPegasusService steelheadPegasusService)
        {
            steelheadPegasusService.ShouldNotBeNull(nameof(steelheadPegasusService));

            this.steelheadPegasusService = steelheadPegasusService;
        }

        /// <summary>
        ///     Retrieves a collection of messages of the day.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(SteelheadMessageOfTheDay))]
        public async Task<IActionResult> GetMessagesOfTheDay()
        {
            var motdMessages = await this.steelheadPegasusService.GetMotDMessagesAsync().ConfigureAwait(true);

            return this.Ok(motdMessages);
        }
    }
}
