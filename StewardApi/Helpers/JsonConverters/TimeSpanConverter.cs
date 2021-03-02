using System;
using System.Security.Claims;
using System.Xml;
using Newtonsoft.Json;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.Services.Authentication;

namespace Turn10.LiveOps.StewardApi.Helpers.JsonConverters
{
    /// <summary>
    ///     Json converter for TimeSpan.
    /// </summary>
    public class TimeSpanConverter : JsonConverter
    {
        /// <inheritdoc />
        public override bool CanRead { get; } = true;

        /// <inheritdoc />
        public override bool CanWrite { get; } = true;

        /// <inheritdoc />
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var ts = (TimeSpan)value;
            var tsString = XmlConvert.ToString(ts);
            serializer.Serialize(writer, tsString);
        }

        /// <inheritdoc />
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null)
            {
                return null;
            }

            var value = serializer.Deserialize<string>(reader);
            return XmlConvert.ToTimeSpan(value);
        }

        /// <inheritdoc />
        public override bool CanConvert(Type objectType)
        {
            var test = objectType == typeof(TimeSpan) || objectType == typeof(TimeSpan?);
            return test;
        }
    }
}
