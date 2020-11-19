using System;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Represents a client capable of interacting with the Obligation authoring APIs.
    /// </summary>
    public interface IObligationAuthoringClient
    {
        /// <summary>
        ///     Given a pipeline, check that the pipeline exists and that all existing data activities are
        ///     represented in the given pipeline. If those checks are passed, then update the pipeline.
        /// </summary>
        /// <param name="pipeline">The pipeline.</param>
        /// <returns>A GUID to track the operation.</returns>
        Task<Guid> SafeUpdatePipelineAsync(Pipeline pipeline);

        /// <summary>
        ///     Given a pipeline, upserts the pipeline regardless of safety checks.
        ///     This needs to be used to create a pipeline or remove a data activity from a pipeline.
        /// </summary>
        /// <param name="pipeline">The pipeline.</param>
        /// <returns>A GUID to track the operation.</returns>
        Task<Guid> UpsertPipelineAsync(Pipeline pipeline);

        /// <summary>
        ///     Deletes a pipeline.
        /// </summary>
        /// <param name="pipelineName">The pipeline name.</param>
        /// <returns>A GUID to track the operation.</returns>
        Task<Guid> DeletePipelineAsync(string pipelineName);

        /// <summary>
        ///     Gets a pipeline.
        /// </summary>
        /// <param name="pipelineName">The pipeline name.</param>
        /// <returns>A GUID to track the operation.</returns>
        Task<Pipeline> GetPipelineAsync(string pipelineName);

        /// <summary>
        ///     Renames a pipeline.
        /// </summary>
        /// <param name="patchOperation">The patch operation.</param>
        /// <returns>A GUID to track the operation.</returns>
        Task<Guid> RenamePipelineAsync(PatchOperation patchOperation);
    }
}
