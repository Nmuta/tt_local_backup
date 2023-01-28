#pragma warning disable SA1600 // ElementsMustBeDocumented

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter
{
    public class LocalizedStringBridge
    {
        public ushort MaxLength { get; set; }

        public LocTextBridge LocString { get; set; }

        public string Category { get; set; }

        public string SubCategory { get; set; }

        public string id { get; set; }
    }
}
