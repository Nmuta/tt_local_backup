using System.Data;
using Turn10.LiveOps.StewardApi.Contracts.Data;

#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common.Entitlements
{
    /// <summary>
    ///     Represents a refunded Entitlement.
    /// </summary>
    public class RefundedEntitlement : Entitlement
    {
        public RefundedEntitlement()
        {
            this.Type = EntitlementType.Refunded;
        }

        public int RefundDateId { get; set; }

        public string ClientDeviceType { get; set; }

        public string OrderStateName { get; set; }

        public string RefundReasonCode { get; set; }

        /// <summary>
        ///     Makes a query for getting refunded entitlements.
        /// </summary>
        public static string MakeQuery(ulong xuid)
        {
            return $"get_entitlements_purchaserefund_v2({xuid})";
        }

        public static RefundedEntitlement FromQueryResult(IDataReader reader)
        {
            return new RefundedEntitlement
            {
                RefundDateId = reader.Get<int>(nameof(RefundDateId)),
                ClientDeviceType = reader.Get<string>(nameof(ClientDeviceType)),
                OrderStateName = reader.Get<string>(nameof(OrderStateName)),
                RefundReasonCode = reader.Get<string>(nameof(RefundReasonCode)),
                DateId = reader.Get<int>(nameof(DateId)),
                Xuid = reader.Get<ulong>(nameof(Xuid)),
                OrderId = reader.Get<string>(nameof(OrderId)),
                PurchasePriceUSDAmount = reader.Get<decimal>(nameof(PurchasePriceUSDAmount)),
                IsPaidTransaction = reader.Get<bool>(nameof(IsPaidTransaction)),
                ProductId = reader.Get<string>(nameof(ProductId)),
                ProductDisplayName = reader.Get<string>(nameof(ProductDisplayName)),
                ProductTypeName = reader.Get<string>(nameof(ProductTypeName)),
                TitleId = reader.Get<ulong>(nameof(TitleId)),
            };
        }
    }
}
#pragma warning restore SA1600
#pragma warning restore CS1591
