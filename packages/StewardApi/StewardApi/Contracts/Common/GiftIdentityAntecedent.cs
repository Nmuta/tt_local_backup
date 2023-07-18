using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the available gift history types.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum GiftIdentityAntecedent
    {
        /// <summary>
        ///     The xuid.
        /// </summary>
        Xuid,

        /// <summary>
        ///     The Turn 10 ID.
        /// </summary>
        T10Id,

        /// <summary>
        ///     The LSP group ID.
        /// </summary>
        LspGroupId
    }
}
