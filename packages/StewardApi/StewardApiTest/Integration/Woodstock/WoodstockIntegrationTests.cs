using Castle.Core.Internal;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardTest.Utilities;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock
{
    [TestClass]
    public sealed class WoodstockIntegrationTests
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
        private static WoodstockStewardTestingClient stewardClient;
        private static WoodstockStewardTestingClient unauthorizedClient;

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

            xuid = 2535424453525895;
            gamertag = "FreeStuff022616";
            profileId = 1048;
            consoleId = 18230640064596068933;
            lspGroupId = 12;
            liveryUgcId = new Guid("e045bf5a-2496-46cf-94da-b0ecca1f1c79");

            stewardClient = new WoodstockStewardTestingClient(new Uri(endpoint), authKey);
            unauthorizedClient = new WoodstockStewardTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityByXuid()
        {
            var query = new IdentityQueryAlpha { Xuid = xuid };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(xuid, result[0].Xuid);
            Assert.IsNull(result[0].Error);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityByXuid_InvalidXuid()
        {
            var query = new IdentityQueryAlpha { Xuid = TestConstants.InvalidXuid };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result[0].Error);
            Assert.IsTrue(result[0].Xuid == default);
            Assert.AreEqual(result[0].Query.Xuid, TestConstants.InvalidXuid);
            Assert.IsTrue(string.IsNullOrWhiteSpace(result[0].Gamertag));
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityByXuid_XuidBelow100()
        {
            var query = new IdentityQueryAlpha { Xuid = TestConstants.InvalidXuidBelow100 };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result[0].Error);
            Assert.IsTrue(result[0].Xuid == TestConstants.InvalidXuidBelow100);
            Assert.AreEqual(result[0].Query.Xuid, TestConstants.InvalidXuidBelow100);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityByGamertag()
        {
            var query = new IdentityQueryAlpha { Gamertag = gamertag };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(xuid, result[0].Xuid);
            Assert.IsNull(result[0].Error);
        }

        [TestMethod]
        [TestCategory("Integration")]
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
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityNullXuidAndGamertag()
        {
            var query = new IdentityQueryAlpha { Gamertag = null, Xuid = null };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryAlpha> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result[0].Error);
            Assert.IsTrue(result[0].Xuid == default);
            Assert.IsTrue(string.IsNullOrWhiteSpace(result[0].Gamertag));
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerDetailsByGamertag()
        {
            var result = await stewardClient.GetPlayerDetailsAsync(gamertag).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(xuid, result.Xuid);
        }

        [TestMethod]
        [TestCategory("Integration")]
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
        [TestCategory("Integration")]
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
        [TestCategory("Integration")]
        public async Task GetPlayerDetailsByXuid()
        {
            var result = await stewardClient.GetPlayerDetailsAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(gamertag, result.Gamertag);
        }

        [TestMethod]
        [TestCategory("Integration")]
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
        [TestCategory("Integration")]
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
        [TestCategory("Integration")]
        public async Task GetConsoles()
        {
            var result = await stewardClient.GetConsolesAsync(xuid, TestConstants.DefaultMaxResults).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetConsoles_InvalidXuid()
        {
            try
            {
                await stewardClient.GetConsolesAsync(TestConstants.InvalidXuid, TestConstants.DefaultMaxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetConsoles_NegativeMaxResults()
        {
            try
            {
                await stewardClient.GetConsolesAsync(xuid, TestConstants.NegativeValue).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetConsoles_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetConsolesAsync(xuid, TestConstants.DefaultMaxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetSharedConsoleUsers()
        {
            var result = await stewardClient.GetSharedConsoleUsersAsync(xuid, TestConstants.DefaultStartIndex, TestConstants.DefaultMaxResults).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetSharedConsoleUsers_InvalidXuid()
        {
            try
            {
                await stewardClient.GetSharedConsoleUsersAsync(TestConstants.InvalidXuid, TestConstants.DefaultStartIndex, TestConstants.DefaultMaxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetSharedConsoleUsers_NegativeStartIndex()
        {
            try
            {
                await stewardClient.GetSharedConsoleUsersAsync(xuid, TestConstants.NegativeValue, TestConstants.DefaultMaxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetSharedConsoleUsers_NegativeMaxResults()
        {
            try
            {
                await stewardClient.GetSharedConsoleUsersAsync(xuid, TestConstants.DefaultStartIndex, TestConstants.NegativeValue).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetSharedConsoleUsers_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetSharedConsoleUsersAsync(xuid, TestConstants.DefaultStartIndex, TestConstants.DefaultMaxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetUserFlags()
        {
            var result = await stewardClient.GetUserFlagsAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetUserFlags_InvalidXuid()
        {
            try
            {
                await stewardClient.GetUserFlagsAsync(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetUserFlags_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetUserFlagsAsync(xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SetUserFlags()
        {
            var userFlags = this.CreateUserFlags();
            var result = await stewardClient.SetUserFlagsAsync(xuid, userFlags).ConfigureAwait(false);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SetUserFlags_InvalidXuid()
        {
            var userFlags = this.CreateUserFlags();

            try
            {
                await stewardClient.SetUserFlagsAsync(TestConstants.InvalidXuid, userFlags).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SetUserFlags_Unauthorized()
        {
            var userFlags = this.CreateUserFlags();

            try
            {
                await unauthorizedClient.SetUserFlagsAsync(xuid, userFlags).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SetUserFlags_InvalidFlags()
        {
            var userFlags = this.CreateUserFlags();
            userFlags.IsEarlyAccess = null;

            try
            {
                await stewardClient.SetUserFlagsAsync(TestConstants.InvalidXuid, userFlags).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        //TODO uncomment once this is resolved: https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/903920
        //[TestMethod]
        //[TestCategory("Integration")]
        //public async Task GetProfileSummary()
        //{
        //    var result = await stewardClient.GetProfileSummaryAsync(xuid).ConfigureAwait(false);

        //    Assert.IsNotNull(result);
        //}

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetProfileSummary_InvalidXuid()
        {
            try
            {
                await stewardClient.GetProfileSummaryAsync(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetProfileSummary_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetProfileSummaryAsync(xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetCreditUpdates()
        {
            var result = await stewardClient.GetCreditUpdatesAsync(xuid, TestConstants.DefaultStartIndex, TestConstants.DefaultMaxResults).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetCreditUpdates_InvalidXuid()
        {
            try
            {
                await stewardClient.GetCreditUpdatesAsync(TestConstants.InvalidXuid, TestConstants.DefaultStartIndex, TestConstants.DefaultMaxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetCreditUpdates_NegativeStartIndex()
        {
            try
            {
                await stewardClient.GetCreditUpdatesAsync(xuid, TestConstants.NegativeValue, TestConstants.DefaultMaxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetCreditUpdates_NegativeMaxResults()
        {
            try
            {
                await stewardClient.GetCreditUpdatesAsync(xuid, TestConstants.DefaultStartIndex, TestConstants.NegativeValue).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetCreditUpdates_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetCreditUpdatesAsync(xuid, TestConstants.DefaultStartIndex, TestConstants.DefaultMaxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task BanPlayers()
        {
            var banParameters = this.GenerateBanParameters();

            var result = await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
            Assert.IsNull(result[0].Error);
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task BanPlayers_InvalidXuid()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Xuid = TestConstants.InvalidXuid;

            var result = await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
            Assert.IsNotNull(result[0].Error);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_Unauthorized()
        {
            var banParameters = this.GenerateBanParameters();

            try
            {
                await unauthorizedClient.BanPlayersAsync(banParameters).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_NoXuidsProvided()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Xuid = default;

            try
            {
                await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task BanPlayers_UseBackgroundProcessing()
        {
            var banParameters = this.GenerateBanParameters();

            var result = await this.BanPlayersWithHeaderResponseAsync(stewardClient, banParameters, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsNull(result.ToList()[0].Error);
            Assert.IsFalse(string.IsNullOrWhiteSpace(result[0].BanDescription.FeatureArea));
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task BanPlayers_UseBackgroundProcessing_InvalidXuid()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Xuid = TestConstants.InvalidXuid;

            var result = await this.BanPlayersWithHeaderResponseAsync(stewardClient, banParameters, BackgroundJobStatus.CompletedWithErrors).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ToList()[0].Error);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanSummaries()
        {
            var result = await stewardClient.GetBanSummariesAsync(new List<ulong> { xuid }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanSummaries_NoXuids()
        {
            var result = await stewardClient.GetBanSummariesAsync(new List<ulong>()).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanSummaries_InvalidXuid()
        {
            var result = await stewardClient.GetBanSummariesAsync(new List<ulong> { TestConstants.InvalidXuid }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
            Assert.IsTrue(result[0].BannedAreas.Any());
            Assert.IsTrue(result[0].BannedAreas[0].IsNullOrEmpty());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanSummaries_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetBanSummariesAsync(new List<ulong> { xuid }).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanHistoryByXuid()
        {
            var result = await stewardClient.GetBanHistoryAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanHistoryByXuid_InvalidXuid()
        {
            var result = await stewardClient.GetBanHistoryAsync(TestConstants.InvalidXuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsFalse(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanHistoryByXuid_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetBanHistoryAsync(xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanHistoryByGamertag()
        {
            var result = await stewardClient.GetBanHistoryAsync(gamertag).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanHistoryByGamertag_InvalidGamertag()
        {
            try
            {
                await stewardClient.GetBanHistoryAsync(TestConstants.InvalidGamertag).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanHistoryByGamertag_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetBanHistoryAsync(gamertag).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SetConsoleBanStatus()
        {
            await stewardClient.SetConsoleBanStatusAsync(consoleId, false).ConfigureAwait(false);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SetConsoleBanStatus_InvalidConsoleId()
        {
            try
            {
                await stewardClient.SetConsoleBanStatusAsync(TestConstants.InvalidXuid, false).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SetConsoleBanStatus_Unauthorized()
        {
            try
            {
                await unauthorizedClient.SetConsoleBanStatusAsync(consoleId, false).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetInventoryProfiles()
        {
            var result = await stewardClient.GetInventoryProfilesAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetInventoryProfiles_InvalidXuid()
        {
            try
            {
                await stewardClient.GetInventoryProfilesAsync(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetInventoryProfiles_Unauthorized()
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

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByXuid()
        {
            var result = await stewardClient.GetPlayerInventoryAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);

        }

        [TestMethod]
        [TestCategory("Integration")]
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
        [TestCategory("Integration")]
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
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByProfileId()
        {
            var result = await stewardClient.GetPlayerInventoryAsync(profileId).ConfigureAwait(false);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        [TestCategory("Integration")]
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
        [TestCategory("Integration")]
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
        [TestCategory("Integration")]
        public async Task GetGroups()
        {
            var result = await stewardClient.GetGroupsAsync().ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGroups_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetGroupsAsync().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task UpdatePlayerInventories()
        {
            var groupGift = this.CreateGroupGift();

            var result = await stewardClient.UpdatePlayerInventoriesAsync(groupGift).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result[0].Errors?.Count == 0);
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task UpdatePlayerInventories_InvalidXuid()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.Xuids = new List<ulong> { TestConstants.InvalidXuid };

            try
            {
                await stewardClient.UpdatePlayerInventoriesAsync(groupGift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task UpdatePlayerInventories_UseBackgroundProcessing()
        {
            var groupGift = this.CreateGroupGift();

            var result = await this.UpdatePlayerInventoriesWithHeaderResponseAsync(stewardClient, groupGift, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result[0].Errors?.Count == 0);
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task UpdateGroupInventoriesByLspGroupId()
        {
            var gift = this.CreateGift();

            await stewardClient.GiftInventoryByLspGroupId(lspGroupId, gift).ConfigureAwait(false);
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task GetGiftHistory()
        {
            var playerGift = this.CreateGroupGift();
            playerGift.Xuids = new List<ulong> { playerGift.Xuids.FirstOrDefault() };

            await stewardClient.UpdatePlayerInventoriesAsync(playerGift).ConfigureAwait(false);

            var result = await stewardClient.GetGiftHistoriesAsync(xuid).ConfigureAwait(false);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task GetGiftHistoryForGroupGift()
        {
            var groupGift = this.CreateGroupGift();

            await stewardClient.UpdatePlayerInventoriesAsync(groupGift).ConfigureAwait(false);

            var result = await stewardClient.GetGiftHistoriesAsync(xuid).ConfigureAwait(false);

            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task GetGiftHistoryForLspGroupGift()
        {
            var gift = this.CreateGift();

            await stewardClient.GiftInventoryByLspGroupId(lspGroupId, gift).ConfigureAwait(false);

            var result = await stewardClient.GetGiftHistoriesAsync(lspGroupId).ConfigureAwait(false);

            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGiftHistory_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetGiftHistoriesAsync(xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGiftHistory_InvalidGiftRecipientId()
        {
            var result = await stewardClient.GetGiftHistoriesAsync(TestConstants.InvalidXuid).ConfigureAwait(false);

            Assert.IsFalse(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetNotifications()
        {
            var result = await stewardClient.GetNotificationsAsync(xuid, TestConstants.DefaultMaxResults).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetNotifications_InvalidXuid()
        {
            try
            {
                await stewardClient.GetNotificationsAsync(TestConstants.InvalidXuid, TestConstants.DefaultMaxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetNotifications_NegativeMaxResults()
        {
            try
            {
                await stewardClient.GetNotificationsAsync(xuid, TestConstants.NegativeValue).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetNotifications_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetNotificationsAsync(xuid, TestConstants.DefaultMaxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task SendNotifications()
        {
            var message = new BulkCommunityMessage
            {
                Xuids = new List<ulong> { xuid },
                Message = "Integration Test Message",
                StartTimeUtc = DateTime.UtcNow.AddMinutes(1),
                ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5),
            };
            var result = await stewardClient.SendNotificationsAsync(message).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
            Assert.IsNull(result[0].Error);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendNotificationsInvalidXuid()
        {
            var message = new BulkCommunityMessage
            {
                Xuids = new List<ulong> { TestConstants.InvalidXuid },
                Message = "Integration Test Message",
                StartTimeUtc = DateTime.UtcNow.AddMinutes(1),
                ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5),
            };

            try
            {
                await stewardClient.SendNotificationsAsync(message).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendNotificationsMessageTooLong()
        {
            var message = new BulkCommunityMessage
            {
                Xuids = new List<ulong> { xuid },
                Message = new string('*', 520),
                StartTimeUtc = DateTime.UtcNow.AddMinutes(1),
                ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5),
            };

            try
            {
                await stewardClient.SendNotificationsAsync(message).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendNotificationsMessageExpirationBeforeSend()
        {
            var message = new BulkCommunityMessage
            {
                Xuids = new List<ulong> { xuid },
                Message = "Integration Test Message",
                StartTimeUtc = DateTime.UtcNow.AddMinutes(5),
                ExpireTimeUtc = DateTime.UtcNow.AddMinutes(1),
            };

            try
            {
                await stewardClient.SendNotificationsAsync(message).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendNotificationsUnauthorized()
        {
            var message = new BulkCommunityMessage
            {
                Xuids = new List<ulong> { xuid },
                Message = "Integration Test Message",
                StartTimeUtc = DateTime.UtcNow.AddMinutes(1),
                ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5),
            };

            try
            {
                await unauthorizedClient.SendNotificationsAsync(message).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task SendGroupNotifications()
        {
            var message = new LspGroupCommunityMessage
            {
                Message = "Integration Test Message",
                StartTimeUtc = DateTime.UtcNow.AddMinutes(1),
                ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5),
                DeviceType = DeviceType.All,
            };

            await stewardClient.SendGroupNotificationsAsync(lspGroupId, message).ConfigureAwait(false);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendGroupNotificationsUnauthorized()
        {
            var message = new LspGroupCommunityMessage
            {
                Message = "Integration Test Message",
                StartTimeUtc = DateTime.UtcNow.AddMinutes(1),
                ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5),
                DeviceType = DeviceType.All,
            };

            try
            {
                await unauthorizedClient.SendGroupNotificationsAsync(lspGroupId, message).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendGroupNotificationsMessageTooLong()
        {
            var message = new LspGroupCommunityMessage
            {
                Message = new string('*', 520),
                StartTimeUtc = DateTime.UtcNow.AddMinutes(1),
                ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5),
                DeviceType = DeviceType.All,
            };

            try
            {
                await stewardClient.SendGroupNotificationsAsync(lspGroupId, message).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendGroupNotificationsExpirationBeforeSend()
        {
            var message = new LspGroupCommunityMessage
            {
                Message = "Integration Test Message",
                StartTimeUtc = DateTime.UtcNow.AddMinutes(5),
                ExpireTimeUtc = DateTime.UtcNow.AddMinutes(1),
                DeviceType = DeviceType.All,
            };

            try
            {
                await stewardClient.SendGroupNotificationsAsync(lspGroupId, message).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendGroupNotificationsInvalidGroupId()
        {
            var message = new LspGroupCommunityMessage
            {
                Message = new string('*', 520),
                StartTimeUtc = DateTime.UtcNow.AddMinutes(1),
                ExpireTimeUtc = DateTime.UtcNow.AddMinutes(5),
                DeviceType = DeviceType.All,
            };

            try
            {
                await stewardClient.SendGroupNotificationsAsync(TestConstants.InvalidProfileId, message).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetProfileNotes()
        {
            var result = await stewardClient.GetProfileNotesAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetProfileNotes_InvalidXuid()
        {
            try
            {
                await stewardClient.GetProfileNotesAsync(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendProfileNotes_InvalidXuid()
        {
            var message = new ProfileNote { Text = "Test Text", Author = "Integration Tests", DateUtc = DateTime.UtcNow };

            try
            {
                await stewardClient.SendProfileNotesAsync(TestConstants.InvalidXuid, message).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerAuctions()
        {
            var result = await stewardClient.GetPlayerAuctionsAsync(xuid, short.MaxValue, short.MaxValue, "Any", "ClosingDateDescending").ConfigureAwait(false);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetAuctionBlockList()
        {
            var result = await stewardClient.GetAuctionBlockListAsync().ConfigureAwait(false);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task AddAndRemoveAuctionBlockListEntry()
        {
            var newEntry = new AuctionBlockListEntry
            { CarId = 1301, ExpireDateUtc = DateTime.UtcNow.AddDays(1), DoesExpire = true, Description = "" };

            var beforeResult = await stewardClient.GetAuctionBlockListAsync().ConfigureAwait(false);
            Assert.IsFalse(beforeResult.Any(entry => entry.CarId == 1301));

            await stewardClient.PostAuctionBlockListEntriesAsync(new List<AuctionBlockListEntry> { newEntry }).ConfigureAwait(false);
            var duringResult = await stewardClient.GetAuctionBlockListAsync().ConfigureAwait(false);
            Assert.IsTrue(duringResult.Any(entry => entry.CarId == 1301));

            await stewardClient.DeleteAuctionBlockListEntryAsync(1301).ConfigureAwait(false);
            var afterResult = await stewardClient.GetAuctionBlockListAsync().ConfigureAwait(false);
            Assert.IsFalse(afterResult.Any(entry => entry.CarId == 1301));
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task HideAndUnhideUGC()
        {
            await stewardClient.HideUGCAsync(liveryUgcId, false);
            var unhiddenResult2 = await stewardClient.GetUGCItemsAsync(xuid, UgcType.Livery.ToString()).ConfigureAwait(false);
            var hiddenResult2 = await stewardClient.GetPlayerHiddenUGCAsync(xuid, UgcType.Livery.ToString()).ConfigureAwait(false);
            Assert.IsTrue(hiddenResult2.Where(item => item.Id == liveryUgcId).ToList().Count > 0);
            Assert.IsTrue(unhiddenResult2.Where(item => item.Id == liveryUgcId).ToList().Count == 0);

            await stewardClient.UnhideUGCAsync(liveryUgcId, false);
            var unhiddenResult1 = await stewardClient.GetUGCItemsAsync(xuid, UgcType.Livery.ToString()).ConfigureAwait(false);
            var hiddenResult1 = await stewardClient.GetPlayerHiddenUGCAsync(xuid, UgcType.Livery.ToString()).ConfigureAwait(false);
            Assert.IsTrue(unhiddenResult1.Where(item => item.Id == liveryUgcId).ToList().Count > 0);
            Assert.IsTrue(hiddenResult1.Where(item => item.Id == liveryUgcId).ToList().Count == 0);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetUGCItems_InvalidFileType()
        {
            try
            {
                await stewardClient.GetUGCItemsAsync(xuid, "Blueberry").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        private async Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesWithHeaderResponseAsync(WoodstockStewardTestingClient stewardTestingClient, WoodstockGroupGift groupGift, BackgroundJobStatus expectedStatus)
        {
            var headersToValidate = new List<string> { "jobId" };

            var response = await stewardTestingClient.UpdatePlayerInventoriesWithHeaderResponseAsync(groupGift, headersToValidate).ConfigureAwait(false);

            var stopWatch = new Stopwatch();
            stopWatch.Start();

            bool jobCompleted;
            BackgroundJobStatus status;
            IList<GiftResponse<ulong>> jobResult;

            do
            {
                var backgroundJob = await stewardTestingClient.GetJobStatusAsync(response.Headers["jobId"])
                    .ConfigureAwait(false);

                status = backgroundJob.Status;

                jobCompleted = status == BackgroundJobStatus.Completed || status == BackgroundJobStatus.Failed || status == BackgroundJobStatus.CompletedWithErrors;

                jobResult = JsonConvert.DeserializeObject<IList<GiftResponse<ulong>>>(
                    JsonConvert.SerializeObject(backgroundJob.RawResult));

                if (stopWatch.ElapsedMilliseconds >= TestConstants.MaxLoopTimeInMilliseconds)
                {
                    break;
                }
            } while (!jobCompleted);

            Assert.AreEqual(expectedStatus, status);

            return jobResult;
        }

        private async Task<IList<BanResult>> BanPlayersWithHeaderResponseAsync(WoodstockStewardTestingClient stewardTestingClient, IList<V2BanParametersInput> banParameters, BackgroundJobStatus expectedStatus)
        {
            var headersToValidate = new List<string> { "jobId" };

            var response = await stewardTestingClient.BanPlayersWithHeaderResponseAsync(banParameters, headersToValidate).ConfigureAwait(false);

            var stopWatch = new Stopwatch();
            stopWatch.Start();

            bool jobCompleted;
            IList<BanResult> jobResults;
            BackgroundJobStatus status;

            do
            {
                var backgroundJob = await stewardTestingClient.GetJobStatusAsync(response.Headers["jobId"]).ConfigureAwait(false);

                status = backgroundJob.Status;

                jobCompleted = status == BackgroundJobStatus.Completed || status == BackgroundJobStatus.CompletedWithErrors || status == BackgroundJobStatus.Failed;

                jobResults = JsonConvert.DeserializeObject<IList<BanResult>>(
                    JsonConvert.SerializeObject(backgroundJob.RawResult));

                if (stopWatch.ElapsedMilliseconds >= TestConstants.MaxLoopTimeInMilliseconds)
                {
                    break;
                }
            } while (!jobCompleted);

            Assert.AreEqual(expectedStatus, status);

            return jobResults;
        }

        private IList<V2BanParametersInput> GenerateBanParameters()
        {
            return new List<V2BanParametersInput>
            {
                new V2BanParametersInput
                {
                    Xuid = xuid,
                    Reason = "Testing",
                    ReasonGroupName = "Developer",
                    DeleteLeaderboardEntries = false
                }
            };
        }

        private WoodstockMasterInventory CreateGiftInventory()
        {
            var giftInventory = new WoodstockMasterInventory
            {
                CreditRewards =
                    new List<MasterInventoryItem>
                    {
                        new MasterInventoryItem {Id = -1, Description = "Credits", Quantity = 1},
                    },
                Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 422, Quantity = 1 } },
                CarHorns = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 10, Quantity = 1 } },
                VanityItems = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 191, Quantity = 1 } },
                Emotes = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 38, Quantity = 1 } },
                QuickChatLines = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 188, Quantity = 1 } }
            };

            return giftInventory;
        }

        private WoodstockGroupGift CreateGroupGift()
        {
            return new WoodstockGroupGift
            {
                Xuids = new List<ulong>
                {
                    xuid
                },
                GiftReason = "Integration Test",
                Inventory = this.CreateGiftInventory()
            };
        }

        private WoodstockGift CreateGift()
        {
            return new WoodstockGift
            {
                GiftReason = "Integration Test",
                Inventory = this.CreateGiftInventory()
            };
        }

        private WoodstockUserFlagsInput CreateUserFlags()
        {
            return new WoodstockUserFlagsInput
            {
                IsVip = true,
                IsUltimateVip = true,
                IsTurn10Employee = false,
                IsUnderReview = false,
                IsRaceMarshall = false,
                IsEarlyAccess = false,
                IsCommunityManager = false,
                IsContentCreator = false
            };
        }
    }
}
