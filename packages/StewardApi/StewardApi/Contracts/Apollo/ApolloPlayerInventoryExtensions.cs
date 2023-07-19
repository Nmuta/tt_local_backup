using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;

namespace Turn10.LiveOps.StewardApi.Contracts.Apollo
{
    /// <summary>
    ///     Extensions for an Apollo player inventory.
    /// </summary>
    public static class ApolloPlayerInventoryExtensions
    {
        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        public static void SetItemDescriptions(
            this ApolloPlayerInventory playerInventory,
            ApolloMasterInventory masterInventory,
            string logMetadata,
            ILoggingService loggingService)
        {
            var title = TitleConstants.ApolloCodeName;
            playerInventory.Cars.SetPlayerInventoryItemDescription(masterInventory.Cars, $"{title} Car", logMetadata, loggingService);
            playerInventory.VanityItems.SetPlayerInventoryItemDescription(masterInventory.VanityItems, $"{title} VanityItem", logMetadata, loggingService);
        }
    }
}
