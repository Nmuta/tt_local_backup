using Forza.WebServices.FH4.Generated;
using System;
using System.Threading.Tasks;

#pragma warning disable VSTHRD200 // Use Async Suffix

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise.Services
{
    /// <summary>
    ///     Proxy interface for <see cref="StorefrontService"/>.
    /// </summary>
    public interface IStorefrontService
    {
        /// <summary>Hides a specific ugc.</summary>
        Task HideUGC(Guid ugcId);
    }
}
