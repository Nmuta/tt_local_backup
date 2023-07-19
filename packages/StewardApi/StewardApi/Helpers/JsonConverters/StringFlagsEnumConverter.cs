using System;
using System.Linq;
using Newtonsoft.Json;

// Based on https://stackoverflow.com/questions/43143175/c-sharp-json-net-render-flags-enum-as-string-array
namespace Turn10.LiveOps.StewardApi.Helpers.JsonConverters
{
    /// <summary>
    ///     Converter for Flag-like enums.
    /// </summary>
    /// <typeparam name="T">The enum type to convert to/from.</typeparam>
    public class StringFlagsEnumConverter<T> : JsonConverter
        where T : Enum
    {
        /// <inheritdoc/>
        public override object ReadJson(JsonReader reader, Type objectType, Object existingValue, JsonSerializer serializer)
        {
            int outVal = 0;
            if (reader.TokenType == JsonToken.StartArray)
            {
                reader.Read();
                while (reader.TokenType != JsonToken.EndArray)
                {
                    outVal += (int)Enum.Parse(objectType, reader.Value.ToString());
                    reader.Read();
                }
            }

            return (T)(object)outVal;
        }

        /// <inheritdoc/>
        public override void WriteJson(JsonWriter writer, Object value, JsonSerializer serializer)
        {
            if (default(T).Equals(value))
            {
                writer.WriteRawValue($"[\"{default(T)}\"]");
                return;
            }

            var flags =
                Enum.GetValues(value.GetType())
                .Cast<T>()
                .Where(f => ((T)value).HasFlag(f) && !f.Equals(default(T)))
                .Select(f => $"\"{f}\"");

            writer.WriteRawValue($"[{string.Join(", ", flags)}]");
        }

        /// <inheritdoc/>
        public override bool CanConvert(Type objectType)
        {
            return true;
        }
    }
}
