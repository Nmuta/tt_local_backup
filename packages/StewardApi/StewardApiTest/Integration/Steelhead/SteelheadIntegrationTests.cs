using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardTest.Utilities;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class SteelheadIntegrationTests
    {
        private static string endpoint;
        private static string authKey;
        private static ulong xuid;
        private static ulong consoleId;
        private static string gamertag;
        private static int profileId;
        private static int lspGroupId;
        private static Guid liveryUgcId;
        private static KeyVaultProvider KeyVaultProvider;
        private static SteelheadStewardTestingClient stewardClient;
        private static SteelheadStewardTestingClient unauthorizedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            KeyVaultProvider = new KeyVaultProvider(new KeyVaultClientFactory());

            TestUtilities.DisableSSLValidation();
            endpoint = testContext.Properties["EndPoint"].ToString();

            var clientId = testContext.Properties["ClientId"].ToString();
            var clientSecret = testContext.Properties["ClientSecret"].ToString();
            if (string.IsNullOrWhiteSpace(clientSecret))
            {
                var keyVaultName = testContext.Properties["KeyVaultName"].ToString();
                var clientSecretName = testContext.Properties["ClientSecretName"].ToString();
                clientSecret = await KeyVaultProvider.GetSecretAsync(keyVaultName, clientSecretName);
            }

            authKey = await TestUtilities.MintAuthorizationToken(clientId, clientSecret).ConfigureAwait(false);

            xuid = 1234;

            stewardClient = new SteelheadStewardTestingClient(new Uri(endpoint), authKey);
            unauthorizedClient = new SteelheadStewardTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task VerifyServiceProxies()
        {
            var query = new IdentityQueryAlpha { Xuid = xuid };

            try
            {
                await stewardClient.TestServiceProxies().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }
    }
}
