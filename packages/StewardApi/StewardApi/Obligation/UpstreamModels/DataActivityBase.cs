using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Obligation.UpstreamModels
{
    /// <summary>
    ///     A base class for type discrimination on DataActivities.
    /// </summary>
    [JsonConverter(typeof(DataActivityConverter))]
    public abstract class DataActivityBase
    {
        /// <summary>
        ///     Gets the type discriminator used by the API to decide which object to deserialize and the behavior.
        ///     Do not change this value.
        /// </summary>
        [JsonProperty("type")]
        public abstract DataActivityType Type { get; }

        /// <summary>
        ///     Gets or sets the creation behavior of the new activity.
        ///     Only valid on initial creation.
        /// </summary>
        [JsonProperty("creation_behavior")]
        [JsonConverter(typeof(StringEnumConverter))]
        public DataActivityCreationBehavior CreationBehavior { get; set; } = DataActivityCreationBehavior.Full;
    }
}
