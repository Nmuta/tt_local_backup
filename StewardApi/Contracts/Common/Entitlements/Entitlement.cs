#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common.Entitlements
{
    /// <summary>
    ///     Represents a player entitlement.
    /// </summary>
    public abstract class Entitlement
    {
        public EntitlementType Type { get; set; }

        public int DateId { get; set; }

        public ulong Xuid { get; set; }

        public string OrderId { get; set; }

        public decimal PurchasePriceUSDAmount { get; set; }

        public bool IsPaidTransaction { get; set; }

        public string ProductId { get; set; }

        public string ProductTypeName { get; set; }

        public ulong TitleId { get; set; }
    }
}
#pragma warning restore SA1600
#pragma warning restore CS1591
