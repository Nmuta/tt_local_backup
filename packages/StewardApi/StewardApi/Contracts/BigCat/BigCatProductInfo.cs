using System.Collections.Generic;

namespace Turn10.LiveOps.StewardApi.Contracts.BigCat
{
    /// <summary>
    ///     Product Information as sourced from Big Catalog API
    /// </summary>
    public class BigCatProductInfo
    {
        public IList<BigCatProductPrice> Prices { get; set; }

        public string Name { get; set; }

        /// <summary>
        ///     Builds cache key for Big Cat Product Info.
        /// </summary>
        public static string BuildCacheKey(string productId)
        {
            return $"BigCatProductInfo_{productId}";
        }
    }
}
