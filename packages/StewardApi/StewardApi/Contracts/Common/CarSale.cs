using System;
using System.Collections.Generic;
using WoodstockLiveOpsContent;

#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a Car Sale.
    /// </summary>
    public sealed class CarSale
    {
        public string CarSaleId { get; set; }

        public string Name { get; set; }

        public DateTimeOffset? StartTimeUtc { get; set; }

        public DateTimeOffset? EndTimeUtc { get; set; }

        public IEnumerable<CarSaleInformation> Cars { get; set; }
    }
}
