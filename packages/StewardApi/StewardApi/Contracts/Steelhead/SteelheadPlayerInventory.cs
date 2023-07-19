using System;
using System.Collections.Generic;
using Turn10.LiveOps.StewardApi.Contracts.Common;

#pragma warning disable SA1600 // Elements should be documented
namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead master inventory.
    /// </summary>
    public sealed class SteelheadPlayerInventory : SteelheadBaseInventory<PlayerInventoryItem, PlayerInventoryCarItem>
    {
        public IEnumerable<Exception> Errors { get; set; }
    }
}
