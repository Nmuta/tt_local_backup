using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Tiles
{
    /// <summary>
    ///     Represents available tile sizes in Welcome Center.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum TileSize
    {
        Medium,
        Large,
    }
}
