using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Pipelines;
using Turn10.LiveOps.StewardApi.Obligation.UpstreamModels;

namespace Turn10.LiveOps.StewardApi.Providers.Pipelines
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
        ///     Gets all available pipelines.
        /// </summary>
        Task<IList<ObligationPipelinePartial>> GetPipelinesAsync();

        /// <summary>
        ///     Given a pipeline, check that the pipeline exists and that all existing data activities are
        ///     represented in the given pipeline. If those checks are passed, then update the pipeline.
        /// </summary>
        Task<Guid> SafeUpdatePipelineAsync(SimplifiedObligationPipeline obligationPipeline);

        /// <summary>
        ///     Given a pipeline, upserts the pipeline regardless of safety checks.
        ///     This needs to be used to create a pipeline or remove a data activity from a pipeline.
        /// </summary>
        Task<Guid> UpsertPipelineAsync(SimplifiedObligationPipeline obligationPipeline, bool requireNew);

        /// <summary>
        ///     Deletes a pipeline.
        /// </summary>
        Task<Guid> DeletePipelineAsync(string pipelineName);

        /// <summary>
        ///     Gets a pipeline.
        /// </summary>
        Task<SimplifiedObligationPipeline> GetPipelineAsync(string pipelineName);

        /// <summary>
        ///     Renames a pipeline.
        /// </summary>
        Task<Guid> RenamePipelineAsync(PatchOperation patchOperation);
    }
}
