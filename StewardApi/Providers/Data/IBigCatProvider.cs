using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes methods for retrieving and pricing information for XBOX ecosystem.
    /// </summary>
    public interface IBigCatProvider
    {
        /// <summary>
        ///     Retrieves product pricing information by product ID.
        /// </summary>
        Task<List<BigCatProductPrice>> RetrievePriceCatalogAsync(string productId);
    }
}
