using System;
using System.Collections.Generic;
using WoodstockLiveOpsContent;

#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a featured showcase of a manufacturer.
    /// </summary>
    public sealed class ManufacturerFeaturedShowcase
    {
        public string Title { get; set; }

        public string Description { get; set; }

        public DateTimeOffset StartTimeUtc { get; set; }

        public DateTimeOffset EndTimeUtc { get; set; }

        public int ManufacturerId { get; set; }

        public string ManufacturerName { get; set; }
    }
}
