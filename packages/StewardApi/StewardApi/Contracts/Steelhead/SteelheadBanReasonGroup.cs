using System;
using System.Collections.Generic;
using Xls.Security.FM8.Generated;

namespace Turn10.LiveOps.StewardApi.Contracts.Steelhead
{
    /// <summary>
    ///     Represents a Steelhead ban reason group.
    /// </summary>
    public sealed class SteelheadBanReasonGroup
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
        public IEnumerable<FeatureAreas> FeatureAreas { get; set; }
    }
}
