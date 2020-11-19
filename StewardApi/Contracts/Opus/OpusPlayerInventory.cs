using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Opus
{
    /// <summary>
    ///     Represents an Opus player inventory.
    /// </summary>
    public sealed class OpusPlayerInventory
    {
        /// <summary>
        ///     Gets or sets the cars.
        /// </summary>
        public IList<OpusCar> Cars { get; set; }

        /// <summary>
        ///     Gets or sets the credits.
        /// </summary>
        public int Credits { get; set; }
    }
}
