using System;
using Autofac;
using Microsoft.Extensions.DependencyInjection;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise;
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
        public static void Register(ContainerBuilder builder)
        {
            builder.RegisterType<SteelheadProxyFactory>().As<ISteelheadProxyFactory>().SingleInstance();
            builder.RegisterType<SteelheadProxyBundle>().InstancePerLifetimeScope();

            builder.RegisterType<WoodstockProxyFactory>().As<IWoodstockProxyFactory>().SingleInstance();
            builder.RegisterType<WoodstockProxyBundle>().InstancePerLifetimeScope();

            builder.RegisterType<ApolloProxyFactory>().As<IApolloProxyFactory>().SingleInstance();
            builder.RegisterType<ApolloProxyBundle>().InstancePerLifetimeScope();

            builder.RegisterType<SunriseProxyFactory>().As<ISunriseProxyFactory>().SingleInstance();
            builder.RegisterType<SunriseProxyBundle>().InstancePerLifetimeScope();
        }
    }
}
