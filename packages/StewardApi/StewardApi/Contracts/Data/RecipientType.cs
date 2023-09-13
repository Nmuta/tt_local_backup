using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Contracts.Data
{
    /// <summary>
    ///     The recipient type
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum RecipientType
    {
        [JsonProperty("none")]
        None,
        [JsonProperty("xuid")]
        Xuid,
        [JsonProperty("t10Id")]
        T10Id,
        [JsonProperty("groupId")]
        GroupId,
        [JsonProperty("auctionId")]
        AuctionId,
        [JsonProperty("carId")]
        CarId,
        [JsonProperty("ugcId")]
        UgcId,
        [JsonProperty("consoleId")]
        ConsoleId,
        [JsonProperty("notificationId")]
        NotificationId,
        [JsonProperty("scoreId")]
        ScoreId,
    }
}
