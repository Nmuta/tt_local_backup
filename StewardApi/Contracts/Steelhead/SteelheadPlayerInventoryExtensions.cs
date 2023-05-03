using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Extensions for a Steelhead player inventory.
    /// </summary>
    public static class SteelheadPlayerInventoryExtensions
    {
        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        public static void SetItemDescriptions(
            this SteelheadPlayerInventory playerInventory,
            SteelheadMasterInventory masterInventory,
            string logMetadata,
            ILoggingService loggingService)
        {
            var title = TitleConstants.SteelheadCodeName;
            playerInventory.Cars.SetPlayerInventoryCarItemDescription(masterInventory.Cars, $"{title} Car", logMetadata, loggingService);
            playerInventory.VanityItems.SetPlayerInventoryItemDescription(masterInventory.VanityItems, $"{title} VanityItem", logMetadata, loggingService);
        }
    }
}
