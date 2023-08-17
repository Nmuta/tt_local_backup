using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardTest.Utilities;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Opus
{
    [TestClass]
    [Ignore]
    public sealed class OpusIntegrationTests
    {
        private static string endpoint;
        private static string authKey;
        private static ulong xuid;
        private static string gamertag;
        private static int profileId;
        private static KeyVaultProvider KeyVaultProvider;
        private static OpusStewardTestingClient stewardClient;
        private static OpusStewardTestingClient unauthorizedClient;

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

            xuid = 2533274829776695;
            gamertag = "Baron Zamedi";
            profileId = 11445748;

            stewardClient = new OpusStewardTestingClient(new Uri(endpoint), authKey);
            unauthorizedClient = new OpusStewardTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerIdentityByXuid()
        {
            var query = new IdentityQueryAlpha { Xuid = xuid };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(xuid, result[0].Xuid);
            Assert.IsNull(result[0].Error);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerIdentityByXuid_InvalidXuid()
        {
            var query = new IdentityQueryAlpha { Xuid = TestConstants.InvalidXuid };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result[0].Error);
            Assert.IsTrue(result[0].Xuid == default);
            Assert.IsTrue(string.IsNullOrWhiteSpace(result[0].Gamertag));
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerIdentityByXuid_XuidBelow100()
        {
            var query = new IdentityQueryAlpha { Xuid = TestConstants.InvalidXuidBelow100 };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result[0].Error);
            Assert.IsTrue(result[0].Xuid == default);
            Assert.AreEqual(result[0].Query.Xuid, TestConstants.InvalidXuidBelow100);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerIdentityByGamertag()
        {
            var query = new IdentityQueryAlpha { Gamertag = gamertag };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(xuid, result[0].Xuid);
            Assert.IsNull(result[0].Error);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerIdentityByGamertag_InvalidGamertag()
        {
            var query = new IdentityQueryAlpha { Gamertag = TestConstants.InvalidGamertag };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result[0].Error);
            Assert.IsTrue(result[0].Xuid == default);
            Assert.IsTrue(string.IsNullOrWhiteSpace(result[0].Gamertag));
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerDetailsByGamertag()
        {
            var result = await stewardClient.GetPlayerDetailsAsync(gamertag).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(xuid, result.Xuid);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerDetailsByGamertag_InvalidGamertag()
        {
            try
            {
                await stewardClient.GetPlayerDetailsAsync(TestConstants.InvalidGamertag).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerDetailsByGamertag_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetPlayerDetailsAsync(gamertag).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerDetailsByXuid()
        {
            var result = await stewardClient.GetPlayerDetailsAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(gamertag, result.Gamertag);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerDetailsByXuid_InvalidXuid()
        {
            try
            {
                await stewardClient.GetPlayerDetailsAsync(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerDetailsByXuid_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetPlayerDetailsAsync(xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventoryByXuid()
        {
            var result = await stewardClient.GetPlayerInventoryAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Cars.Any());
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventoryByXuid_InvalidXuid()
        {
            try
            {
                await stewardClient.GetPlayerInventoryAsync(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventoryByXuid_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetPlayerInventoryAsync(xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventoryByProfileId()
        {
            var result = await stewardClient.GetPlayerInventoryAsync(profileId).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Cars.Any());
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventoryByProfileId_InvalidProfileId()
        {
            try
            {
                await stewardClient.GetPlayerInventoryAsync(TestConstants.InvalidProfileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventoryByProfileId_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetPlayerInventoryAsync(profileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetInventoryProfilesByXuid()
        {
            var result = await stewardClient.GetInventoryProfilesAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(profileId, result[0].ProfileId);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetInventoryProfilesByXuid_InvalidXuid()
        {
            var result = await stewardClient.GetInventoryProfilesAsync(TestConstants.InvalidXuid).ConfigureAwait(false);

            Assert.IsFalse(result.Any());
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetInventoryProfilesByXuid_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetInventoryProfilesAsync(xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }
    }
}
