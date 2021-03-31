using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Common;
using Turn10.Services.ForzaClient;
using Turn10.Services.MessageEncryption;
using Xls.FM7.Generated;
using Xls.WebServices.FM7.Generated;
using static Xls.WebServices.FM7.Generated.UserService;

namespace Turn10.LiveOps.StewardApi.Providers.Apollo
{
    /// <inheritdoc />
    public sealed class ApolloGroupingServiceWrapper : IApolloGroupingService
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
        ///      Initializes a new instance of the <see cref="ApolloGroupingServiceWrapper"/> class.
        /// </summary>
        public ApolloGroupingServiceWrapper(IConfiguration configuration, IKeyVaultProvider keyVaultProvider)
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
        public async Task AcceptClubInvitesAsync(bool acceptingClubInvites)
        {
            var forzaClient = this.GetClient();
            var groupingService = this.GetGroupingService(forzaClient);

            await groupingService.AcceptClubInvites(acceptingClubInvites).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task AddToUserGroupsAsync(ulong xuid, int[] groupIds)
        {
            var forzaClient = this.GetClient();
            var groupingService = this.GetGroupingService(forzaClient);

            await groupingService.AddToUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserDataOutput> GetUserDataAsync()
        {
            var forzaClient = this.GetClient();
            var groupingService = this.GetGroupingService(forzaClient);

            return await groupingService.GetUserData().ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserDatasOutput> GetUserDatasAsync(ulong[] xuids, int numberOfUsers)
        {
            var forzaClient = this.GetClient();
            var groupingService = this.GetGroupingService(forzaClient);

            return await groupingService.GetUserDatas(xuids, numberOfUsers).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserGroupMembershipsOutput> GetUserGroupMembershipsAsync(ulong xuid, int[] groupIdFilter, int maxResults)
        {
            var forzaClient = this.GetClient();
            var groupingService = this.GetGroupingService(forzaClient);

            return await groupingService.GetUserGroupMemberships(xuid, groupIdFilter, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<GetUserGroupsOutput> GetUserGroupsAsync(int startIndex, int maxResults)
        {
            var forzaClient = this.GetClient();
            var groupingService = this.GetGroupingService(forzaClient);

            return await groupingService.GetUserGroups(startIndex, maxResults).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task RemoveFromUserGroupsAsync(ulong xuid, int[] groupIds)
        {
            var forzaClient = this.GetClient();
            var groupingService = this.GetGroupingService(forzaClient);

            await groupingService.RemoveFromUserGroups(xuid, groupIds).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task ReportPiracyCheckStateAsync(PiracyCheckState piracyCheckState)
        {
            var forzaClient = this.GetClient();
            var groupingService = this.GetGroupingService(forzaClient);

            await groupingService.ReportPiracyCheckState(piracyCheckState).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task<ReportPiracyCheckStateExOutput> ReportPiracyCheckStateExAsync(
                                                                                   PiracyCheckState piracyCheckState,
                                                                                   uint dwFailedReads,
                                                                                   uint dwFailedHashes,
                                                                                   uint dwBlocksChecked,
                                                                                   uint dwTotalBlocks,
                                                                                   bool fComplete)
        {
            var forzaClient = this.GetClient();
            var groupingService = this.GetGroupingService(forzaClient);

            return await groupingService.ReportPiracyCheckStateEx(piracyCheckState, dwFailedReads, dwFailedHashes, dwBlocksChecked, dwTotalBlocks, fComplete).ConfigureAwait(false);
        }

        /// <inheritdoc/>
        public async Task SetFriendsAsync(ulong[] friendXuids)
        {
            var forzaClient = this.GetClient();
            var groupingService = this.GetGroupingService(forzaClient);

            await groupingService.SetFriends(friendXuids).ConfigureAwait(false);
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

        private UserService GetGroupingService(Client forzaClient)
        {
            return new UserService(forzaClient, this.environmentUri, this.adminXuid, null, false);
        }
    }
}
