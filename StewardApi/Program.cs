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
        /// <param name="arguments">The arguments.</param>
        public static void Main(string[] arguments)
        {
            CreateHostBuilder(arguments).Build().Run();
        }

        /// <summary>
        ///     Creates an instance of <see cref="IHostBuilder"/>.
        /// </summary>
        /// <param name="arguments">The arguments.</param>
        /// <returns>A new instance of <see cref="IHostBuilder"/>.</returns>
        public static IHostBuilder CreateHostBuilder(string[] arguments) =>
            Host.CreateDefaultBuilder(arguments)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
