using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Inventory item source taken from <see cref="Forza.WebServices.FM8.Generated.ForzaInventoryItemSource"/>
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum SteelheadInventoryItemSource
    {
        Unknown,
        MicrosoftStore,
        Steam,
        Steward,
        Gameplay,
        Gift,
        Debug,
        DriverProgression,
        CarProgression,
        ForzaFaithful,
        FirstCarSelect,
    }
}
