using System;
using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Exceptions;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardApi.Logging;
using Turn10.LiveOps.StewardApi.Providers;

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
        public static GravityPlayerInventory SetPlayerInventoryItemDescriptions(
            GravityPlayerInventory playerInventory,
            GravityMasterInventory masterInventory,
            ILoggingService loggingService)
        {
            var title = TitleConstants.GravityCodeName;
            playerInventory.CreditRewards = SetPlayerInventoryItemDescription(playerInventory.CreditRewards, masterInventory.CreditRewards, $"{title} CreditReward", loggingService);
            playerInventory.Cars = SetPlayerInventoryItemDescription(playerInventory.Cars, masterInventory.Cars, $"{title} Car", loggingService);
            playerInventory.EnergyRefills = SetPlayerInventoryItemDescription(playerInventory.EnergyRefills, masterInventory.EnergyRefills, $"{title} EnergyRefill", loggingService);
            playerInventory.MasteryKits = SetPlayerInventoryItemDescription(playerInventory.MasteryKits, masterInventory.MasteryKits, $"{title} MasteryKit", loggingService);
            playerInventory.RepairKits = SetPlayerInventoryItemDescription(playerInventory.RepairKits, masterInventory.RepairKits, $"{title} RepairKit", loggingService);
            playerInventory.UpgradeKits = SetPlayerInventoryItemDescription(playerInventory.UpgradeKits, masterInventory.UpgradeKits, $"{title} UpgradeKit", loggingService);

            return playerInventory;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        public static SunrisePlayerInventory SetItemDescriptions(
            SunrisePlayerInventory playerInventory, SunriseMasterInventory masterInventory, ILoggingService loggingService)
        {
            var title = TitleConstants.SunriseCodeName;
            playerInventory.Cars = SetPlayerInventoryItemDescription(playerInventory.Cars, masterInventory.Cars, $"{title} Car", loggingService);
            playerInventory.CarHorns = SetPlayerInventoryItemDescription(playerInventory.CarHorns, masterInventory.CarHorns, $"{title} CarHorn", loggingService);
            playerInventory.VanityItems = SetPlayerInventoryItemDescription(playerInventory.VanityItems, masterInventory.VanityItems, $"{title} VanityItem", loggingService);
            playerInventory.Emotes = SetPlayerInventoryItemDescription(playerInventory.Emotes, masterInventory.Emotes, $"{title} Emote", loggingService);
            playerInventory.QuickChatLines = SetPlayerInventoryItemDescription(playerInventory.QuickChatLines, masterInventory.QuickChatLines, $"{title} QuickChatLine", loggingService);

            return playerInventory;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        public static ApolloPlayerInventory SetItemDescriptions(ApolloPlayerInventory playerInventory, ApolloMasterInventory masterInventory, ILoggingService loggingService)
        {
            var title = TitleConstants.ApolloCodeName;
            playerInventory.Cars = SetPlayerInventoryItemDescription(playerInventory.Cars, masterInventory.Cars, $"{title} Car", loggingService);
            playerInventory.VanityItems = SetPlayerInventoryItemDescription(playerInventory.VanityItems, masterInventory.VanityItems, $"{title} VanityItem", loggingService);

            return playerInventory;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        public static SteelheadPlayerInventory SetItemDescriptions(SteelheadPlayerInventory playerInventory, SteelheadMasterInventory masterInventory, ILoggingService loggingService)
        {
            var title = TitleConstants.SteelheadCodeName;
            playerInventory.Cars = SetPlayerInventoryItemDescription(playerInventory.Cars, masterInventory.Cars, $"{title} Car", loggingService);
            playerInventory.VanityItems = SetPlayerInventoryItemDescription(playerInventory.VanityItems, masterInventory.VanityItems, $"{title} VanityItem", loggingService);

            return playerInventory;
        }

        /// <summary>
        ///     Verifies the gift inventory against the title master inventory list.
        /// </summary>
        public static WoodstockPlayerInventory SetItemDescriptions(WoodstockPlayerInventory playerInventory, WoodstockMasterInventory masterInventory, ILoggingService loggingService)
        {
            var title = TitleConstants.WoodstockCodeName;
            playerInventory.Cars = SetPlayerInventoryItemDescription(playerInventory.Cars, masterInventory.Cars, $"{title} Car", loggingService);
            playerInventory.CarHorns = SetPlayerInventoryItemDescription(playerInventory.CarHorns, masterInventory.CarHorns, $"{title} CarHorn", loggingService);
            playerInventory.VanityItems = SetPlayerInventoryItemDescription(playerInventory.VanityItems, masterInventory.VanityItems, $"{title} VanityItem", loggingService);
            playerInventory.Emotes = SetPlayerInventoryItemDescription(playerInventory.Emotes, masterInventory.Emotes, $"{title} Emote", loggingService);
            playerInventory.QuickChatLines = SetPlayerInventoryItemDescription(playerInventory.QuickChatLines, masterInventory.QuickChatLines, $"{title} QuickChatLine", loggingService);

            return playerInventory;
        }

        /// <summary>
        ///     Sets player inventory item descriptions based on matching master inventory items.
        /// </summary>
        public static IList<PlayerInventoryItem> SetPlayerInventoryItemDescription(IList<PlayerInventoryItem> playerInventoryItems, IList<MasterInventoryItem> masterInventoryItems, string logName, ILoggingService loggingService)
        {
            foreach (var item in playerInventoryItems)
            {
                try
                {
                    item.Description = masterInventoryItems.First(masterItem => masterItem.Id == item.Id).Description;
                    if (string.IsNullOrWhiteSpace(item.Description))
                    {
                        throw new InvalidOperationException();
                    }
                }
                catch
                {
                    item.Description = "No item name";
                    loggingService.LogException(new InventoryItemStewardException($"Missing Description for {logName}. Item ID: {item.Id}"));
                }
            }

            return playerInventoryItems;
        }
    }
}
