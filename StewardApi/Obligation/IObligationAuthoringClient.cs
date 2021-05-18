using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Represents a client capable of interacting with the Obligation authoring APIs.
    /// </summary>
    public interface IObligationAuthoringClient
    {
        /// <summary>
        ///     Gets all available pipelines.
        /// </summary>
        Task<IList<ObligationPipelinePartial>> GetPipelinesAsync();

        /// <summary>
        ///     Given a pipeline, check that the pipeline exists and that all existing data activities are
        ///     represented in the given pipeline. If those checks are passed, then update the pipeline.
        /// </summary>
        Task<Guid> SafeUpdatePipelineAsync(ObligationPipeline pipeline);

        /// <summary>
        ///     Given a pipeline, upserts the pipeline regardless of safety checks.
        ///     This needs to be used to create a pipeline or remove a data activity from a pipeline.
        /// </summary>
        Task<Guid> UpsertPipelineAsync(ObligationPipeline pipeline);

        /// <summary>
        ///     Deletes a pipeline.
        /// </summary>
        Task<Guid> DeletePipelineAsync(string pipelineName);

        /// <summary>
        ///     Gets a pipeline.
        /// </summary>
        Task<ObligationPipeline> GetPipelineAsync(string pipelineName);

        /// <summary>
        ///     Renames a pipeline.
        /// </summary>
        Task<Guid> RenamePipelineAsync(PatchOperation patchOperation);
    }
}
