using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup
{
    /// <summary>
    ///     Weather condition type for Racer's Cup
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum RacersCupWeatherConditionType
    {
        Clear,
        Cloudy,
        Overcast,
        Thunderstorm,
        Rainy,
    }
}
