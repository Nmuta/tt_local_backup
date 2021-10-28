using System;
using System.Data;
using Turn10.LiveOps.StewardApi.Contracts.Data;

#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common.Entitlements
{
    /// <summary>
    ///     Represents a cancelled entitlement.
    /// </summary>
    public class CancelledEntitlement : Entitlement
    {
        public CancelledEntitlement()
        {
            this.Type = EntitlementType.Cancelled;
        }

        public int RevokedDateId { get; set; }

        public string ClientDeviceType { get; set; }

        public string OrderStateName { get; set; }

        /// <summary>
        ///     Makes a query for getting cancelled entitlements.
        /// </summary>
        public static string MakeQuery(ulong xuid)
        {
            return $"get_entitlements_PurchaseCancellation({xuid})";
        }

        public static CancelledEntitlement FromQueryResult(IDataReader reader)
        {
            return new CancelledEntitlement
            {
                RevokedDateId = reader.Get<int>(nameof(RevokedDateId)),
                ClientDeviceType = reader.Get<string>(nameof(ClientDeviceType)),
                OrderStateName = reader.Get<string>(nameof(OrderStateName)),
                DateId = reader.Get<int>(nameof(DateId)),
                Xuid = reader.Get<ulong>(nameof(Xuid)),
                OrderId = reader.Get<string>(nameof(OrderId)),
                PurchasePriceUSDAmount = reader.Get<decimal>(nameof(PurchasePriceUSDAmount)),
                IsPaidTransaction = reader.Get<bool>(nameof(IsPaidTransaction)),
                ProductId = reader.Get<string>(nameof(ProductId)),
                ProductTypeName = reader.Get<string>(nameof(ProductTypeName)),
                TitleId = reader.Get<ulong>(nameof(TitleId)),
            };
        }
    }
}
#pragma warning restore SA1600
#pragma warning restore CS1591
