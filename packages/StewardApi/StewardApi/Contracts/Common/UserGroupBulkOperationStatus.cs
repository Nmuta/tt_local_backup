using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     User group bulk operation status.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum UserGroupBulkOperationStatus
    {
        Pending = 0,
        Completed = 1,
        Failed = 2,
    }
}
