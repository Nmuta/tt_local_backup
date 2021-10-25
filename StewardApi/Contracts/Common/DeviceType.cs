using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents device types.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum DeviceType
    {
        /// <summary>
        ///     All device types.
        /// </summary>
        All = -1,

        /// <summary>
        ///     MoLive device type.
        /// </summary>
        MoLive = 0,

        /// <summary>
        ///     Windows store device type.
        /// </summary>
        WindowsStore = 1,

        /// <summary>
        ///     Web device type.
        /// </summary>
        Web = 2,

        /// <summary>
        ///     Windows One core device type.
        /// </summary>
        WindowsOneCore = 3,

        /// <summary>
        ///     Windows One Core Mobile device type.
        /// </summary>
        WindowsOneCoreMobile = 4,

        /// <summary>
        ///     Windows Phone device type.
        /// </summary>
        WindowsPhone = 5,

        /// <summary>
        ///     Windows Phone 7 device type.
        /// </summary>
        WindowsPhone7 = 6,

        /// <summary>
        ///     Xbox 360 device type.
        /// </summary>
        Xbox360 = 7,

        /// <summary>
        ///     Xbox One device type.
        /// </summary>
        XboxOne = 8,

        /// <summary>
        ///     Xbox Series X|S device type.
        /// </summary>
        XboxSeriesXS = 9,

        /// <summary>
        ///     Xbox cloud device type.
        /// </summary>
        XboxCloud = 10,

        /// <summary>
        ///     Steam device type.
        /// </summary>
        Steam = 11
    }
}
