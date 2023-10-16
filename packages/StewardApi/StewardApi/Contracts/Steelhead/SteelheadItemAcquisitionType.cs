using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Inventory item acquisition type taken from <see cref="Forza.WebServices.FM8.Generated.ForzaItemAcquisitionType"/>
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum SteelheadItemAcquisitionType
    {
        NA,
        Gift,
        PDLC,
        ForzaFaithful,
        Reward,
        ShowroomPurchase,
    }
}
