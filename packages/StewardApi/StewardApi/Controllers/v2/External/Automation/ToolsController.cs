﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.External.PlayFab;
using Turn10.LiveOps.StewardApi.Contracts.PlayFab;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Controllers.V2;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Middleware.ApiKeyAuth;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.Data;
using Turn10.LiveOps.StewardApi.Providers.Woodstock.PlayFab;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.v2.External.Automation
{
    /// <summary>
    ///     Handles requests for Woodstock PlayFab build integrations.
    /// </summary>
    [Route("api/v{version:apiVersion}/external/automation/tools")]
    [RequireApiKey(StewardApiKey.StewardAutomation)]
    [LogTagTitle(TitleLogTags.TitleAgnostic)]
    [ApiController]
    [ApiVersion("2.0")]
    [StandardTags(Meta.External, Title.Agnostic, Topic.Automation)]
    public class ToolsController : V2ControllerBase
    {
        private readonly IBlobStorageProvider blobStorageProvider;

        public ToolsController(IBlobStorageProvider blobStorageProvider)
        {
            this.blobStorageProvider = blobStorageProvider;
        }

        /// <summary>
        ///     Retrieves list of active PlayFab build lock.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(ToolsAvailability))]
        public async Task<IActionResult> GetStateAsync()
        {
            var state = await this.blobStorageProvider.GetToolsAvailabilityAsync();
            return this.Ok(state);
        }

        /// <summary>
        ///     Produces a response for ADO guards.
        ///     When tools are unlocked, produces a bad response.
        ///     When tools are locked, produces a good response.
        /// </summary>
        [HttpGet("ado")]
        [SwaggerResponse(200)]
        public async Task<IActionResult> GetStateForAdo()
        {
            var state = await this.blobStorageProvider.GetToolsAvailabilityAsync();
            if (state.AllTools)
            {
                return this.BadRequest(state);
            }

            return this.Ok(new
            {
                Name = "TaskCompleted",
                TaskId = this.HttpContext.Request.Headers["TaskInstanceId"].SingleOrDefault(),
                JobId = this.HttpContext.Request.Headers["JobId"].SingleOrDefault(),
                Result = "succeeded",
            });
        }

        /// <summary>
        ///     Retrieves list of active PlayFab build lock.
        /// </summary>
        [HttpPost("lock")]
        [SwaggerResponse(200, type: typeof(ToolsAvailability))]
        public async Task<IActionResult> PostLockAsync()
        {
            var state = await this.blobStorageProvider.GetToolsAvailabilityAsync();
            if (!state.AllTools)
            {
                throw new BadRequestStewardException("Tools were already locked.");
            }

            state.AllTools = false;
            var newState = await this.blobStorageProvider.SetToolsAvailabilityAsync(state);

            return this.Ok(newState);
        }

        /// <summary>
        ///     Retrieves list of active PlayFab build lock.
        /// </summary>
        [HttpPost("unlock")]
        [SwaggerResponse(200, type: typeof(ToolsAvailability))]
        public async Task<IActionResult> PostUnlockAsync()
        {
            var state = await this.blobStorageProvider.GetToolsAvailabilityAsync();
            if (state.AllTools)
            {
                throw new BadRequestStewardException("Tools were already unlocked.");
            }

            state.AllTools = true;
            var newState = await this.blobStorageProvider.SetToolsAvailabilityAsync(state);

            return this.Ok(newState);
        }
    }
}
