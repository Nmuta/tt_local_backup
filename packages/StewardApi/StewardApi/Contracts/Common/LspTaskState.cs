using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Microsoft.VisualStudio.Services.Graph.GraphResourceIds;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the state of an LSP Task.
    /// </summary>
    /// <remarks>Copies enum values from Turn10.Services.LiveOps.FH5_main.Generated.ForzaTaskStateEnum.</remarks>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum LspTaskState
    {
        Pending = 0,
        Processing = 1,
        Complete = 2,
        Failed = 3,
        Disabled = 4
    }
}