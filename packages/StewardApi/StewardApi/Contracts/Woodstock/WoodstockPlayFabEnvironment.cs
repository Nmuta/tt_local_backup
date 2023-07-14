using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     List of available Woodstock PlayFab environments.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum WoodstockPlayFabEnvironment
    {
        Dev,
    }
}
