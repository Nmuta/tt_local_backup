﻿using System.ComponentModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.PlayFab
{
    /// <summary>
    ///     PlayFav collection ID
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum PlayFabCollectionId
    {
        [Description("default")]
        Default,
        [Description("gdk")]
        GDK,
        [Description("steam")]
        Steam,
    }
}
