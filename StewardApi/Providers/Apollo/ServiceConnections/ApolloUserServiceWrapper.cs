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
using static Forza.WebServices.FM7.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <inheritdoc />
    public sealed class ApolloUserServiceWrapper : IApolloUserService
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
        ///      Initializes a new instance of the <see cref="ApolloUserServiceWrapper"/> class.
        /// </summary>
        public ApolloUserServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider)
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
        public async Task<LiveOpsGetUserDataByGamertagOutput> LiveOpsGetUserDataByGamertagAsync(string gamertag)
        {
            gamertag.ShouldNotBeNullEmptyOrWhiteSpace(nameof(gamertag));

            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            return await userService.LiveOpsGetUserDataByGamertag(gamertag).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<LiveOpsGetUserDataByXuidOutput> LiveOpsGetUserDataByXuidAsync(ulong xuid)
        {
            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            return await userService.LiveOpsGetUserDataByXuid(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<BanUsersOutput> BanUsersAsync(ForzaUserBanParameters[] banParameters)
        {
            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            return await userService.BanUsers(banParameters, banParameters.Length).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserBanHistoryOutput> GetUserBanHistoryAsync(ulong xuid, int startIndex, int maxResults)
        {
            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            return await userService.GetUserBanHistory(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserBanSummariesOutput> GetUserBanSummariesAsync(ulong[] xuids, int xuidCount)
        {
            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            return await userService.GetUserBanSummaries(xuids, xuidCount).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetConsolesOutput> GetConsolesAsync(ulong xuid, int maxResults)
        {
            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            return await userService.GetConsoles(xuid, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetConsoleBanStatusAsync(ulong consoleId, bool isBanned)
        {
            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            await userService.SetConsoleBanStatus(consoleId, isBanned).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetSharedConsoleUsersOutput> GetSharedConsoleUsersAsync(ulong xuid, int startIndex, int maxResults)
        {
            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            return await userService.GetSharedConsoleUsers(xuid, startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetIsUnderReviewOutput> GetIsUnderReviewAsync(ulong xuid)
        {
            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            return await userService.GetIsUnderReview(xuid).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetIsUnderReviewAsync(ulong xuid, bool isUnderReview)
        {
            var forzaClient = this.GetClient();
            var userService = this.GetUserService(forzaClient);

            await userService.SetIsUnderReview(xuid, isUnderReview).ConfigureAwait(false);
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

        private UserService GetUserService(Client forzaClient)
        {
            return new UserService(forzaClient, this.environmentUri, this.adminXuid, null, false);
        }
    }
}
