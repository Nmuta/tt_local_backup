using System;
using System.Data;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Contracts.Common.Entitlements
{
    /// <summary>
    ///     Represents a purchased Entitlement from steam.
    /// </summary>
    public class PurchasedSteamEntitlement : Entitlement
    {
        public PurchasedSteamEntitlement()
        {
            this.Type = EntitlementType.PurchasedSteam;
            this.IsPaidTransaction = true;
        }

        public DateTime PurchaseDateTimeUtc { get; set; }

        /// <summary>
        ///     Makes a query for getting purchased entitlements from steam.
        /// </summary>
        public static string MakeQuery(ulong xuid)
        {
            return $"get_steam_entitlements_purchased({xuid}) | project-rename Xuid=UserId, PurchaseDateTimeUtc=FirstTimestamp";
        }

        /// <summary>
        ///     Builds PurchasedSteamEntitlement DTO from Kusto Query results
        /// </summary>
        public static PurchasedSteamEntitlement FromQueryResult(IDataReader reader)
        {
            return new PurchasedSteamEntitlement
            {
                Xuid = reader.Get<ulong>(nameof(Xuid)),
                ProductId = reader.Get<string>(nameof(ProductId)),
                ProductDisplayName = reader.Get<string>(nameof(ProductDisplayName)),
                PurchaseDateTimeUtc = reader.Get<DateTime>(nameof(PurchaseDateTimeUtc)),
            };
        }
    }
}
