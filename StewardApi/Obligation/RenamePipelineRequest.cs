using Newtonsoft.Json;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     A request body to completely rename a pipeline.
    /// </summary>
    public sealed class RenamePipelineRequest
    {
        /// <summary>
        ///     Gets or sets the old pipeline name.
        /// </summary>
        [JsonProperty("old_pipeline_name")]
        public string OldPipelineName { get; set; }

        /// <summary>
        ///     Gets or sets the new pipeline name.
        /// </summary>
        [JsonProperty("new_pipeline_name")]
        public string NewPipelineName { get; set; }
    }
}
