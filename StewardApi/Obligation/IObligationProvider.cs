using System;
using System.Threading.Tasks;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     Provides methods for interacting with Obligation.
    /// </summary>
    /// <remarks>
    ///     In theory, this code could be rolled up into the client however, I am intentionally trying not to have the client
    ///     code deviate from what is in the 343 repository at this time. Were it not for the Framework v CORE issues, I would
    ///     prefer to just consume their library. There is a plan to eventually get their build to output a CORE lib but that
    ///     is not near the top of their priorities at this point. (emersonf 2020-11-09).
    /// </remarks>
    public interface IObligationProvider
    {
        /// <summary>
        ///     Given a pipeline, check that the pipeline exists and that all existing data activities are
        ///     represented in the given pipeline. If those checks are passed, then update the pipeline.
        /// </summary>
        /// <param name="obligationPipeline">The obligation pipeline.</param>
        /// <returns>A GUID to track the operation.</returns>
        Task<Guid> SafeUpdatePipelineAsync(SimplifiedObligationPipeline obligationPipeline);

        /// <summary>
        ///     Given a pipeline, upserts the pipeline regardless of safety checks.
        ///     This needs to be used to create a pipeline or remove a data activity from a pipeline.
        /// </summary>
        /// <param name="obligationPipeline">The obligation pipeline.</param>
        /// <returns>A GUID to track the operation.</returns>
        Task<Guid> UpsertPipelineAsync(SimplifiedObligationPipeline obligationPipeline);

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
        /// <returns>A new instance of <see cref="SimplifiedObligationPipeline"/>.</returns>
        Task<SimplifiedObligationPipeline> GetPipelineAsync(string pipelineName);

        /// <summary>
        ///     Renames a pipeline.
        /// </summary>
        /// <param name="patchOperation">The patch operation.</param>
        /// <returns>A GUID to track the operation.</returns>
        Task<Guid> RenamePipelineAsync(PatchOperation patchOperation);
    }
}
