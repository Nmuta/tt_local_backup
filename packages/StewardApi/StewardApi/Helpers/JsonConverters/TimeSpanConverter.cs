using System;
using System.Globalization;
using System.Xml;
using Newtonsoft.Json;

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
            TimeSpan result;

            try
            {
                result = XmlConvert.ToTimeSpan(value);
            }
            catch
            {
                result = TimeSpan.Parse(value, CultureInfo.InvariantCulture);
            }

            return result;
        }

        /// <inheritdoc />
        public override bool CanConvert(Type objectType)
        {
            var test = objectType == typeof(TimeSpan) || objectType == typeof(TimeSpan?);
            return test;
        }
    }
}
