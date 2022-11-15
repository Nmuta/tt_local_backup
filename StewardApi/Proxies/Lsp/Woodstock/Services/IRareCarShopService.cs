using System;
using System.Threading.Tasks;
using RareCarShopService = Forza.WebServices.FH5_main.Generated.RareCarShopService;

#pragma warning disable VSTHRD200 // Use  Suffix
#pragma warning disable SA1516 // Blank lines
#pragma warning disable SA1600 // Elements must be documented
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock.Services
{
    /// <summary>
    ///     Interface proxy for <see cref="RareCarShopService"/>.
    /// </summary>
    public interface IRareCarShopService
    {
        Task<RareCarShopService.AdminGetTokenBalanceOutput> AdminGetTokenBalance(ulong xuid);

        Task AdminSetBalance(ulong xuid, uint newBalance);
    }
}
