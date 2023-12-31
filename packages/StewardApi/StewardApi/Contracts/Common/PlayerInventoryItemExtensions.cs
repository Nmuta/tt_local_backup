﻿using System;
using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Logging;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Extensions for a Player Inventory Item.
    /// </summary>
    public static class PlayerInventoryItemExtensions
    {
        /// <summary>
        ///     Sets player inventory item descriptions based on matching master inventory items.
        /// </summary>
        public static IList<T> SetPlayerInventoryItemDescription<T>(
            this IList<T> playerInventoryItems,
            IList<MasterInventoryItem> masterInventoryItems,
            string logName,
            string logMetadata,
            ILoggingService loggingService) where T : PlayerInventoryItem
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
                    loggingService.LogInventoryEvent("Missing Description", logName, item, logMetadata);
                }
            }

            return playerInventoryItems;
        }

        /// <summary>
        ///     Sets player inventory item descriptions based on matching master inventory items.
        /// </summary>
        public static IList<T> SetPlayerInventoryCarItemDescription<T>(
            this IList<T> playerInventoryCarItems,
            IList<MasterInventoryItem> masterInventoryItems,
            string logName,
            string logMetadata,
            ILoggingService loggingService) where T : SteelheadPlayerInventoryCarItem
        {
            foreach (var item in playerInventoryCarItems)
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
                    loggingService.LogInventoryEvent("Missing Description", logName, item, logMetadata);
                }
            }

            return playerInventoryCarItems;
        }
    }
}
