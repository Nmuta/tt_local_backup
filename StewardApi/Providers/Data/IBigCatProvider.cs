using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes methods for retrieving and pricing information for XBOX ecosystem.
    /// </summary>
    public interface IBigCatProvider
    {
        Task<List<BigCatProductPrice>> RetrievePriceCatalogAsync(string productId);
    }
}
