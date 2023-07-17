using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Opus
{
    /// <summary>
    ///     Extensions for a Opus player inventory.
    /// </summary>
    public static class OpusPlayerInventoryExtensions
    {
        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        public static void SetItemDescriptions(
            this OpusPlayerInventory playerInventory,
            OpusMasterInventory masterInventory,
            string logMetadata,
            ILoggingService loggingService)
        {
            var title = TitleConstants.OpusCodeName;
            playerInventory.Cars.SetPlayerInventoryItemDescription(masterInventory.Cars, $"{title} Car", logMetadata, loggingService);
        }
    }
}
