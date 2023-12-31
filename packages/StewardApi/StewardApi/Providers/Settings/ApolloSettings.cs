﻿using System;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;

namespace Turn10.LiveOps.StewardApi.Providers.Settings
{
    /// <summary>
    ///     Provides title specific settings for Apollo.
    /// </summary>
    public class ApolloSettings
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.ApolloClientVersion,
            ConfigurationKeyConstants.ApolloAdminXuid,
            ConfigurationKeyConstants.ApolloCertificateKeyVaultName,
        };

        /// <summary>
        ///     Initializes a new instance of the <see cref="ApolloSettings"/> class.
        /// </summary>
        public ApolloSettings(IConfiguration configuration)
        {
            // TODO: This shouldn't be a CTOR. It should be a static generator function. This allows us to use many different ways of sourcing these values.
            configuration.ShouldNotBeNull(nameof(configuration));
            configuration.ShouldContainSettings(RequiredSettings);

            this.ClientVersion = configuration[ConfigurationKeyConstants.ApolloClientVersion];
            this.AdminXuid = Convert.ToUInt64(
                configuration[ConfigurationKeyConstants.ApolloAdminXuid],
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
    }
}
