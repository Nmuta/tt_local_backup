﻿using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#pragma warning disable CA1027 // Mark enums with FlagsAttribute

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents UGC type options.
    /// </summary>
    /// <remarks>Copies enum values from <see cref="Turn10.Services.LiveOps.FM8.Generated.ForzaUGCContentType" /></remarks>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum UgcType
    {
        /// <summary>
        ///     Unknown UGC item type.
        /// </summary>
        Unknown = 0,

        /// <summary>
        ///     Livery UGC item type.
        /// </summary>
        Livery = 1,

        /// <summary>
        ///     Layer group UGC item type. Also called Vinyls.
        /// </summary>
        LayerGroup = 2,

        /// <summary>
        ///     Tune UGC item type for non-FM8 titles
        /// </summary>
        Tune = 3,

        /// <summary>
        ///     Replay UGC item type.
        /// </summary>
        Replay = 4,

        /// <summary>
        ///     Photo UGC item type.
        /// </summary>
        Photo = 5,

        /// <summary>
        ///     Event Blueprint UGC item type.
        /// </summary>
        EventBlueprint = 6,

        /// <summary>
        ///     Tune UGC item type for FM8.
        /// </summary>
        TuneBlob = 7,

        /// <summary>
        ///     Event Community Challenge UGC item type.
        /// </summary>
        CommunityChallenge = 8,

        /// <summary>
        ///     Game Options UGC item type.
        /// </summary>
        GameOptions = 10,
    }
}
