using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents the supported notification actions.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum NotificationAction
    {
        /// <summary>
        ///     Indeterminate notification action.
        /// </summary>
        None,

        /// <summary>
        ///     Sending a notification.
        /// </summary>
        Send,

        /// <summary>
        ///     Editing a notification.
        /// </summary>
        Edit,

        /// <summary>
        ///     Deleting a notification.
        /// </summary>
        Delete,
    }
}
