using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

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
            CreateHostBuilder(arguments).Build().Run();
        }

        /// <summary>
        ///     Creates an instance of <see cref="IHostBuilder"/>.
        /// </summary>
        public static IHostBuilder CreateHostBuilder(string[] arguments) =>
            Host.CreateDefaultBuilder(arguments)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
