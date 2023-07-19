using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.Services.CMSRetrieval;
using Turn10.Services.Diagnostics;
using Turn10.Services.Storage.Blob;

namespace Turn10.LiveOps.StewardApi.Providers.Data
{
    /// <summary>
    ///     Exposes CMSRetrievalHelpers for each available title.
    /// </summary>
    public sealed class PegasusCmsProvider
    {
        /// <summary>
        ///     Initializes a new instance of the <see cref="PegasusCmsProvider"/> class.
        /// </summary>
        public PegasusCmsProvider()
        {
            this.Helpers = new Dictionary<string, CMSRetrievalHelper>(StringComparer.OrdinalIgnoreCase);
        }

        /// <summary>
        ///     Gets the Pegasus CMS retrieval instance helpers.
        /// </summary>
        public Dictionary<string, CMSRetrievalHelper> Helpers { get; }

        /// <summary>
        ///     Sets up Pegasus CMS provider.
        /// </summary>
        public static PegasusCmsProvider SetupPegasusCmsProvider(IConfiguration configuration, KeyVaultProvider keyVaultProvider)
        {
            var environmentsCsv = configuration[ConfigurationKeyConstants.PegasusCmsEnvironments];
            var titles = configuration[ConfigurationKeyConstants.PegasusCmsTitles];
            var environments = environmentsCsv.Split(',');
            var titlesArray = titles.Split(',');
            var pegasusCmsProvider = new PegasusCmsProvider();

            foreach (var title in titlesArray)
            {
                var cmsBlobProviders = new Dictionary<string, IAzureBlobProvider>();
                foreach (var environment in environments)
                {
                    var pegasusSecret = keyVaultProvider.GetSecretAsync(
                        configuration[ConfigurationKeyConstants.KeyVaultUrl],
                        $"pegasus-sas-{environment}").GetAwaiter().GetResult();
                    var cmsAzureBlobProvider =
                        new AzureBlobProvider(pegasusSecret, new MetricsManager(null));
                    cmsBlobProviders.Add(environment, cmsAzureBlobProvider);
                }

                var defaultTitleEnvironment = configuration[$"PegasusCms:{title}Default"];
                var defaultCmsInstance = new CMSInstance { Environment = defaultTitleEnvironment };
                var cmsRetrievalHelper =
                    new CMSRetrievalHelper(title, cmsBlobProviders, defaultCMSInstance: defaultCmsInstance);
                pegasusCmsProvider.Helpers.Add(title, cmsRetrievalHelper);
            }

            return pegasusCmsProvider;
        }
    }
}
