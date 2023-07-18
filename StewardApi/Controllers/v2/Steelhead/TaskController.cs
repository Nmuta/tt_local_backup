﻿using System;
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
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.Services.LiveOps.FM8.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Steelhead
{
    /// <summary>
    ///     Controller for steelhead task.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/steelhead/task")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,//???
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Steelhead, Topic.Task, Target.Lsp)]
    public class TaskController : V2SteelheadControllerBase
    {
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="TaskController"/> class.
        /// </summary>
        public TaskController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the list of task.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IEnumerable<LspTask>))]
        [LogTagDependency(DependencyLogTags.Pegasus)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetTasks()
        {
            var lspTasks = await this.Services.TaskManagementService.GetTasks().ConfigureAwait(true);
            var tasks = this.mapper.SafeMap<IEnumerable<LspTask>>(lspTasks.tasks);

            return this.Ok(tasks);
        }

        /// <summary>
        ///     Update a task.
        /// </summary>
        [HttpPut]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.Console, ActionAreaLogTags.Banning)]
        [Authorize(Policy = UserAttribute.BanConsole)]
        public async Task<IActionResult> UpdateTask([FromBody] LspTask task)
        {
            var taskParameters = this.mapper.SafeMap<ForzaTaskUpdateParameters>(task);
            await this.Services.TaskManagementService.UpdateTask(taskParameters).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
