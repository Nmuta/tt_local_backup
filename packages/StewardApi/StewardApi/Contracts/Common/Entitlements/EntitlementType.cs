using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#pragma warning disable CS1591
#pragma warning disable SA1600
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
    }
}
#pragma warning restore SA1600
#pragma warning restore CS1591
