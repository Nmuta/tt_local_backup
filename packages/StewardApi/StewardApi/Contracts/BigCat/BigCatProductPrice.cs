#pragma warning disable SA1600 // Elements should be documented

using System.Collections.Generic;
using Turn10;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.BigCat;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Contracts.BigCat
{
    public class BigCatProductPrice
    {
        public string CurrencyCode { get; set; }

        public bool IsPiRequired { get; set; }

        public double ListPrice { get; set; }

        public double MSRP { get; set; }

        public string WholesaleCurrencyCode { get; set; }

        public double? WholesalePrice { get; set; }

        /// <summary>
        ///     Builds cache key for Big Cat Product Price info.
        /// </summary>
        public static string BuildCacheKey(string productId)
        {
            return $"BigCatProductPrice_{productId}";
        }
    }
}
