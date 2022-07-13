using System;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Provides title specific settings for Sunrise.
    /// </summary>
    public class SunriseSettings
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.SunriseClientVersion,
            ConfigurationKeyConstants.SunriseAdminXuid,
            ConfigurationKeyConstants.SunriseSandbox,
            ConfigurationKeyConstants.SunriseTitleId
        };

        /// <summary>
        ///     Initializes a new instance of the <see cref="SunriseSettings"/> class.
        /// </summary>
        public SunriseSettings(IConfiguration configuration)
        {
            // TODO: This shouldn't be a CTOR. It should be a static generator function. This allows us to use many different ways of sourcing these values.
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);

            this.ClientVersion = configuration[ConfigurationKeyConstants.SunriseClientVersion];
            this.AdminXuid = Convert.ToUInt64(
                configuration[ConfigurationKeyConstants.SunriseAdminXuid],
                CultureInfo.InvariantCulture);
            this.Sandbox = configuration[ConfigurationKeyConstants.SunriseSandbox];
            this.TitleId = Convert.ToUInt32(
                configuration[ConfigurationKeyConstants.SunriseTitleId],
                CultureInfo.InvariantCulture);
        }

        /// <summary>
        ///     Gets the client version.
        /// </summary>
        public string ClientVersion { get; }

        /// <summary>
        ///     Gets the admin xuid.
        /// </summary>
        public ulong AdminXuid { get; }

        /// <summary>
        ///     Gets the sandbox.
        /// </summary>
        public string Sandbox { get; }

        /// <summary>
        ///     Gets the title ID.
        /// </summary>
        public uint TitleId { get; }
    }
}
