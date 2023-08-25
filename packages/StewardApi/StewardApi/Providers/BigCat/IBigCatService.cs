using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.BigCat;

namespace Turn10.LiveOps.StewardApi.Providers.BigCat
{
    /// <summary>
    ///     Exposes methods for retrieving and pricing information for XBOX ecosystem.
    /// </summary>
    public interface IBigCatService
    {
        /// <summary>
        ///     Retrieves product pricing information by product ID.
        /// </summary>
        Task<BigCatProductInfo> RetrievePriceCatalogAsync(string productId);
    }
}
