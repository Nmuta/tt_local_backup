using System.ComponentModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.PlayFab
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum PlayFabCollectionId
    {
        [Description("default")]
        Default,
        [Description("GDK")]
        GDK,
        [Description("steam")]
        Steam,
    }
}
