using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Gravity
{
    /// <summary>
    ///     Represents Gravity save state.
    /// </summary>
    public sealed class GravitySaveState
    {
        /// <summary>
        ///     Gets or sets the user inventory ID.
        /// </summary>
        public Guid UserInventoryId { get; set; }

        /// <summary>
        ///     Gets or sets the last login.
        /// </summary>
        public DateTime LastLoginUtc { get; set; }
    }
}
