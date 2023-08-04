using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.IO;

namespace Turn10.LiveOps.StewardApi
{
    /// <summary>
    ///     Primary entry point for application.
    /// </summary>
    public sealed class Program
    {
        /// <summary>
        ///     The required main method.
        /// </summary>
        public static void Main(string[] arguments)
        {
            CreateHostBuilder<Startup>(arguments).Build().Run();
        }

        /// <summary>
        ///     Creates an instance of <see cref="IHostBuilder"/>.
        /// </summary>
        public static IHostBuilder CreateHostBuilder<T>(string[] arguments) where T : class
            => Host.CreateDefaultBuilder(arguments)
            .UseServiceProviderFactory(new AutofacServiceProviderFactory())
            .ConfigureWebHostDefaults(webHostBuilder =>
            {
                webHostBuilder
                  .UseContentRoot(Directory.GetCurrentDirectory())
                  .UseIISIntegration()
                  .UseStartup<T>();
            });
    }
}
