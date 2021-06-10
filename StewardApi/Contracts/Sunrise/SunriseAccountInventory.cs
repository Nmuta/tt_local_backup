using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Contracts.Sunrise
{
    /// <summary>
    ///     Represents items tied to a player's account/xuid, and not their inventory profile.
    /// </summary>
    public sealed class SunriseAccountInventory
    {
        /// <summary>
        ///     Gets or sets the backstage passes.
        /// </summary>
        public int BackstagePasses { get; set; }
    }
}
