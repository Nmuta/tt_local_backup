using System.Collections.Generic;
using Newtonsoft.Json;

#pragma warning disable CA1724
namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     A pipeline is a collection of data activities with some descriptive metadata.
    /// </summary>
    [JsonObject(MemberSerialization.OptIn)]
    public sealed class ObligationPipeline
    {
        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        /// <remarks>
        ///     This is the ID/PrimaryKey of the pipeline. It must be unique per system deployment.
        /// </remarks>
        [JsonProperty("name")]
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets the config context.
        /// </summary>
        /// <remarks>
        ///     Information about the tenant and cluster of the pipeline.
        /// </remarks>
        [JsonProperty("config_context")]
        public ConfigQualifier ConfigContext { get; set; }

        /// <summary>
        ///     Gets or sets the description.
        /// </summary>
        [JsonProperty("description")]
        public string Description { get; set; }

        /// <summary>
        ///     Gets or sets the principals.
        /// </summary>
        /// <remarks>
        ///     A list of principals representing permissions to view or edit this pipeline.
        /// </remarks>
        [JsonProperty("principals")]
        public IList<ObligationPrincipal> Principals { get; set; }

        /// <summary>
        ///     Gets or sets the data activities.
        /// </summary>
        [JsonProperty("data_activities")]
        public IList<DataActivityBase> DataActivities { get; set; }

        /// <summary>
        ///     Gets or sets the etag.
        /// </summary>
        /// <remarks>
        ///     Row version of the entity. Used to manage concurrency.
        /// </remarks>
        [JsonIgnore]
        internal string Etag { get; set; }

        [JsonProperty("status")]
#pragma warning disable IDE0051 // Remove unused private members. emersonf this needs to be on the model I guess. Not our code.
        private string Status => "active";
#pragma warning restore IDE0051 // Remove unused private members
    }
}
