using System;
using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a ban reason group.
    /// </summary>
    public sealed class BanReasonGroup
    {
        /// <summary>
        ///     Gets or sets the name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        ///     Gets or sets the list of reasons.
        /// </summary>
        public IEnumerable<string> Reasons { get; set; }

        /// <summary>
        ///     Gets or sets the ban configuration Id.
        /// </summary>
        public Guid BanConfigurationId { get; set; }

        /// <summary>
        ///     Gets or sets the list of feature areas.
        /// </summary>
        public IEnumerable<string> FeatureAreas { get; set; }
    }
}
