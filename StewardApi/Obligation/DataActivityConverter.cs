using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace Turn10.LiveOps.StewardApi.Obligation
{
    /// <summary>
    ///     A JSON Converter for Data Activities
    /// </summary>
    public sealed class DataActivityConverter : JsonConverter
    {
        private static readonly JsonSerializerSettings SpecifiedSubclassConversion
            = new JsonSerializerSettings()
            {
                ContractResolver = new DataActivityBaseSpecifiedConcreteClassConverter()
            };

        /// <inheritdoc/>
        public override bool CanWrite => false;

        /// <inheritdoc/>
        public override bool CanRead => true;

        /// <inheritdoc/>
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(DataActivityBase);
        }

        /// <inheritdoc/>
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new InvalidOperationException("No one should be calling this.");
        }

        /// <inheritdoc/>
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            JObject jObject = JObject.Load(reader);
            string typeString = (string)jObject["type"];
            var typeEnum = JsonConvert.DeserializeObject<DataActivityType>($"\"{typeString}\"");

            switch (typeEnum)
            {
                case DataActivityType.Kusto:
                    return JsonConvert.DeserializeObject(jObject.ToString(), typeof(KustoDataActivity), SpecifiedSubclassConversion);
                case DataActivityType.RestateOMatic:
                    return JsonConvert.DeserializeObject(jObject.ToString(), typeof(KustoRestateOMaticDataActivity), SpecifiedSubclassConversion);
                default:
                    throw new InvalidCastException($"Unrecognized Serialization Type {typeString}");
            }
        }

        /// <summary>
        ///     This class helps us deserialize abstract classes without throw stack overflow exceptions.
        /// </summary>
        private class DataActivityBaseSpecifiedConcreteClassConverter : DefaultContractResolver
        {
            /// <inheritdoc/>
            protected override JsonConverter ResolveContractConverter(Type objectType)
            {
                if (typeof(DataActivityBase).IsAssignableFrom(objectType) && !objectType.IsAbstract)
                {
                    return null;
                }

                return base.ResolveContractConverter(objectType);
            }
        }
    }
}