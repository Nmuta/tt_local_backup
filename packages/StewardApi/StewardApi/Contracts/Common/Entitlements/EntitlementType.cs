using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common.Entitlements
{
    /// <summary>
    ///     Represents player entitlement types.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum EntitlementType
    {
        Purchased,
        Cancelled,
        Refunded,
        PurchasedSteam,
    }
}
