using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Globalization;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Provides title specific settings for Woodstock.
    /// </summary>
    public class WoodstockSettings
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.WoodstockClientVersion,
            ConfigurationKeyConstants.WoodstockAdminXuid,
            ConfigurationKeyConstants.WoodstockSandbox,
            ConfigurationKeyConstants.WoodstockTitleId
        };

        /// <summary>
        ///     Initializes a new instance of the <see cref="WoodstockSettings"/> class.
        /// </summary>
        public WoodstockSettings(IConfiguration configuration)
        {
            // TODO: This shouldn't be a CTOR. It should be a static generator function. This allows us to use many different ways of sourcing these values.
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);

            this.ClientVersion = configuration[ConfigurationKeyConstants.WoodstockClientVersion];
            this.AdminXuid = Convert.ToUInt64(
                configuration[ConfigurationKeyConstants.WoodstockAdminXuid],
                CultureInfo.InvariantCulture);
            this.Sandbox = configuration[ConfigurationKeyConstants.WoodstockSandbox];
            this.TitleId = Convert.ToUInt32(
                configuration[ConfigurationKeyConstants.WoodstockTitleId],
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
