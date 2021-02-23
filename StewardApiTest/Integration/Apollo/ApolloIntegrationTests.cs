using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Apollo;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardTest.Utilities;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Apollo
{
    [TestClass]
    public sealed class ApolloIntegrationTests
    {
        private static string endpoint;
        private static string authKey;
        private static ulong xuid;
        private static ulong consoleId;
        private static string gamertag;
        private static int profileId;
        private static int lspGroupId;
        private static string lspGiftingPassword;
        private static KeyVaultProvider KeyVaultProvider;
        private static ApolloStewardTestingClient stewardClient;
        private static ApolloStewardTestingClient unauthorizedClient;

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

            lspGiftingPassword = testContext.Properties["LspGiftingPassword"].ToString();
            if (string.IsNullOrWhiteSpace(lspGiftingPassword))
            {
                var keyVaultName = testContext.Properties["KeyVaultName"].ToString();
                var lspGiftingPasswordName = testContext.Properties["LspGiftingPasswordName"].ToString();
                lspGiftingPassword = await KeyVaultProvider.GetSecretAsync(keyVaultName, lspGiftingPasswordName).ConfigureAwait(false);
            }

            xuid = 2535467864609498;
            gamertag = "FreeStuff019446";
            profileId = 5167411;
            consoleId = 18230637609444823812;
            lspGroupId = 614;
            
            stewardClient = new ApolloStewardTestingClient(new Uri(endpoint), authKey);
            unauthorizedClient = new ApolloStewardTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
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
            Assert.IsTrue(string.IsNullOrWhiteSpace(result[0].Gamertag));
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
        public async Task GetPlayerDetailsByGamertag()
        {
            var result = await stewardClient.GetPlayerDetailsAsync(gamertag).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(profileId, result.CurrentProfileId);
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
            Assert.AreEqual(profileId, result.CurrentProfileId);
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
        [Ignore]
        public async Task BanPlayers()
        {
            var banParameters = this.GenerateBanParameters();

            var result = await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
            Assert.IsTrue(result[0].Success);
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task BanPlayers_GamertagOnly()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Xuid = default;

            var result = await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
            Assert.IsTrue(result[0].Success);
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task BanPlayers_InvalidXuid()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Xuid = TestConstants.InvalidXuid;
            banParameters[0].Gamertag = null;

            var result = await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsFalse(result[0].Success);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_InvalidGamertag()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Xuid = default;
            banParameters[0].Gamertag = TestConstants.InvalidGamertag;

            try
            {
                await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
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
        public async Task BanPlayers_InvalidFeatureArea()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].FeatureArea = "invalidFeatureArea";

            try
            {
                await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);
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
        public async Task BanPlayers_UndefinedStartTimeUtc()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].StartTimeUtc = default;

            var result = await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.ToList()[0].Success);
            Assert.IsTrue(result[0].BanDescription.StartTimeUtc.ToUniversalTime() < DateTime.UtcNow.AddMinutes(5));
            Assert.IsTrue(result[0].BanDescription.StartTimeUtc.ToUniversalTime() > DateTime.UtcNow.AddMinutes(-5));
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_NoXuidsOrGamertagsProvided()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Xuid = default;
            banParameters[0].Gamertag = null;

            try
            {
                await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_BanAllConsolesUndefined()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].BanAllConsoles = null;

            try
            {
                await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_DurationTimeNotProvided()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Duration = null;

            try
            {
                await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_DurationNegative()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Duration= TimeSpan.FromMinutes(-10);

            try
            {
                await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_DurationZero()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Duration = TimeSpan.Zero;

            try
            {
                await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_SendNotificationWithoutReason()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].SendReasonNotification = true;
            banParameters[0].Reason = string.Empty;

            try
            {
                await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);
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
        public async Task BanPlayers_UseBackgroundProcessing()
        {
            var banParameters = this.GenerateBanParameters();

            var result = await this.BanPlayersWithHeaderResponseAsync(stewardClient, banParameters, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsTrue(result.ToList()[0].Success);
            Assert.IsFalse(string.IsNullOrWhiteSpace(result[0].BanDescription.FeatureArea));
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task BanPlayers_UseBackgroundProcessing_InvalidXuid()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Xuid = TestConstants.InvalidXuid;

            var result = await this.BanPlayersWithHeaderResponseAsync(stewardClient, banParameters, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsFalse(result[0].Success);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_UseBackgroundProcessing_InvalidGamertag()
        {
            var banParameters = this.GenerateBanParameters();
            banParameters[0].Xuid = default;
            banParameters[0].Gamertag = TestConstants.InvalidGamertag;

            var result = await this.BanPlayersWithHeaderResponseAsync(stewardClient, banParameters, BackgroundJobStatus.Failed).ConfigureAwait(false);

            Assert.IsNull(result);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanSummaries()
        {
            var result = await stewardClient.GetBanSummariesAsync(new List<ulong> { xuid }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
            Assert.IsTrue(result[0].UserExists);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBanSummaries_NoXuids()
        {
            var result = await stewardClient.GetBanSummariesAsync(new List<ulong> { }).ConfigureAwait(false);

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
            Assert.IsFalse(result[0].BannedAreas.Any());
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
            var userFlags = CreateUserFlags();
            var result = await stewardClient.SetUserFlagsAsync(xuid, userFlags).ConfigureAwait(false);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SetUserFlags_InvalidXuid()
        {
            var userFlags = CreateUserFlags();

            try
            {
                await stewardClient.SetUserFlagsAsync(TestConstants.InvalidXuid, userFlags).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SetUserFlags_InvalidFlags()
        {
            var userFlags = CreateUserFlags();
            userFlags.IsCommunityManager = null;

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
            var userFlags = CreateUserFlags();

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
        public async Task GetPlayerInventoryByXuid()
        {
            var result = await stewardClient.GetPlayerInventoryAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Cars.Any());
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
            Assert.IsTrue(result.Cars.Any());
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
        public async Task GetInventoryProfilesByXuid()
        {
            var result = await stewardClient.GetInventoryProfilesAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(profileId, result[0].ProfileId);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetInventoryProfilesByXuid_InvalidXuid()
        {
            var result = await stewardClient.GetInventoryProfilesAsync(TestConstants.InvalidXuid).ConfigureAwait(false);

            Assert.IsFalse(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
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
        public async Task UpdatePlayerInventory_UseBackgroundProcessing()
        {
            var playerInventory = this.CreatePlayerInventory();

            var result = await UpdatePlayerInventoryWithHeaderResponseAsync(stewardClient, playerInventory, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Cars.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task UpdateGroupInventoriesByXuid()
        {
            var groupGift = this.CreateGroupGift();

            var result = await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Credits);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByXuid_InvalidGiftInventory()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.Inventory = null;

            try
            {
                await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByXuid_InvalidItemId()
        {
            var playerGift = this.CreateGroupGift();
            playerGift.Inventory.VanityItems = new List<MasterInventoryItem>();
            playerGift.Inventory.Cars = new List<MasterInventoryItem>()
            {
                new MasterInventoryItem()
                {
                    Id = 10000,
                    Description = "Bad Item",
                    Quantity = 1,
                },
            };

            try
            {
                await stewardClient.UpdateGroupInventoriesByXuidAsync(playerGift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
                Assert.AreEqual("Invalid items found. Car: 10000, ", e.ResponseBody);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByXuid_NoRecipient()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.Xuids = new List<ulong>();

            try
            {
                await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift).ConfigureAwait(false);
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
        public async Task UpdateGroupInventoriesByXuid_InvalidRecipient()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.Xuids = new List<ulong> { TestConstants.InvalidXuid };

            try
            {
                await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByXuid_Unauthorized()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.Xuids = new List<ulong> { TestConstants.InvalidXuid };

            try
            {
                await unauthorizedClient.UpdateGroupInventoriesByXuidAsync(groupGift).ConfigureAwait(false);
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
        public async Task UpdateGroupInventoriesByLspGroupId()
        {
            var gift = this.CreateGift();

            var result = await stewardClient.UpdateGroupInventoriesByLspGroupId(lspGroupId, gift).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Credits);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByLspGroupId_InvalidGiftInventory()
        {
            var gift = this.CreateGift();
            gift.Inventory = null;

            try
            {
                await stewardClient.UpdateGroupInventoriesByLspGroupId(lspGroupId, gift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }


        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByLspGroupId_Unauthorized()
        {
            var gift = this.CreateGift();

            try
            {
                await unauthorizedClient.UpdateGroupInventoriesByLspGroupId(lspGroupId, gift).ConfigureAwait(false);
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
        public async Task UpdateGroupInventoriesByLspGroupId_InvalidGroupId()
        {
            var gift = this.CreateGift();

            try
            {
                await stewardClient.UpdateGroupInventoriesByLspGroupId(TestConstants.InvalidProfileId, gift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task GetGiftHistory()
        {
            var groupGift = this.CreateGroupGift();
            await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift).ConfigureAwait(false);

            var result = await stewardClient.GetGiftHistoriesAsync(xuid).ConfigureAwait(false);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task GetGiftHistoryForGroupGift()
        {
            var groupGift = this.CreateGroupGift();
            await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift).ConfigureAwait(false);

            var result = await stewardClient.GetGiftHistoriesAsync(xuid).ConfigureAwait(false);

            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task GetGiftHistoryForLspGroupGift()
        {
            var gift = this.CreateGift();
            await stewardClient.UpdateGroupInventoriesByLspGroupId(lspGroupId, gift).ConfigureAwait(false);

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
        [Ignore]
        public async Task GetGiftHistory_InvalidGiftRecipientId()
        {
            var result = await stewardClient.GetGiftHistoriesAsync(TestConstants.InvalidXuid).ConfigureAwait(false);

            Assert.IsFalse(result.Any());
        }

        private async Task<IList<ApolloBanResult>> BanPlayersWithHeaderResponseAsync(ApolloStewardTestingClient stewardClient, IList<ApolloBanParametersInput> banParameters, BackgroundJobStatus expectedStatus)
        {
            var headersToValidate = new List<string> { "jobId" };

            var response = await stewardClient.BanPlayersWithHeaderResponseAsync(banParameters, headersToValidate).ConfigureAwait(false);

            var stopWatch = new Stopwatch();
            stopWatch.Start();

            bool jobCompleted;
            IList<ApolloBanResult> jobResults;
            BackgroundJobStatus status;

            do
            {
                var backgroundJob = await stewardClient.GetJobStatusAsync(response.Headers["jobId"]).ConfigureAwait(false);

                Enum.TryParse<BackgroundJobStatus>(backgroundJob.Status, out status);

                jobCompleted = status == BackgroundJobStatus.Completed || status == BackgroundJobStatus.Failed;

                jobResults = backgroundJob.Result?.FromJson<IList<ApolloBanResult>>();

                if (stopWatch.ElapsedMilliseconds >= TestConstants.MaxLoopTimeInMilliseconds)
                {
                    break;
                }
            }
            while (!jobCompleted);

            Assert.AreEqual(expectedStatus, status);

            return jobResults;
        }

        private async Task<ApolloPlayerInventory> UpdatePlayerInventoryWithHeaderResponseAsync(ApolloStewardTestingClient stewardClient, ApolloPlayerInventory playerInventory, BackgroundJobStatus expectedStatus)
        {
            var headersToValidate = new List<string> { "jobId" };

            var response = await stewardClient.UpdatePlayerInventoryWithHeaderResponseAsync(playerInventory, headersToValidate).ConfigureAwait(false);

            var stopWatch = new Stopwatch();
            stopWatch.Start();

            bool jobCompleted;
            BackgroundJobStatus status;
            ApolloPlayerInventory jobResult;

            do
            {
                var backgroundJob = await stewardClient.GetJobStatusAsync(response.Headers["jobId"])
                    .ConfigureAwait(false);

                Enum.TryParse<BackgroundJobStatus>(backgroundJob.Status, out status);

                jobCompleted = status == BackgroundJobStatus.Completed || status == BackgroundJobStatus.Failed;

                jobResult = backgroundJob.Result?.FromJson<ApolloPlayerInventory>();

                if (stopWatch.ElapsedMilliseconds >= TestConstants.MaxLoopTimeInMilliseconds)
                {
                    break;
                }
            }
            while (!jobCompleted);

            Assert.AreEqual(expectedStatus, status);

            return jobResult;
        }

        private List<ApolloBanParametersInput> GenerateBanParameters()
        {
            var newParams = new ApolloBanParametersInput
            {
                Xuid = xuid,
                Gamertag = gamertag,
                FeatureArea = "Matchmaking",
                Reason = "This is an automated test.",
                StartTimeUtc = null,
                Duration = TimeSpan.FromSeconds(5),
                BanAllConsoles = false,
                BanAllPcs = false,
                DeleteLeaderboardEntries = false,
                SendReasonNotification = false
            };

            return new List<ApolloBanParametersInput> { newParams };
        }

        private ApolloMasterInventory CreateGiftInventory()
        {
            var giftInventory = new ApolloMasterInventory();

            giftInventory.CreditRewards = new List<MasterInventoryItem>()
            {
                new MasterInventoryItem() { Id = -1, Description = "Credits", Quantity = 1 },
            };


            giftInventory.Cars = new List<MasterInventoryItem>()
            {
                new MasterInventoryItem()
                {
                    Id = 2616,
                    Quantity = 1
                }
            };

            giftInventory.VanityItems = new List<MasterInventoryItem>()
            {
                new MasterInventoryItem()
                {
                    Id = 3,
                    Quantity = 1
                }
            };

            return giftInventory;
        }

        private ApolloPlayerInventory CreatePlayerInventory()
        {
            return new ApolloPlayerInventory
            {
                Xuid = xuid,
                Credits = 1,
                Cars = new[]
                {
                    new ApolloCar
                    {
                        ItemId = 1551,
                        Description = "1989 #18 Aston Martin AMR1",
                        Quantity = 1
                    }
                },
                VanityItems = new[]
                {
                    new ApolloInventoryItem
                    {
                        ItemId = 1762461437,
                        Description = "Snowman",
                        Quantity = 1
                    }
                },
                GiftReason = "Integration Test Run"
            };
        }

        private ApolloGift CreateGift()
        {
            return new ApolloGift
            {
                GiftReason = "Integration Test",
                Inventory = this.CreateGiftInventory()
            };
        }

        private ApolloGroupGift CreateGroupGift()
        {
            return new ApolloGroupGift
            {
                Xuids = new List<ulong>
                {
                    xuid,
                    xuid,
                    xuid
                },
                GiftReason = "Integration Test",
                Inventory = this.CreateGiftInventory()
            };
        }

        private ApolloUserFlagsInput CreateUserFlags()
        {
            return new ApolloUserFlagsInput
            {
                IsUnderReview = false,
                IsVip = false,
                IsCommunityManager = false,
                IsEarlyAccess = false,
                IsTurn10Employee = false
            };
        }
    }
}
