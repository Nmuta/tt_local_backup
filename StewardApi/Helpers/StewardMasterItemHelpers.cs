using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Turn10.LiveOps.StewardApi.Authorization;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.Services.Authentication;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for use in Steward.
    /// </summary>
    public static class StewardMasterItemHelpers
    {
        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        /// <param name="playerInventory">The gravity player inventory.</param>
        /// <param name="masterInventory">The gravity master inventory.</param>
        /// <returns>
        ///     String of items that are invalid.
        /// </returns>
        public static GravityPlayerInventoryBeta SetPlayerInventoryItemDescriptions(GravityPlayerInventoryBeta playerInventory, GravityMasterInventory masterInventory)
        {
            playerInventory.CreditRewards = SetPlayerInventoryItemDescription(playerInventory.CreditRewards, masterInventory.CreditRewards);
            playerInventory.Cars = SetPlayerInventoryItemDescription(playerInventory.Cars, masterInventory.Cars);
            playerInventory.EnergyRefills = SetPlayerInventoryItemDescription(playerInventory.EnergyRefills, masterInventory.EnergyRefills);
            playerInventory.MasteryKits = SetPlayerInventoryItemDescription(playerInventory.MasteryKits, masterInventory.MasteryKits);
            playerInventory.RepairKits = SetPlayerInventoryItemDescription(playerInventory.RepairKits, masterInventory.RepairKits);
            playerInventory.UpgradeKits = SetPlayerInventoryItemDescription(playerInventory.UpgradeKits, masterInventory.UpgradeKits);

            return playerInventory;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        /// <param name="playerInventory">The gravity player inventory.</param>
        /// <param name="masterInventory">The gravity master inventory.</param>
        /// <returns>
        ///     The <see cref="SunriseMasterInventory"/>.
        /// </returns>
        public static SunriseMasterInventory SetItemDescriptions(SunriseMasterInventory playerInventory, SunriseMasterInventory masterInventory)
        {
            playerInventory.Cars = SetPlayerInventoryItemDescription(playerInventory.Cars, masterInventory.Cars);
            playerInventory.CarHorns = SetPlayerInventoryItemDescription(playerInventory.CarHorns, masterInventory.CarHorns);
            playerInventory.VanityItems = SetPlayerInventoryItemDescription(playerInventory.VanityItems, masterInventory.VanityItems);
            playerInventory.Emotes = SetPlayerInventoryItemDescription(playerInventory.Emotes, masterInventory.Emotes);
            playerInventory.QuickChatLines = SetPlayerInventoryItemDescription(playerInventory.QuickChatLines, masterInventory.QuickChatLines);

            return playerInventory;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        /// <param name="playerInventory">The gravity player inventory.</param>
        /// <param name="masterInventory">The gravity master inventory.</param>
        /// <returns>
        ///     The <see cref="ApolloMasterInventory"/>.
        /// </returns>
        public static ApolloMasterInventory SetItemDescriptions(ApolloMasterInventory playerInventory, ApolloMasterInventory masterInventory)
        {
            playerInventory.Cars = SetPlayerInventoryItemDescription(playerInventory.Cars, masterInventory.Cars);
            playerInventory.VanityItems = SetPlayerInventoryItemDescription(playerInventory.VanityItems, masterInventory.VanityItems);

            return playerInventory;
        }

        /// <summary>
        ///     Sets player inventory item descriptions based on matching master inventory items.
        /// </summary>
        /// <param name="playerInventoryItems">The player inventory items.</param>
        /// <param name="masterInventoryItems">The master inventory items</param>
        /// <returns>
        ///     A <see cref="IList{MasterInventoryItem}"/>.
        /// </returns>
        public static IList<MasterInventoryItem> SetPlayerInventoryItemDescription(IList<MasterInventoryItem> playerInventoryItems, IList<MasterInventoryItem> masterInventoryItems)
        {
            foreach (var item in playerInventoryItems)
            {
                try
                {
                    item.Description = masterInventoryItems.First(masterItem => masterItem.Id == item.Id).Description;
                }
                catch
                {
                    // TODO: Log this item to app insights with custom error
                    item.Description = "No item name";
                }
            }

            return playerInventoryItems;
        }
    }
}
