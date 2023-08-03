using System.Collections.Generic;
using Turn10;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.BigCat;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Contracts.BigCat
{
    /// <inheritdoc />
    public class BigCatProductPriceEqualityComparer : IEqualityComparer<BigCatProductPrice>
    {
        /// <inheritdoc />
        public bool Equals(BigCatProductPrice x, BigCatProductPrice y)
        {
            if (x == null && y == null)
            {
                return true;
            }
            else if (x == null || y == null)
            {
                return false;
            }
            else if (x.CurrencyCode == y.CurrencyCode
                    && x.IsPiRequired == y.IsPiRequired
                    && x.ListPrice == y.ListPrice
                    & x.MSRP == y.MSRP
                    & x.WholesaleCurrencyCode == y.WholesaleCurrencyCode)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <inheritdoc />
        public int GetHashCode(BigCatProductPrice obj)
        {
            // Integers 17 and 23 are prime numbers, should help avoid collision
            int hash = 17;

            hash = hash * 23 + obj.CurrencyCode.GetHashCode();
            hash = hash * 23 + obj.IsPiRequired.GetHashCode();
            hash = hash * 23 + obj.ListPrice.GetHashCode();
            hash = hash * 23 + obj.MSRP.GetHashCode();
            hash = hash * 23 + obj.WholesaleCurrencyCode.GetHashCode();

            return hash;
        }
    }
}
