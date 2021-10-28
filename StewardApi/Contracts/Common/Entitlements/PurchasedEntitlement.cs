using System;
using System.Data;
using Turn10.LiveOps.StewardApi.Contracts.Data;

#pragma warning disable CS1591
#pragma warning disable SA1600
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

        public decimal MsrpUsdAmount { get; set; }

        public bool TokenRedemption { get; set; }

        public bool IsFullProduct { get; set; }

        public bool IsTrialProduct { get; set; }

        public bool IsBetaProduct { get; set; }

        public bool IsInGamePurchase { get; set; }

        public string XboxProductId { get; set; }

        public string ProductDisplayName { get; set; }

        public string XboxParentProductId { get; set; }

        public string SkuDisplayName { get; set; }

        public string SkuTypeName { get; set; }

        public string TransactionTypeName { get; set; }

        public string DataSourceName { get; set; }

        public string StoreClientName { get; set; }

        /// <summary>
        ///     Makes a query for getting purchased entitlements.
        /// </summary>
        public static string MakeQuery(ulong xuid)
        {
            return $"get_entitlements_PurchaseOrder({xuid}) | project-rename PurchaseDateTimeUtc=PurchaseDateTime, MsrpUsdAmount=MSRPUSDAmount";
        }

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
                MsrpUsdAmount = reader.Get<decimal>(nameof(MsrpUsdAmount)),
                IsPaidTransaction = reader.Get<bool>(nameof(IsPaidTransaction)),
                TokenRedemption = reader.Get<bool>(nameof(TokenRedemption)),
                IsFullProduct = reader.Get<bool>(nameof(IsFullProduct)),
                IsTrialProduct = reader.Get<bool>(nameof(IsTrialProduct)),
                IsBetaProduct = reader.Get<bool>(nameof(IsBetaProduct)),
                IsInGamePurchase = reader.Get<bool>(nameof(IsInGamePurchase)),
                ProductId = reader.Get<string>(nameof(ProductId)),
                XboxProductId = reader.Get<string>(nameof(XboxProductId)),
                ProductTypeName = reader.Get<string>(nameof(ProductTypeName)),
                ProductDisplayName = reader.Get<string>(nameof(ProductDisplayName)),
                XboxParentProductId = reader.Get<string>(nameof(XboxParentProductId)),
                SkuDisplayName = reader.Get<string>(nameof(SkuDisplayName)),
                SkuTypeName = reader.Get<string>(nameof(SkuTypeName)),
                TransactionTypeName = reader.Get<string>(nameof(TransactionTypeName)),
                DataSourceName = reader.Get<string>(nameof(DataSourceName)),
                StoreClientName = reader.Get<string>(nameof(StoreClientName)),
                TitleId = reader.Get<ulong>(nameof(TitleId)),
            };
        }
    }
}
#pragma warning restore SA1600
#pragma warning restore CS1591
