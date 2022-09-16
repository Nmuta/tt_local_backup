using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a category for localization.
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum LocalizationCategory
    {
        /// <summary>
        ///     Indicates the category is not set.
        /// </summary>
        Unset,

        /// <summary>
        ///     Localizing string for Message of the Day.
        /// </summary>
        MOTD,

        /// <summary>
        ///     Localizing string for patch notes.
        /// </summary>
        PatchNotes,

        /// <summary>
        ///     Localizing string for sending notifications.
        /// </summary>
        Notifications,

        /// <summary>
        ///     Localizing string for sending gifts.
        /// </summary>
        Gifts,
    }
}
