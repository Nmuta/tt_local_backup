using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.Serialization;
using Turn10.LiveOps.StewardApi.Authorization;

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
