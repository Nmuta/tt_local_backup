using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using Turn10;
using Turn10.LiveOps;
using Turn10.LiveOps.StewardApi;
using Turn10.LiveOps.StewardApi.Contracts.BigCat;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardApi.Providers.BigCat;
using Turn10.LiveOps.StewardApi.Providers.Data;

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
        Task<List<BigCatProductPrice>> RetrievePriceCatalogAsync(string productId);
    }
}
