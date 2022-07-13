using System;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;

namespace Turn10.LiveOps.StewardApi.Proxies
{
    /// <summary>
    ///     Handles DI registrations for proxy classes.
    /// </summary>
    public static class ProxyRegistrations
    {
        /// <summary>
        ///     Performs the registration. Use on startup.
        /// </summary>
        public static void Register(IServiceCollection services)
        {
            services.AddSingleton<ISteelheadProxyFactory, SteelheadProxyFactory>();
            services.AddScoped<SteelheadProxyBundle>();

            services.AddSingleton<IWoodstockProxyFactory, WoodstockProxyFactory>();
            services.AddScoped<WoodstockProxyBundle>();
        }
    }
}
