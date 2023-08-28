using Autofac;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Apollo;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Steelhead;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Sunrise;
using Turn10.LiveOps.StewardApi.Proxies.Lsp.Woodstock;
using Turn10.Services.ForzaClient;
using static Turn10.LiveOps.StewardApi.Helpers.AutofacHelpers;

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
            //builder.RegisterType<SteelheadProxyFactory>().As<ISteelheadProxyFactory>().SingleInstance();
            //builder.RegisterType<SteelheadProxyBundle>().SingleInstance();

            builder.RegisterType<SteelheadProxyFactory>().As<ISteelheadProxyFactory>().Named<ISteelheadProxyFactory>("steelheadProdLiveStewardFactory")
                .WithParameter(Named("client"), With<Client>("woodstockClientProdLiveSteward")).SingleInstance();
            builder.RegisterType<SteelheadProxyFactory>().As<ISteelheadProxyFactory>().Named<ISteelheadProxyFactory>("steelheadDevLiveStewardFactory")
                .WithParameter(Named("client"), With<Client>("steelheadClientDevLiveSteward")).SingleInstance();

            builder.RegisterType<SteelheadProxyBundle>().Named<SteelheadProxyBundle>("steelheadProdLiveStewardProxyBundle")
                    .WithParameter(Named("woodstockFactory"), With<ISteelheadProxyFactory>("steelheadProdLiveStewardFactory")).SingleInstance();
            builder.RegisterType<SteelheadProxyBundle>().Named<SteelheadProxyBundle>("steelheadDevLiveStewardProxyBundle")
                    .WithParameter(Named("woodstockFactory"), With<ISteelheadProxyFactory>("steelheadDevLiveStewardFactory")).SingleInstance();

            builder.RegisterType<WoodstockProxyFactory>().As<IWoodstockProxyFactory>().Named<IWoodstockProxyFactory>("woodstockProdLiveStewardFactory")
                .WithParameter(Named("client"), With<Client>("woodstockClientProdLiveSteward")).SingleInstance();
            builder.RegisterType<WoodstockProxyFactory>().As<IWoodstockProxyFactory>().Named<IWoodstockProxyFactory>("woodstockDevLiveStewardFactory")
                .WithParameter(Named("client"), With<Client>("woodstockClientDevLiveSteward")).SingleInstance();

            builder.RegisterType<WoodstockProxyBundle>().Named<WoodstockProxyBundle>("woodstockProdLiveStewardProxyBundle")
                    .WithParameter(Named("woodstockFactory"), With<IWoodstockProxyFactory>("woodstockProdLiveStewardFactory")).SingleInstance();
            builder.RegisterType<WoodstockProxyBundle>().Named<WoodstockProxyBundle>("woodstockDevLiveStewardProxyBundle")
                    .WithParameter(Named("woodstockFactory"), With<IWoodstockProxyFactory>("woodstockDevLiveStewardFactory")).SingleInstance();

            builder.RegisterType<ApolloProxyFactory>().As<IApolloProxyFactory>().SingleInstance();
            builder.RegisterType<ApolloProxyBundle>().SingleInstance();

            builder.RegisterType<SunriseProxyFactory>().As<ISunriseProxyFactory>().SingleInstance();
            builder.RegisterType<SunriseProxyBundle>().SingleInstance();
        }
    }
}
