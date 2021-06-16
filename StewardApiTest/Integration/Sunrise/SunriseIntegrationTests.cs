using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardTest.Utilities;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Sunrise
{
    [TestClass]
    public sealed class SunriseIntegrationTests
    {
        private static string endpoint;
        private static string authKey;
        private static ulong notificationXuid;
        private static ulong xuid;
        private static ulong consoleId;
        private static string gamertag;
        private static int profileId;
        private static int lspGroupId;
        private static string lspGiftingPassword;
        private static KeyVaultProvider KeyVaultProvider;
        private static SunriseStewardTestingClient stewardClient;
        private static SunriseStewardTestingClient unauthorizedClient;

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

            notificationXuid = 2535406565799176; // This xuid is required until we have access to an API to clear notification queue on LSP.
            xuid = 2535467864609498;
            gamertag = "FreeStuff019446";
            profileId = 18785266;
            consoleId = 18230637609444823812;
            lspGroupId = 88;

            stewardClient = new SunriseStewardTestingClient(new Uri(endpoint), authKey);
            unauthorizedClient = new SunriseStewardTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
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
                var x = await stewardClient.GetConsolesAsync(TestConstants.InvalidXuid, TestConstants.DefaultMaxResults).ConfigureAwait(false);
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
        public async Task GetProfileSummary()
        {
            var result = await stewardClient.GetProfileSummaryAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
        }

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
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
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
        public async Task GetBackstagePassUpdates()
        {
            var result = await stewardClient.GetBackstagePassUpdatesAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBackstagePassUpdates_InvalidXuid()
        {
            try
            {
                await stewardClient.GetBackstagePassUpdatesAsync(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetBackstagePassUpdates_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetBackstagePassUpdatesAsync(xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
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
            banParameters[0].Gamertag = null;

            var result = await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
            Assert.IsNotNull(result[0].Error);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_InvalidGamertag()
        {
            var banParameters = GenerateBanParameters();
            banParameters[0].Xuid = default(ulong);
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
            var banParameters = GenerateBanParameters();

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
            var banParameters = GenerateBanParameters();
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
            var banParameters = GenerateBanParameters();
            banParameters[0].StartTimeUtc = default;

            var result = await stewardClient.BanPlayersAsync(banParameters).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNull(result.ToList()[0].Error);
            Assert.IsTrue(result[0].BanDescription.StartTimeUtc.ToUniversalTime() < DateTime.UtcNow.AddMinutes(5));
            Assert.IsTrue(result[0].BanDescription.StartTimeUtc.ToUniversalTime() > DateTime.UtcNow.AddMinutes(-5));
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_NoXuidsOrGamertagsProvided()
        {
            var banParameters = GenerateBanParameters();
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
        public async Task BanPlayers_DurationNull()
        {
            var banParameters = GenerateBanParameters();
            banParameters[0].Duration = default;

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
            var banParameters = GenerateBanParameters();
            banParameters[0].Duration = TimeSpan.Zero;
            banParameters[0].StartTimeUtc = DateTime.UtcNow.AddMinutes(-15);

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
            var banParameters = GenerateBanParameters();
            banParameters[0].Duration = TimeSpan.FromMinutes(-10);
            banParameters[0].StartTimeUtc = DateTime.UtcNow.AddMinutes(-10);

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
        public async Task BanPlayers_SendNotificationWithoutReason()
        {
            var banParameters = GenerateBanParameters();
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
            var banParameters = GenerateBanParameters();

            var result = await this.BanPlayersWithHeaderResponseAsync(stewardClient, banParameters, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsNull(result.ToList()[0].Error);
            Assert.IsFalse(string.IsNullOrWhiteSpace(result[0].BanDescription.FeatureArea));
        }

        [TestMethod]
        [TestCategory("Integration")]
        [Ignore]
        public async Task BanPlayers_UseBackgroundProcessing_InvalidXuid()
        {
            var banParameters = GenerateBanParameters();
            banParameters[0].Xuid = TestConstants.InvalidXuid;

            var result = await this.BanPlayersWithHeaderResponseAsync(stewardClient, banParameters, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ToList()[0].Error);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_UseBackgroundProcessing_InvalidGamertag()
        {
            var banParameters = GenerateBanParameters();
            banParameters[0].Gamertag = TestConstants.InvalidGamertag;
            banParameters[0].Xuid = null;

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
        public async Task GetAccountInventory()
        {
            var result = await stewardClient.GetAccountInventoryAsync(xuid).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.BackstagePasses > 0);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetAccountInventory_InvalidXuid()
        {
            try
            {
                await stewardClient.GetAccountInventoryAsync(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetAccountInventory_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetAccountInventoryAsync(xuid).ConfigureAwait(false);
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
            Assert.IsNull(result[0].Error);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventories_NoXuid()
        {
            var playerGift = this.CreateGroupGift();
            playerGift.Xuids = new List<ulong>
            {
                default
            };

            try
            {
                await stewardClient.UpdatePlayerInventoriesAsync(playerGift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventories_NegativeItemId()
        {
            var playerGift = this.CreateGroupGift();
            playerGift.Inventory.Emotes[0].Id = -1;

            try
            {
                await stewardClient.UpdatePlayerInventoriesAsync(playerGift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventories_NegativeCurrency()
        {
            var playerGift = this.CreateGroupGift();
            playerGift.Inventory.CreditRewards = new List<MasterInventoryItem>
            {
                new MasterInventoryItem
                {
                    Id = -1,
                    Description = "WheelSpins",
                    Quantity = -1,
                }
            };

            try
            {
                await stewardClient.UpdatePlayerInventoriesAsync(playerGift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventories_InvalidItemId()
        {
            var playerGift = this.CreateGroupGift();
            playerGift.Inventory.VanityItems = new List<MasterInventoryItem>
            {
                new MasterInventoryItem
                {
                    Id = 700,
                    Description = "Bad Item",
                    Quantity = 1,
                },
            };

            try
            {
                await stewardClient.UpdatePlayerInventoriesAsync(playerGift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
                Assert.IsTrue(e.ResponseBody.Contains("Invalid items found. VanityItem: 700, "));
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventories_Unauthorized()
        {
            var playerGift = this.CreateGroupGift();

            try
            {
                await unauthorizedClient.UpdatePlayerInventoriesAsync(playerGift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventories_InvalidGiftInventory()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.Inventory = null;

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
        public async Task UpdatePlayerInventories_NoRecipient()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.Xuids = new List<ulong>();

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

            var result = await UpdatePlayerInventoriesWithHeaderResponseAsync(stewardClient, groupGift, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNull(result[0].Error);
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
        public async Task UpdateGroupInventoriesByLspGroupId_Unauthorized()
        {
            var gift = this.CreateGift();

            try
            {
                await unauthorizedClient.GiftInventoryByLspGroupId(lspGroupId, gift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByLspGroupId_InvalidGroupId()
        {
            var gift = this.CreateGift();

            var response = await stewardClient.GiftInventoryByLspGroupId(TestConstants.InvalidProfileId, gift).ConfigureAwait(false);
            Assert.IsTrue(response.Error.Message.Contains(TestConstants.InvalidProfileId.ToString()));

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
            var result = await stewardClient.GetNotificationsAsync(notificationXuid, TestConstants.DefaultMaxResults).ConfigureAwait(false);

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
                await stewardClient.GetNotificationsAsync(notificationXuid, TestConstants.NegativeValue).ConfigureAwait(false);
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
                await unauthorizedClient.GetNotificationsAsync(notificationXuid, TestConstants.DefaultMaxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendNotifications()
        {
            var message = new BulkCommunityMessage
            {
                Xuids = new List<ulong> {notificationXuid},
                Message = "Integration Test Message",
                Duration = TimeSpan.FromDays(1)
            };
            var result = await stewardClient.SendNotificationsAsync(message).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
            Assert.IsTrue(result[0].Success);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendNotificationsInvalidXuid()
        {
            var message = new BulkCommunityMessage
            {
                Xuids = new List<ulong> { TestConstants.InvalidXuid },
                Message = "Integration Test Message",
                Duration = TimeSpan.FromDays(1)
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
                Xuids = new List<ulong> { notificationXuid },
                Message = new string('*', 520),
                Duration = TimeSpan.FromDays(1)
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
        public async Task SendNotificationsMessageDurationTooShort()
        {
            var message = new BulkCommunityMessage
            {
                Xuids = new List<ulong> { notificationXuid },
                Message = "Integration Test Message",
                Duration = TimeSpan.FromMinutes(5)
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
                Xuids = new List<ulong> { notificationXuid },
                Message = "Integration Test Message",
                Duration = TimeSpan.FromDays(1)
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
        public async Task SendGroupNotifications()
        {
            var message = new CommunityMessage
            {
                Message = "Integration Test Message",
                Duration = TimeSpan.FromDays(1)
            };

            await stewardClient.SendGroupNotificationsAsync(lspGroupId, message).ConfigureAwait(false);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendGroupNotificationsUnauthorized()
        {
            var message = new CommunityMessage
            {
                Message = "Integration Test Message",
                Duration = TimeSpan.FromDays(1)
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
            var message = new CommunityMessage
            {
                Message = new string('*', 520),
                Duration = TimeSpan.FromDays(1)
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
        public async Task SendGroupNotificationsDurationTooShort()
        {
            var message = new CommunityMessage
            {
                Message = "Integration Test Message",
                Duration = TimeSpan.FromMinutes(5)
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
            var message = new CommunityMessage
            {
                Message = new string('*', 520),
                Duration = TimeSpan.FromDays(1)
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
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SendProfileNotes_InvalidXuid()
        {
            var message = new SunriseProfileNote {Text = "Test Text", Author = "Integration Tests", DateUtc = DateTime.UtcNow};

            try
            {
                await stewardClient.SendProfileNotesAsync(TestConstants.InvalidXuid, message).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        private async Task<IList<GiftResponse<ulong>>> UpdatePlayerInventoriesWithHeaderResponseAsync(SunriseStewardTestingClient stewardClient, SunriseGroupGift groupGift, BackgroundJobStatus expectedStatus)
        {
            var headersToValidate = new List<string> { "jobId" };

            var response = await stewardClient.UpdatePlayerInventoriesWithHeaderResponseAsync(groupGift, headersToValidate).ConfigureAwait(false);

            var stopWatch = new Stopwatch();
            stopWatch.Start();

            bool jobCompleted;
            BackgroundJobStatus status;
            IList<GiftResponse<ulong>> jobResult;

            do
            {
                var backgroundJob = await stewardClient.GetJobStatusAsync(response.Headers["jobId"])
                    .ConfigureAwait(false);

                status = backgroundJob.Status;

                jobCompleted = status == BackgroundJobStatus.Completed || status == BackgroundJobStatus.Failed;

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

        private async Task<IList<BanResult>> BanPlayersWithHeaderResponseAsync(SunriseStewardTestingClient stewardClient, IList<SunriseBanParametersInput> banParameters, BackgroundJobStatus expectedStatus)
        {
            var headersToValidate = new List<string> { "jobId" };

            var response = await stewardClient.BanPlayersWithHeaderResponseAsync(banParameters, headersToValidate).ConfigureAwait(false);

            var stopWatch = new Stopwatch();
            stopWatch.Start();

            bool jobCompleted;
            IList<BanResult> jobResults;
            BackgroundJobStatus status;

            do
            {
                var backgroundJob = await stewardClient.GetJobStatusAsync(response.Headers["jobId"]).ConfigureAwait(false);

                status = backgroundJob.Status;

                jobCompleted = status == BackgroundJobStatus.Completed || status == BackgroundJobStatus.Failed;

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

        private IList<SunriseBanParametersInput> GenerateBanParameters()
        {
            return new List<SunriseBanParametersInput>
            {
                new SunriseBanParametersInput
                {
                    Xuid = xuid,
                    Gamertag = gamertag,
                    FeatureArea = "Matchmaking",
                    Reason = "This is an automated test.",
                    StartTimeUtc = DateTime.UtcNow,
                    Duration = TimeSpan.FromMinutes(5),
                    BanAllConsoles = false,
                    BanAllPcs = false,
                    DeleteLeaderboardEntries = false,
                    SendReasonNotification = false
                }
            };
        }

        private SunriseMasterInventory CreateGiftInventory()
        {
            var giftInventory = new SunriseMasterInventory
            {
                CreditRewards =
                    new List<MasterInventoryItem>
                    {
                        new MasterInventoryItem {Id = -1, Description = "Credits", Quantity = 1},
                        new MasterInventoryItem {Id = -1, Description = "BackstagePasses", Quantity = 1}
                    },
                Cars = new List<MasterInventoryItem> {new MasterInventoryItem {Id = 2616, Quantity = 1}},
                CarHorns = new List<MasterInventoryItem> {new MasterInventoryItem {Id = 22, Quantity = 1}},
                VanityItems = new List<MasterInventoryItem> {new MasterInventoryItem {Id = 3, Quantity = 1}},
                Emotes = new List<MasterInventoryItem> {new MasterInventoryItem {Id = 6, Quantity = 1}},
                QuickChatLines = new List<MasterInventoryItem> {new MasterInventoryItem {Id = 190, Quantity = 1}}
            };

            return giftInventory;
        }

        private SunriseGroupGift CreateGroupGift()
        {
            return new SunriseGroupGift
            {
                Xuids = new List<ulong>
                {
                    xuid
                },
                GiftReason = "Integration Test",
                Inventory = this.CreateGiftInventory()
            };
        }

        private SunriseGift CreateGift()
        {
            return new SunriseGift
            {
                GiftReason = "Integration Test",
                Inventory = this.CreateGiftInventory()
            };
        }

        private SunriseUserFlagsInput CreateUserFlags()
        {
            return new SunriseUserFlagsInput
            {
                IsVip = true,
                IsUltimateVip = true,
                IsTurn10Employee = false,
                IsCommunityManager = false,
                IsUnderReview = false,
                IsEarlyAccess = false
            };
        }
    }
}
