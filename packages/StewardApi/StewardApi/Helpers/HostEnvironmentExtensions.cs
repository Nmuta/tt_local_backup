using Microsoft.Extensions.Hosting;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Extensions for <see cref="IHostEnvironment"/>.
    /// </summary>
    public static class HostEnvironmentExtensions
    {
        /// <summary>
        ///     True if the given environment is a local environment.
        /// </summary>
        public static bool IsStewardApiLocal(this IHostEnvironment environment)
        {
            return environment.IsEnvironment("local");
        }

        /// <summary>
        ///     True if the given environment is a development environment.
        /// </summary>
        public static bool IsStewardApiDevelopment(this IHostEnvironment environment)
        {
            return environment.IsDevelopment() || environment.IsEnvironment("dev") || environment.IsEnvironment("local");
        }


        /// <summary>
        ///     True if the given environment is a prod environment.
        /// </summary>
        public static bool IsStewardApiProduction(this IHostEnvironment environment)
        {
            return environment.IsProduction() || environment.IsEnvironment("prod");
        }
    }
}
