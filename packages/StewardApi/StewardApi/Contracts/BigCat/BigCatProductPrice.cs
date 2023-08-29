#pragma warning disable SA1600 // Elements should be documented

namespace Turn10.LiveOps.StewardApi.Contracts.BigCat
{
    /// <summary>
    ///     Product pricing info, as sourced from Big Catalog API
    /// </summary>
    public class BigCatProductPrice
    {
        public string CurrencyCode { get; set; }

        public bool IsPiRequired { get; set; }

        public double ListPrice { get; set; }

        public double MSRP { get; set; }

        public string WholesaleCurrencyCode { get; set; }

        public double? WholesalePrice { get; set; }
    }
}
