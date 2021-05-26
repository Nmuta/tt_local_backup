using Newtonsoft.Json;

namespace Turn10.LiveOps.StewardApi.Obligation.UpstreamModels
{
    /// <summary>
    ///     Represents a pipeline authoring model.
    /// </summary>
    public sealed class PipelineAuthoringModel
    {
        /// <summary>
        ///     Gets or sets the etag.
        /// </summary>
        [JsonProperty("etag")]
        public string Etag { get; set; }

        /// <summary>
        ///     Gets or sets the pipeline.
        /// </summary>
        [JsonProperty("pipeline")]
        public ObligationPipeline Pipeline { get; set; }
    }
}
