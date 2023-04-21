using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a ban configuration.
    /// </summary>
    public sealed class BanConfiguration
    {
        /// <summary>
        ///     Gets or sets ban configuration Id.
        /// </summary>
        public Guid BanConfigurationId { get; set; }

        /// <summary>
        ///     Gets or sets the friendly name.
        /// </summary>
        public string FriendlyName { get; set; }
    }
}
