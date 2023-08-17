using System;

#pragma warning disable SA1402 // File may only contain a single type

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza
{
    public class WofDisplayConditionsBridge
    {
        public ItemBridge[] Item { get; set; }
    }

    public class ItemBridge
    {
        public Guid RefId { get; set; }

        public string When { get; set; }
    }
}
