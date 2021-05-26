using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Obligation.UpstreamModels
{
    /// <summary>
    ///     Represents operations that can be submitted as part of a PATCH request.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum Operation
    {
        /// <summary>
        ///     Specifies a rename operation.
        /// </summary>
        Rename
    }
}
