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
        public bool Equals(BigCatProductPrice price1, BigCatProductPrice price2)
        {
            if (price1 == null && price2 == null)
                return true;
            else if (price1 == null || price2 == null)
                return false;
            else if (price1.CurrencyCode == price2.CurrencyCode
                    && price1.IsPiRequired == price2.IsPiRequired
                    && price1.ListPrice == price2.ListPrice
                    & price1.MSRP == price2.MSRP
                    & price1.WholesaleCurrencyCode == price2.WholesaleCurrencyCode)
                return true;
            else
                return false;
        }

        /// <inheritdoc />
        public int GetHashCode(BigCatProductPrice price)
        {
            // Integers 17 and 23 are prime numbers, should help avoid collision
            int hash = 17;

            hash = hash * 23 + price.CurrencyCode.GetHashCode();
            hash = hash * 23 + price.IsPiRequired.GetHashCode();
            hash = hash * 23 + price.ListPrice.GetHashCode();
            hash = hash * 23 + price.MSRP.GetHashCode();
            hash = hash * 23 + price.WholesaleCurrencyCode.GetHashCode();

            return hash;
        }
    }
}
