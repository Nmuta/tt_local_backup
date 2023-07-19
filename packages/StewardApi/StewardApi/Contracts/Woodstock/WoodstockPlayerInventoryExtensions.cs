using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Extensions for a Woodstock player inventory.
    /// </summary>
    public static class WoodstockPlayerInventoryExtensions
    {
        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        public static void SetItemDescriptions(
            this WoodstockPlayerInventory playerInventory,
            WoodstockMasterInventory masterInventory,
            string logMetadata,
            ILoggingService loggingService)
        {
            var title = TitleConstants.WoodstockCodeName;
            playerInventory.Cars.SetPlayerInventoryItemDescription(masterInventory.Cars, $"{title} Car", logMetadata, loggingService);
            playerInventory.CarHorns.SetPlayerInventoryItemDescription(masterInventory.CarHorns, $"{title} CarHorn", logMetadata, loggingService);
            playerInventory.VanityItems.SetPlayerInventoryItemDescription(masterInventory.VanityItems, $"{title} VanityItem", logMetadata, loggingService);
            playerInventory.Emotes.SetPlayerInventoryItemDescription(masterInventory.Emotes, $"{title} Emote", logMetadata, loggingService);
            playerInventory.QuickChatLines.SetPlayerInventoryItemDescription(masterInventory.QuickChatLines, $"{title} QuickChatLine", logMetadata, loggingService);
        }
    }
}
