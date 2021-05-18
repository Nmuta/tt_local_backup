﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Obligation;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles pipeline requests.
    /// </summary>
    [Route("api/v1")]
    [ApiController]
    [AuthorizeRoles(
        UserRole.LiveOpsAdmin,
        UserRole.DataPipelineAdmin,
        UserRole.DataPipelineContributor,
        UserRole.DataPipelineRead)]
    public sealed class PipelinesController : ControllerBase
    {
        private readonly IObligationProvider obligationProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PipelinesController"/> class.
        /// </summary>
        public PipelinesController(IObligationProvider obligationProvider)
        {
            obligationProvider.ShouldNotBeNull(nameof(obligationProvider));

            this.obligationProvider = obligationProvider;
        }

        /// <summary>
        ///     Get a pipeline.
        /// </summary>
        [HttpGet("pipeline")]
        [SwaggerResponse(200, type: typeof(IList<ObligationPipelinePartial>))]
        public async Task<IActionResult> GetPipelines()
        {
            var result = await this.obligationProvider.GetPipelinesAsync().ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Delete a pipeline.
        /// </summary>
        [HttpDelete("pipeline/{pipelineName}")]
        [SwaggerResponse(200, type: typeof(string), description: "work_item_id")]
        public async Task<IActionResult> DeletePipeline([FromRoute] string pipelineName)
        {
            try
            {
                pipelineName.ShouldNotBeNullEmptyOrWhiteSpace(pipelineName);

                var result = await this.obligationProvider.DeletePipelineAsync(pipelineName).ConfigureAwait(true);

                return this.Ok(result);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        /// <summary>
        ///     Get a pipeline.
        /// </summary>
        [HttpGet("pipeline/{pipelineName}")]
        [SwaggerResponse(200, type: typeof(SimplifiedObligationPipeline))]
        public async Task<IActionResult> GetPipeline([FromRoute] string pipelineName)
        {
            var result = await this.obligationProvider.GetPipelineAsync(pipelineName).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Updates a pipeline.
        /// </summary>
        [HttpPut("pipeline")]
        [SwaggerResponse(200, type: typeof(string), description: "work_item_id")]
        public async Task<IActionResult> UpdatePipeline([FromBody] SimplifiedObligationPipeline obligationPipeline)
        {
            var response = await this.obligationProvider.SafeUpdatePipelineAsync(obligationPipeline).ConfigureAwait(true);

            return this.Ok(response);
        }

        /// <summary>
        ///     Force update a pipeline.
        /// </summary>
        [HttpPost("pipeline")]
        [SwaggerResponse(201, type: typeof(string), description: "work_item_id")]
        public async Task<IActionResult> UpsertPipeline([FromBody] SimplifiedObligationPipeline obligationPipeline)
        {
            var response = await this.obligationProvider.UpsertPipelineAsync(obligationPipeline, requireNew: false).ConfigureAwait(true);

            return this.Created(this.Request.Path, response);
        }

        /// <summary>
        ///     Create a pipeline.
        /// </summary>
        [HttpPost("pipeline/new")]
        [SwaggerResponse(201, type: typeof(string), description: "work_item_id")]
        public async Task<IActionResult> CreatePipeline([FromBody] SimplifiedObligationPipeline obligationPipeline)
        {
            var response = await this.obligationProvider.UpsertPipelineAsync(obligationPipeline, requireNew: true).ConfigureAwait(true);

            return this.Created(this.Request.Path, response);
        }

        /// <summary>
        ///     Renames a pipeline.
        /// </summary>
        [HttpPatch("pipeline")]
        [SwaggerResponse(200, type: typeof(string), description: "work_item_id")]
        public async Task<IActionResult> RenamePipeline([FromBody] PatchOperation patchOperation)
        {
            var response = await this.obligationProvider.RenamePipelineAsync(patchOperation).ConfigureAwait(true);

            return this.Accepted(this.Request.Path, response);
        }
    }
}
