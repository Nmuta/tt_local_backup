﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Forza.UserInventory.FM7.Generated;
using Forza.WebServices.FM7.Generated;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using static Forza.WebServices.FM7.Generated.GiftingService;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <inheritdoc />
    public sealed class ApolloGiftingServiceWrapper : IApolloGiftingService
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
        ///      Initializes a new instance of the <see cref="ApolloGiftingServiceWrapper"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        /// <param name="keyVaultProvider">The key vault provider.</param>
        public ApolloGiftingServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider)
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
        public async Task<AdminGetSupportedGiftTypesOutput> AdminGetSupportedGiftTypesAsync(int maxResults)
        {
            var forzaClient = this.GetClient();
            var giftingService = this.GetGiftingService(forzaClient);

            return await giftingService.AdminGetSupportedGiftTypes(maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AdminSendItemGiftAsync(ulong recipientXuid, InventoryItemType itemType, int itemValue)
        {
            var forzaClient = this.GetClient();
            var giftingService = this.GetGiftingService(forzaClient);

            await giftingService.AdminSendItemGift(recipientXuid, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AdminSendItemGroupGiftAsync(int groupId, InventoryItemType itemType, int itemValue)
        {
            var forzaClient = this.GetClient();
            var giftingService = this.GetGiftingService(forzaClient);

            await giftingService.AdminSendItemGroupGift(groupId, itemType, itemValue).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetGiftsForUserOutput> GetGiftsForUserAsync(int startAt, int maxResults)
        {
            var forzaClient = this.GetClient();
            var giftingService = this.GetGiftingService(forzaClient);

            return await giftingService.GetGiftsForUser(startAt, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task MarkVanityItemGiftRetrievedAsync(int vanityItemGiftId)
        {
            var forzaClient = this.GetClient();
            var giftingService = this.GetGiftingService(forzaClient);

            await giftingService.MarkVanityItemGiftRetrieved(vanityItemGiftId).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<RetrieveCarGiftOutput> RetrieveCarGiftAsync(
                                                                      int giftId,
                                                                      uint liveryDetailsBufferSize,
                                                                      uint partsInstalledBufferSize,
                                                                      uint partsInTrunkBufferSize)
        {
            var forzaClient = this.GetClient();
            var giftingService = this.GetGiftingService(forzaClient);

            return await giftingService.RetrieveCarGift(giftId, liveryDetailsBufferSize, partsInstalledBufferSize, partsInTrunkBufferSize).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<RetrieveCreditsGiftOutput> RetrieveCreditsGiftAsync(int giftId)
        {
            var forzaClient = this.GetClient();
            var giftingService = this.GetGiftingService(forzaClient);

            return await giftingService.RetrieveCreditsGift(giftId).ConfigureAwait(false);
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

        private GiftingService GetGiftingService(Client forzaClient)
        {
            return new GiftingService(forzaClient, this.environmentUri, this.adminXuid, null, false);
        }
    }
}
