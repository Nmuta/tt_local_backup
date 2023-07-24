using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Turn10.Services.LiveOps.FH5_main.Generated;
using static Microsoft.VisualStudio.Services.Graph.GraphResourceIds;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the type of an LSP Task period.
    /// </summary>
    /// <remarks>Copies enum values from Turn10.Services.LiveOps.FH5_main.Generated.ForzaTaskPeriodType.</remarks>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum LspTaskPeriodType
    {
        None = 0,
        Deterministic = 1,
        NonDeterministic = 2
    }
}