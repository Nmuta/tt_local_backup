using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Turn10;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Tiles;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.Tiles
{
    /// <summary>
    ///     Represents available tile sizes in Welcome Center.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum TileSize
    {
        Medium,
        Large
    }
}
