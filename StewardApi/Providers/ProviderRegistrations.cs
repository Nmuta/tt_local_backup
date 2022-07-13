using Microsoft.Extensions.DependencyInjection;
using System;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Registers title specific settings and forged credentials.
    /// </summary>
    public class ProviderRegistrations
    {
        internal static void Register(IServiceCollection services)
        {
            services.AddSingleton<SteelheadSettings>();
            services.AddSingleton<WoodstockSettings>();
            services.AddSingleton<SunriseSettings>();
            services.AddSingleton<ForgedCredentialProvider>();
        }
    }
}
