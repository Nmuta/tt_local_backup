using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///    User Group Bulk Operation Type.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum UserGroupBulkOperationType
    {
        Add = 0,
        Remove = 1,
    }
}
