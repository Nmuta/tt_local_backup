using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Obligation;

namespace Turn10.LiveOps.StewardApi.Controllers
{
    /// <summary>
    ///     Handles pipeline requests.
    /// </summary>
    [Route("api/v1")]
    [ApiController]
    [Authorize]
    public sealed class PipelinesController : ControllerBase
    {
        private readonly IObligationProvider obligationProvider;

        /// <summary>
        ///     Initializes a new instance of the <see cref="PipelinesController"/> class.
        /// </summary>
        /// <param name="obligationProvider">The obligation authoring client.</param>
        public PipelinesController(IObligationProvider obligationProvider)
        {
            obligationProvider.ShouldNotBeNull(nameof(obligationProvider));

            this.obligationProvider = obligationProvider;
        }

        /// <summary>
        ///     Delete a pipeline.
        /// </summary>
        /// <param name="pipelineName">The pipeline name.</param>
        /// <returns>
        ///     2OO OK.
        ///     An ID that can be used to track the request.
        /// </returns>
        [HttpDelete("pipeline/{pipelineName}")]
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
        /// <param name="pipelineName">The pipeline name.</param>
        /// <returns>
        ///     200 OK.
        ///     An instance of <see cref="ObligationPipeline"/>.
        /// </returns>
        [HttpGet("pipeline/{pipelineName}")]
        public async Task<IActionResult> GetPipeline([FromRoute] string pipelineName)
        {
            var result = await this.obligationProvider.GetPipelineAsync(pipelineName).ConfigureAwait(true);

            return this.Ok(result);
        }

        /// <summary>
        ///     Updates a pipeline.
        /// </summary>
        /// <param name="obligationPipeline">The obligation pipeline.</param>
        /// <returns>
        ///     201 Created.
        ///     An instance of <see cref="ObligationPipeline"/>.
        /// </returns>
        [HttpPut("pipeline")]
        public async Task<IActionResult> UpdatePipeline([FromBody] ObligationPipeline obligationPipeline)
        {
            var response = await this.obligationProvider.SafeUpdatePipelineAsync(obligationPipeline).ConfigureAwait(true);

            return this.Created(this.Request.Path, response);
        }

        /// <summary>
        ///     Create a pipeline.
        /// </summary>
        /// <param name="obligationPipeline">The obligation pipeline.</param>
        /// <returns>
        ///     201 Created.
        ///     An instance of <see cref="ObligationPipeline"/>.
        /// </returns>
        [HttpPost("pipeline")]
        public async Task<IActionResult> CreatePipeline([FromBody] ObligationPipeline obligationPipeline)
        {
            var response = await this.obligationProvider.UpsertPipelineAsync(obligationPipeline).ConfigureAwait(true);

            return this.Created(this.Request.Path, response);
        }

        /// <summary>
        ///     Renames a pipeline.
        /// </summary>
        /// <param name="patchOperation">The patch operation.</param>
        /// <returns>
        ///     202 Accepted.
        ///     An ID that can be used to track the request.
        /// </returns>
        [HttpPatch("pipeline")]
        public async Task<IActionResult> RenamePipeline([FromBody] PatchOperation patchOperation)
        {
            var response = await this.obligationProvider.RenamePipelineAsync(patchOperation).ConfigureAwait(true);

            return this.Accepted(this.Request.Path, response);
        }
    }
}
