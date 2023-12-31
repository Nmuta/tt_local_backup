﻿#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.PlayFab
{
    /// <summary>
    ///     Request for modifying PlayFab Inventory
    /// </summary>
    public class PlayFabInventoryChangeRequest
    {
        public string ItemId { get; set; }

        public int Amount { get; set; }
    }
}
