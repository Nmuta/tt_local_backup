using Newtonsoft.Json;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    /// This class contains information about the tenant and cluster of a pipeline.
    /// </summary>
    public sealed class ConfigQualifier
    {
        /// <summary>
        ///     Gets or sets the tenant.
        /// </summary>
        [JsonProperty("tenant")]
        public string Tenant { get; set; }

        /// <summary>
        ///     Gets or sets the cluster.
        /// </summary>
        [JsonProperty("cluster")]
        public string Cluster { get; set; }

        /// <summary>
        ///     Gets or sets the attitude.
        /// </summary>
        [JsonProperty("attitude")]
        public string Attitude { get; set; }
    }
}
