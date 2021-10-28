using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Extensions for a Gravity player inventory.
    /// </summary>
    public static class GravityPlayerInventoryExtensions
    {
        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        public static void SetItemDescriptions(
            this GravityPlayerInventory playerInventory,
            GravityMasterInventory masterInventory,
            string logMetadata,
            ILoggingService loggingService)
        {
            var title = TitleConstants.GravityCodeName;
            playerInventory.CreditRewards.SetPlayerInventoryItemDescription(masterInventory.CreditRewards, $"{title} CreditReward", logMetadata, loggingService);
            playerInventory.Cars.SetPlayerInventoryItemDescription(masterInventory.Cars, $"{title} Car", logMetadata, loggingService);
            playerInventory.EnergyRefills.SetPlayerInventoryItemDescription(masterInventory.EnergyRefills, $"{title} EnergyRefill", logMetadata, loggingService);
            playerInventory.MasteryKits.SetPlayerInventoryItemDescription(masterInventory.MasteryKits, $"{title} MasteryKit", logMetadata, loggingService);
            playerInventory.RepairKits.SetPlayerInventoryItemDescription(masterInventory.RepairKits, $"{title} RepairKit", logMetadata, loggingService);
            playerInventory.UpgradeKits.SetPlayerInventoryItemDescription(masterInventory.UpgradeKits, $"{title} UpgradeKit", logMetadata, loggingService);
        }
    }
}
