#pragma warning disable SA1600 // ElementsMustBeDocumented

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using SteelheadLiveOpsContent;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    /// <summary>
    ///     Localized String Bridge
    /// </summary>
    public class LocalizedStringBridge
    {
        public string TextToLocalize { get; set; }

        public string Description { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public LocCategory Category { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public LocSubCategory SubCategory { get; set; }
    }
}
