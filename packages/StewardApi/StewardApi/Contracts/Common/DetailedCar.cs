using System;

namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents detailed car info.
    /// </summary>
#pragma warning disable CS1591
#pragma warning disable SA1600
    public class DetailedCar : SimpleCar
    {
        public int AspirationTypeId { get; set; }

        public int? EnginePlacementId { get; set; }

        public int? PowertrainId { get; set; }

        public string MediaName { get; set; }

        public int? ClassId { get; set; }

        public int? CarTypeId { get; set; }

        public int? FamilyModelId { get; set; }

        public double? BaseRarity { get; set; }

        public int? BaseCost { get; set; }

        public bool IsPurchased { get; set; }

        public bool IsUnicorn { get; set; }

        public int FamilySpecialId { get; set; }

        public int RegionId { get; set; }

        public int CountryId { get; set; }

        public bool IsAvailableInAutoshow { get; set; }

        public double PerformanceIndex { get; set; }

        public string PowertrainName { get; set; }

        public string CarTypeName { get; set; }

        public string CarClassName { get; set; }

        public string RegionName { get; set; }

        /// <remarks> Projected as 'ReleaseIndex'. </remarks>
        public int Series { get; set; }

        public DateTime ReleaseDateUtc { get; set; }
    }
}
