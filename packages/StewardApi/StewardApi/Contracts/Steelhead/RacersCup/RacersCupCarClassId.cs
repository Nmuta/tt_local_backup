using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#pragma warning disable SA1600 // ElementsMustBeDocumented (POCO mapped directly from LSP)
#pragma warning disable CS1591 // XML Comments (POCO mapped directly from LSP)

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.RacersCup
{
    /// <summary>
    ///     An enum which represents the car class limit for a Racer's Cup event.
    /// </summary>
    /// <remarks> Car class is generally a performance index, with 'E' being the least performant.</remarks>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum RacersCupCarClassId
    {
        E = 0,
        D = 1,
        C = 2,
        B = 3,
        A = 4,
        S = 5,
        R = 6,
        P = 7,
        X = 8,
        Any = 255, // 0x000000FF
        Unknown = 256, // 0x00000100
    }
}
