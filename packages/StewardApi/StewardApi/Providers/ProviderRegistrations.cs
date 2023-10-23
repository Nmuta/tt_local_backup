using Autofac;
using Turn10.LiveOps.StewardApi.Providers.Settings;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Registers title specific settings and forged credentials.
    /// </summary>
    public static class ProviderRegistrations
    {
        internal static void Register(ContainerBuilder builder)
        {
            builder.RegisterType<SteelheadSettings>().SingleInstance();
            builder.RegisterType<WoodstockSettings>().SingleInstance();
            builder.RegisterType<SunriseSettings>().SingleInstance();
            builder.RegisterType<ApolloSettings>().SingleInstance();

            builder.RegisterType<ForgedCredentialProvider>()
                .AsImplementedInterfaces()
                .AsSelf()
                .SingleInstance();
        }
    }
}
