using System;
using System.Data;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Contracts.Common.Entitlements
{
    /// <summary>
    ///     Represents a purchased Entitlement.
    /// </summary>
    public class PurchasedEntitlement : Entitlement
    {
        public PurchasedEntitlement()
        {
            this.Type = EntitlementType.Purchased;
        }

        public DateTime PurchaseDateTimeUtc { get; set; }

        public ulong PurchaseQuantity { get; set; }

        public bool TokenRedemption { get; set; }

        public bool IsFullProduct { get; set; }

        public bool IsTrialProduct { get; set; }

        public bool IsBetaProduct { get; set; }

        public bool IsInGamePurchase { get; set; }

        public string XboxParentProductId { get; set; }

        public string SkuDisplayName { get; set; }

        public string TransactionTypeName { get; set; }

        public string DataSourceName { get; set; }

        /// <summary>
        ///     Makes a query for getting purchased entitlements.
        /// </summary>
        public static string MakeQuery(ulong xuid)
        {
            return $"get_entitlements_purchaseorder_v2({xuid}) | project-rename PurchaseDateTimeUtc=PurchaseDateTime";
        }

        /// <summary>
        ///     Builds PurchasedEntitlement DTO from Kusto Query results
        /// </summary>
        public static PurchasedEntitlement FromQueryResult(IDataReader reader)
        {
            return new PurchasedEntitlement
            {
                DateId = reader.Get<int>(nameof(DateId)),
                PurchaseDateTimeUtc = reader.Get<DateTime>(nameof(PurchaseDateTimeUtc)),
                Xuid = reader.Get<ulong>(nameof(Xuid)),
                OrderId = reader.Get<string>(nameof(OrderId)),
                PurchaseQuantity = reader.Get<ulong>(nameof(PurchaseQuantity)),
                PurchasePriceUSDAmount = reader.Get<decimal>(nameof(PurchasePriceUSDAmount)),
                IsPaidTransaction = reader.Get<bool>(nameof(IsPaidTransaction)),
                TokenRedemption = reader.Get<bool>(nameof(TokenRedemption)),
                IsFullProduct = reader.Get<bool>(nameof(IsFullProduct)),
                IsTrialProduct = reader.Get<bool>(nameof(IsTrialProduct)),
                IsBetaProduct = reader.Get<bool>(nameof(IsBetaProduct)),
                IsInGamePurchase = reader.Get<bool>(nameof(IsInGamePurchase)),
                ProductId = reader.Get<string>(nameof(ProductId)),
                ProductTypeName = reader.Get<string>(nameof(ProductTypeName)),
                ProductDisplayName = reader.Get<string>(nameof(ProductDisplayName)),
                XboxParentProductId = reader.Get<string>(nameof(XboxParentProductId)),
                SkuDisplayName = reader.Get<string>(nameof(SkuDisplayName)),
                TransactionTypeName = reader.Get<string>(nameof(TransactionTypeName)),
                DataSourceName = reader.Get<string>(nameof(DataSourceName)),
                TitleId = reader.Get<ulong>(nameof(TitleId)),
            };
        }
    }
}
