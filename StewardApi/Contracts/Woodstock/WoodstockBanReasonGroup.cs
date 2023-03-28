using System;
using System.Collections.Generic;
using Xls.Security.FH5_main.Generated;

namespace Turn10.LiveOps.StewardApi.Contracts.Woodstock
{
    /// <summary>
    ///     Represents a woodstock ban reason group.
    /// </summary>
    public sealed class WoodstockBanReasonGroup
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
