using Forza.LiveOps.FH4.Generated;
using System;
using System.Threading.Tasks;
using static Forza.LiveOps.FH4.Generated.StorefrontManagementService;

#pragma warning disable VSTHRD200 // Use Async Suffix

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise.Services
{
    /// <summary>
    ///     Proxy interface for <see cref="StorefrontManagementService"/>.
    /// </summary>
    public interface IStorefrontManagementService
    {
        /// <summary>Hides a specific ugc.</summary>
        Task<GetUGCObjectOutput> GetUGCObject(Guid id);
    }
}
