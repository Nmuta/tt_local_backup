using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Forza.WebServices.FM7.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <inheritdoc />
    public sealed class ApolloUserInventoryServiceWrapper : IApolloUserInventoryService
    {
        private static readonly IList<string> RequiredSettings = new List<string>
        {
            ConfigurationKeyConstants.ApolloUri,
            ConfigurationKeyConstants.ApolloClientVersion,
            ConfigurationKeyConstants.ApolloAdminXuid,
            ConfigurationKeyConstants.ApolloCertificateKeyVaultName,
            ConfigurationKeyConstants.ApolloCertificateSecretName
        };

        private readonly string environmentUri;
        private readonly X509Certificate2 lspCertificate;
        private readonly string clientVersion;
        private readonly ulong adminXuid;

        /// <summary>
        ///       Initializes a new instance of the <see cref="ApolloUserInventoryServiceWrapper"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        public ApolloUserInventoryServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider)
        {
            configuration.ShouldNotBeNull(nameof(configuration));
            keyVaultProvider.ShouldNotBeNull(nameof(keyVaultProvider));
            configuration.ShouldContainSettings(RequiredSettings);

            this.environmentUri = configuration[ConfigurationKeyConstants.ApolloUri];
            this.clientVersion = configuration[ConfigurationKeyConstants.ApolloClientVersion];
            this.adminXuid = Convert.ToUInt64(configuration[ConfigurationKeyConstants.ApolloAdminXuid], CultureInfo.InvariantCulture);
            var keyVaultName = configuration[ConfigurationKeyConstants.ApolloCertificateKeyVaultName];
            var secretName = configuration[ConfigurationKeyConstants.ApolloCertificateSecretName];

            var certificateSecret = keyVaultProvider.GetSecretAsync(keyVaultName, secretName).GetAwaiter().GetResult();
            this.lspCertificate = this.ConvertToCertificate(certificateSecret);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryService.GetAdminUserInventoryOutput> GetAdminUserInventoryAsync(ulong xuid)
        {
            var forzaClient = this.GetClient();
            var userInventoryService = this.GetUserInventoryService(forzaClient);

            return await userInventoryService.GetAdminUserInventory(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryService.GetAdminUserInventoryByProfileIdOutput> GetAdminUserInventoryByProfileIdAsync(int profileId)
        {
            var forzaClient = this.GetClient();
            var userInventoryService = this.GetUserInventoryService(forzaClient);

            return await userInventoryService.GetAdminUserInventoryByProfileId(profileId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryService.GetAdminUserProfilesOutput> GetAdminUserProfilesAsync(ulong xuid, uint maxProfiles)
        {
            var forzaClient = this.GetClient();
            var userInventoryService = this.GetUserInventoryService(forzaClient);

            return await userInventoryService.GetAdminUserProfiles(xuid, maxProfiles).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<UserInventoryService.SyncUserInventoryOutput> SyncUserInventoryAsync(ForzaUserInventorySummary clientInventory)
        {
            clientInventory.ShouldNotBeNull(nameof(clientInventory));

            var forzaClient = this.GetClient();
            var userInventoryService = this.GetUserInventoryService(forzaClient);

            return await userInventoryService.SyncUserInventory(clientInventory).ConfigureAwait(false);
        }

        private X509Certificate2 ConvertToCertificate(string certificateSecret)
        {
            certificateSecret.ShouldNotBeNullEmptyOrWhiteSpace(nameof(certificateSecret));

            var privateKeyBytes = Convert.FromBase64String(certificateSecret);
            privateKeyBytes.ShouldNotBeNull(nameof(privateKeyBytes));

            return new X509Certificate2(privateKeyBytes);
        }

        private Client GetClient()
        {
            return new Client(new CleartextMessageCryptoProvider(), new CleartextMessageCryptoProvider(), this.lspCertificate, false, clientVersion: this.clientVersion);
        }

        private UserInventoryService GetUserInventoryService(Client forzaClient)
        {
            return new UserInventoryService(forzaClient, this.environmentUri, this.adminXuid, null, false);
        }
    }
}
