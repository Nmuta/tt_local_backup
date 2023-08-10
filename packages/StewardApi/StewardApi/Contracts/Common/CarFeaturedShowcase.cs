﻿using System;

#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a featured showcase of a car.
    /// </summary>
    public sealed class CarFeaturedShowcase
    {
        public string Title { get; set; }

        public string Description { get; set; }

        public DateTimeOffset? StartTimeUtc { get; set; }

        public DateTimeOffset? EndTimeUtc { get; set; }

        public int BaseCost { get; set; }

        public int CarId { get; set; }

        public string ModelShort { get; set; }

        public string MediaName { get; set; }

        public float? SalePercentOff { get; set; }

        public float? SalePrice { get; set; }

        public float? VipSalePercentOff { get; set; }

        public float? VipSalePrice { get; set; }
    }
}
