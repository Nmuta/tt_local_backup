using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Forte
{
    /// <summary>
    ///     List of available Forte PlayFab environments.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum FortePlayFabEnvironment
    {
        Dev,
    }
}
