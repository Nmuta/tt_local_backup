#pragma warning disable CS1591
#pragma warning disable SA1600
namespace Turn10.LiveOps.StewardApi.Contracts.Common
{
    /// <summary>
    ///     Represents a Car Sale Information.
    /// </summary>
    public sealed class CarSaleInformation
    {
        public string MediaName { get; set; }

        public string ModelShort { get; set; }

        public int CarId { get; set; }

        public int BaseCost { get; set; }

        public float SalePercentOff { get; set; }

        public float SalePrice { get; set; }

        public float VipSalePercentOff { get; set; }

        public float VipSalePrice { get; set; }
    }
}
