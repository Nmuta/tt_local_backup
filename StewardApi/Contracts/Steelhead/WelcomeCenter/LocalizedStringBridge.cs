#pragma warning disable SA1600 // ElementsMustBeDocumented

using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using SteelheadLiveOpsContent;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    public class LocalizedStringBridge
    {
        public ushort MaxLength { get; set; }

        public LocTextBridge LocString { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public LocCategory Category { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public LocSubCategory SubCategory { get; set; }

        public Guid Id { get; set; }
    }
}
