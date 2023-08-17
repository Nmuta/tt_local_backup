﻿#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.PlayFab
{
    /// <summary>
    ///     PlayFab transaction operation
    /// </summary>
    public class PlayFabTransactionOperation
    {
        public int? Amount { get; set; }

        public string ItemId { get; set; }

        public string ItemType { get; set; }

        public string StackId { get; set; }

        public string Type { get; set; }

        /// <summary>
        ///     Name of item. Gathered by cross-referencing with /Catalog/SearchItems endpoint
        /// </summary>
        public string ItemName { get; set; }
    }
}
