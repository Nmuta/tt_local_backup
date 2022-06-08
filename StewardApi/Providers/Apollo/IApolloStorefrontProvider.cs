using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <summary>
    ///     Exposes methods for interacting with the Apollo storefront.
    /// </summary>
    public interface IApolloStorefrontProvider
    {
        /// <summary>
        ///     Gets a player's private and public UGC items.
        /// </summary>
        Task<IList<ApolloUgcItem>> GetPlayerUgcContentAsync(ulong xuid, UgcType ugcType, string endpoint, bool includeThumbnails = false);

        /// <summary>
        ///     Search UGC items.
        /// </summary>
        Task<IList<ApolloUgcItem>> SearchUgcContentAsync(UgcType ugcType, UgcFilters filters, string endpoint, bool includeThumbnails = false);

        /// <summary>
        ///    Get player livery.
        /// </summary>
        Task<ApolloUgcItem> GetUgcLiveryAsync(string liveryId, string endpoint);
    }
}
