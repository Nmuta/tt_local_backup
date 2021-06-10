using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents items tied to a player's account/xuid, and not their inventory profile.
    /// </summary>
    public sealed class WoodstockAccountInventory
    {
        /// <summary>
        ///     Gets or sets the backstage passes.
        /// </summary>
        public int BackstagePasses { get; set; }
    }
}