using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;

namespace Turn10.LiveOps.StewardApi.Helpers.JsonConverters
{
    /// <summary>
    ///     Json converter for DeeplinkDestination into the right inherited class.
    /// </summary>
    public class DeeplinkDestinationConverter : JsonConverter<DeeplinkDestination>
    {
        public override bool CanWrite => false;

        /// <summary>
        ///     Reads JSON for Deeplink Destination Converter
        /// </summary>
        public override DeeplinkDestination ReadJson(JsonReader reader, Type objectType, DeeplinkDestination existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            JObject jsonObject = JObject.Load(reader);
            var destinationType = Enum.Parse<DestinationType>(jsonObject.GetValue("destinationType", StringComparison.OrdinalIgnoreCase)?.ToString());

            DeeplinkDestination destination;
            switch (destinationType)
            {
                case DestinationType.BuildersCup:
                    destination = new BuildersCupDestination();
                    break;
                case DestinationType.RacersCup:
                    destination = new RacersCupDestination();
                    break;
                case DestinationType.PatchNotes:
                    destination = new PatchNotesDestination();
                    break;
                case DestinationType.Rivals:
                    destination = new RivalsDestination();
                    break;
                case DestinationType.Showroom:
                    destination = new ShowroomDestination();
                    break;
                case DestinationType.Store:
                    destination = new StoreDestination();
                    break;
                default:
                    throw new NotSupportedException($"Unsupported destination type: {destinationType}");
            }

            serializer.Populate(jsonObject.CreateReader(), destination);
            return destination;
        }

        public override void WriteJson(JsonWriter writer, DeeplinkDestination value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
    }
}
