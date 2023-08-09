using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Filters;
using Turn10.LiveOps.StewardApi.Helpers;
using Turn10.LiveOps.StewardApi.Helpers.Swagger;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Turn10.LiveOps.StewardApi.Helpers.Swagger.KnownTags;

namespace Turn10.LiveOps.StewardApi.Controllers.V2.Woodstock
{
    /// <summary>
    ///     Controller for woodstock lsp task.
    /// </summary>
    [Route("api/v{version:apiVersion}/title/woodstock/lsp-task")]
    [LogTagTitle(TitleLogTags.Steelhead)]
    [ApiController]
    [AuthorizeRoles(
        UserRole.GeneralUser,
        UserRole.LiveOpsAdmin)]
    [ApiVersion("2.0")]
    [StandardTags(Title.Woodstock, Topic.LspTask, Target.Lsp)]
    public class LspTaskController : V2WoodstockControllerBase
    {
        private readonly IMapper mapper;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LspTaskController"/> class.
        /// </summary>
        public LspTaskController(IMapper mapper)
        {
            mapper.ShouldNotBeNull(nameof(mapper));

            this.mapper = mapper;
        }

        /// <summary>
        ///     Gets the list of task.
        /// </summary>
        [HttpGet]
        [SwaggerResponse(200, type: typeof(IEnumerable<LspTask>))]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Lookup)]
        public async Task<IActionResult> GetTasks()
        {
            var lspTasks = await this.Services.TaskManagementService.GetTasks().ConfigureAwait(true);
            var tasks = this.mapper.SafeMap<IEnumerable<LspTask>>(lspTasks.tasks);

            return this.Ok(tasks);
        }

        /// <summary>
        ///     Update a single lsp task.
        /// </summary>
        [HttpPost("update-single")]
        [SwaggerResponse(200)]
        [LogTagDependency(DependencyLogTags.Lsp)]
        [LogTagAction(ActionTargetLogTags.System, ActionAreaLogTags.Update)]
        [Authorize(Policy = UserAttributeValues.UpdateLspTask)]
        public async Task<IActionResult> UpdateLspTask([FromBody] LspTask task)
        {
            var taskParameters = this.mapper.SafeMap<ForzaTaskUpdateParameters>(task);
            await this.Services.TaskManagementService.UpdateTask(taskParameters).ConfigureAwait(true);

            return this.Ok();
        }
    }
}
