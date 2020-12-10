using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.Data.Common;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Sunrise;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardTest.Utilities;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Sunrise
{
    [TestClass]
    public sealed class SunriseIntegrationTests
    {
        private static string endpoint;
        private static string authKey;
        private static ulong xuid;
        private static ulong consoleId;
        private static string gamertag;
        private static int profileId;
        private static int lspGroupId;
        private static string lspGiftingPassword;
        private static SunriseUserFlags userFlags;
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

            xuid = 2535467864609498;
            gamertag = "FreeStuff019446";
            profileId = 18785266;
            consoleId = 18230637609444823812;
            lspGroupId = 88;

            userFlags = new SunriseUserFlags
            {
                IsVip = true,
                IsUltimateVip = true,
                IsTurn10Employee = false,
                IsCommunityManager = false,
                IsUnderReview = false,
                IsEarlyAccess = false
            };

            stewardClient = new SunriseStewardTestingClient(new Uri(endpoint), authKey);
            unauthorizedClient = new SunriseStewardTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [ClassCleanup]
        public static async Task TearDown()
        {
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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
            var result = await stewardClient.SetUserFlagsAsync(xuid, userFlags).ConfigureAwait(false);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SetUserFlags_InvalidXuid()
        {
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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
        public async Task BanPlayers()
        {
            var banParameters = this.GenerateBanParameters();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            var result = await stewardClient.BanPlayersAsync(banParameters, headersToSend).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
            Assert.IsTrue(result[0].Success);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_InvalidXuid()
        {
            var banParameters = this.GenerateBanParameters();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);
            banParameters.Xuids = new List<ulong> { TestConstants.InvalidXuid };
            banParameters.Gamertags = null;

            var result = await stewardClient.BanPlayersAsync(banParameters, headersToSend).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Any());
            Assert.IsFalse(result[0].Success);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_InvalidGamertag()
        {
            var banParameters = GenerateBanParameters();
            banParameters.Xuids = null;
            banParameters.Gamertags = new List<string> { TestConstants.InvalidGamertag };
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.BanPlayersAsync(banParameters, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_InvalidRequestingAgentHeader()
        {
            var banParameters = GenerateBanParameters();
            var emptyHeaders = new Dictionary<string, string>();

            try
            {
                await stewardClient.BanPlayersAsync(banParameters, emptyHeaders).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_Unauthorized()
        {
            var banParameters = GenerateBanParameters();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await unauthorizedClient.BanPlayersAsync(banParameters, headersToSend).ConfigureAwait(false);
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
            banParameters.FeatureArea = "invalidFeatureArea";
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.BanPlayersAsync(banParameters, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_UndefinedStartTimeUtc()
        {
            var banParameters = GenerateBanParameters();
            banParameters.StartTimeUtc = default;
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            var result = await stewardClient.BanPlayersAsync(banParameters, headersToSend).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.ToList()[0].Success);
            Assert.IsTrue(result[0].BanDescription.StartTimeUtc.ToUniversalTime() < DateTime.UtcNow.AddMinutes(5));
            Assert.IsTrue(result[0].BanDescription.StartTimeUtc.ToUniversalTime() > DateTime.UtcNow.AddMinutes(-5));
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_NoXuidsOrGamertagsProvided()
        {
            var banParameters = GenerateBanParameters();
            banParameters.Xuids = null;
            banParameters.Gamertags = null;
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.BanPlayersAsync(banParameters, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_ExpireTimeNotProvided()
        {
            var banParameters = GenerateBanParameters();
            banParameters.ExpireTimeUtc = default;
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.BanPlayersAsync(banParameters, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_ExpireTimeBeforeCurrentTime()
        {
            var banParameters = GenerateBanParameters();
            banParameters.ExpireTimeUtc = DateTime.UtcNow.AddMinutes(-10);
            banParameters.StartTimeUtc = DateTime.UtcNow.AddMinutes(-15);
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.BanPlayersAsync(banParameters, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_ExpireTimeBeforeStartTime()
        {
            var banParameters = GenerateBanParameters();
            banParameters.ExpireTimeUtc = DateTime.UtcNow.AddMinutes(-15);
            banParameters.StartTimeUtc = DateTime.UtcNow.AddMinutes(-10);
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.BanPlayersAsync(banParameters, headersToSend).ConfigureAwait(false);
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
            banParameters.SendReasonNotification = true;
            banParameters.Reason = string.Empty;
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.BanPlayersAsync(banParameters, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_UseBackgroundProcessing()
        {
            var banParameters = GenerateBanParameters();

            var result = await this.BanPlayersWithHeaderResponseAsync(stewardClient, banParameters, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsTrue(result.ToList()[0].Success);
            Assert.IsFalse(string.IsNullOrWhiteSpace(result[0].BanDescription.FeatureArea));
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_UseBackgroundProcessing_InvalidXuid()
        {
            var banParameters = GenerateBanParameters();
            banParameters.Xuids = new List<ulong> { TestConstants.InvalidXuid };

            var result = await this.BanPlayersWithHeaderResponseAsync(stewardClient, banParameters, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsFalse(result.ToList()[0].Success);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task BanPlayers_UseBackgroundProcessing_InvalidGamertag()
        {
            var banParameters = GenerateBanParameters();
            banParameters.Gamertags = new List<string> { TestConstants.InvalidGamertag };

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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
        public async Task UpdatePlayerInventory()
        {
            var playerInventory = this.CreatePlayerInventory();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            var result = await stewardClient.UpdatePlayerInventoryAsync(playerInventory, headersToSend).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.WheelSpins);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventory_InvalidXuid()
        {
            var playerInventory = this.CreatePlayerInventory();
            playerInventory.Xuid = TestConstants.InvalidXuid;
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.UpdatePlayerInventoryAsync(playerInventory, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventory_NoXuid()
        {
            var playerInventory = this.CreatePlayerInventory();
            playerInventory.Xuid = default;
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.UpdatePlayerInventoryAsync(playerInventory, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventory_NoRequestingAgent()
        {
            var playerInventory = this.CreatePlayerInventory();
            playerInventory.Xuid = default;

            try
            {
                await stewardClient.UpdatePlayerInventoryAsync(playerInventory, new Dictionary<string, string>()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventory_NegativeItemId()
        {
            var playerInventory = this.CreatePlayerInventory();
            playerInventory.Emotes[0].ItemId = -1;
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.UpdatePlayerInventoryAsync(playerInventory, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventory_NegativeCurrency()
        {
            var playerInventory = this.CreatePlayerInventory();
            playerInventory.WheelSpins = -1;
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.UpdatePlayerInventoryAsync(playerInventory, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventory_Unauthorized()
        {
            var playerInventory = this.CreatePlayerInventory();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await unauthorizedClient.UpdatePlayerInventoryAsync(playerInventory, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventory_UseBackgroundProcessing()
        {
            var playerInventory = this.CreatePlayerInventory();

            var result = await UpdatePlayerInventoryWithHeaderResponseAsync(stewardClient, playerInventory, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.WheelSpins);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByXuid()
        {
            var groupGift = this.CreateGroupGift();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            var result = await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift, headersToSend).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Credits);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByXuid_InvalidGiftInventory()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.GiftInventory = null;
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByXuid_NoRequestingAgent()
        {
            var groupGift = this.CreateGroupGift();

            try
            {
                await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift, new Dictionary<string, string>()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByXuid_NoRecipient()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.Xuids = new List<ulong>();
            groupGift.Gamertags = new List<string>();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByXuid_InvalidRecipient()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.Xuids = new List<ulong> { TestConstants.InvalidXuid };
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift, headersToSend).ConfigureAwait(false);
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
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await unauthorizedClient.UpdateGroupInventoriesByXuidAsync(groupGift, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByGamertag()
        {
            var groupGift = this.CreateGroupGift();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            var result = await stewardClient.UpdateGroupInventoriesByGamertagAsync(groupGift, headersToSend).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Credits);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByGamertag_InvalidGiftInventory()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.GiftInventory = null;
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.UpdateGroupInventoriesByGamertagAsync(groupGift, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByGamertag_NoRequestingAgent()
        {
            var groupGift = this.CreateGroupGift();

            try
            {
                await stewardClient.UpdateGroupInventoriesByGamertagAsync(groupGift, new Dictionary<string, string>()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByGamertag_NoRecipient()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.Xuids = new List<ulong>();
            groupGift.Gamertags = new List<string>();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.UpdateGroupInventoriesByGamertagAsync(groupGift, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByGamertag_InvalidRecipient()
        {
            var groupGift = this.CreateGroupGift();
            groupGift.Gamertags = new List<string> { TestConstants.InvalidGamertag };
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await stewardClient.UpdateGroupInventoriesByGamertagAsync(groupGift, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByGamertag_Unauthorized()
        {
            var groupGift = this.CreateGroupGift();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            try
            {
                await unauthorizedClient.UpdateGroupInventoriesByGamertagAsync(groupGift, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByLspGroupId()
        {
            var playerInventory = this.CreatePlayerInventory();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", lspGiftingPassword);

            var result = await stewardClient.UpdateGroupInventoriesByLspGroupId(lspGroupId, playerInventory, headersToSend).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Credits);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByLspGroupId_InvalidGiftingPassword()
        {
            var playerInventory = this.CreatePlayerInventory();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", TestConstants.GetSecretResult);

            try
            {
                await stewardClient.UpdateGroupInventoriesByLspGroupId(lspGroupId, playerInventory, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdateGroupInventoriesByLspGroupId_NoRequestingAgent()
        {
            var playerInventory = this.CreatePlayerInventory();
            var headersToSend = this.GenerateHeadersToSend(null, lspGiftingPassword);

            try
            {
                await stewardClient.UpdateGroupInventoriesByLspGroupId(lspGroupId, playerInventory, headersToSend).ConfigureAwait(false);
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
            var playerInventory = this.CreatePlayerInventory();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", lspGiftingPassword);

            try
            {
                await unauthorizedClient.UpdateGroupInventoriesByLspGroupId(lspGroupId, playerInventory, headersToSend).ConfigureAwait(false);
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
            var playerInventory = this.CreatePlayerInventory();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", lspGiftingPassword);

            try
            {
                await stewardClient.UpdateGroupInventoriesByLspGroupId(TestConstants.InvalidProfileId, playerInventory, headersToSend).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGiftHistory()
        {
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            var playerInventory = this.CreatePlayerInventory();
            await stewardClient.UpdatePlayerInventoryAsync(playerInventory, headersToSend).ConfigureAwait(false);

            var result = await stewardClient.GetGiftHistoriesAsync(GiftHistoryAntecedent.Xuid, xuid.ToString(CultureInfo.InvariantCulture)).ConfigureAwait(false);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGiftHistoryForGroupGift()
        {
            var groupGift = this.CreateGroupGift();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            await stewardClient.UpdateGroupInventoriesByXuidAsync(groupGift, headersToSend).ConfigureAwait(false);

            var result = await stewardClient.GetGiftHistoriesAsync(GiftHistoryAntecedent.Xuid, xuid.ToString(CultureInfo.InvariantCulture)).ConfigureAwait(false);

            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGiftHistoryForLspGroupGift()
        {
            var playerInventory = this.CreatePlayerInventory();
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", lspGiftingPassword);

            await stewardClient.UpdateGroupInventoriesByLspGroupId(lspGroupId, playerInventory, headersToSend).ConfigureAwait(false);

            var result = await stewardClient.GetGiftHistoriesAsync(GiftHistoryAntecedent.LspGroupId, lspGroupId.ToString(CultureInfo.InvariantCulture)).ConfigureAwait(false);

            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGiftHistory_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetGiftHistoriesAsync(GiftHistoryAntecedent.Xuid, xuid.ToString(CultureInfo.InvariantCulture)).ConfigureAwait(false);
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
            var result = await stewardClient.GetGiftHistoriesAsync(GiftHistoryAntecedent.Xuid, TestConstants.InvalidXuid.ToString(CultureInfo.InvariantCulture)).ConfigureAwait(false);

            Assert.IsFalse(result.Any());
        }

        private async Task<SunrisePlayerInventory> UpdatePlayerInventoryWithHeaderResponseAsync(SunriseStewardTestingClient stewardClient, SunrisePlayerInventory playerInventory, BackgroundJobStatus expectedStatus)
        {
            var headersToValidate = new List<string> { "jobId" };
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            var response = await stewardClient.UpdatePlayerInventoryWithHeaderResponseAsync(playerInventory, headersToValidate, headersToSend).ConfigureAwait(false);

            var stopWatch = new Stopwatch();
            stopWatch.Start();

            bool jobCompleted;
            BackgroundJobStatus status;
            SunrisePlayerInventory jobResult;

            do
            {
                var backgroundJob = await stewardClient.GetJobStatusAsync(response.Headers["jobId"])
                    .ConfigureAwait(false);

                Enum.TryParse<BackgroundJobStatus>(backgroundJob.Status, out status);

                jobCompleted = status == BackgroundJobStatus.Completed || status == BackgroundJobStatus.Failed;

                jobResult = backgroundJob.Result?.FromJson<SunrisePlayerInventory>();

                if (stopWatch.ElapsedMilliseconds >= TestConstants.MaxLoopTimeInMilliseconds)
                {
                    break;
                }
            } while (!jobCompleted);

            Assert.AreEqual(expectedStatus, status);

            return jobResult;
        }

        private async Task<IList<SunriseBanResult>> BanPlayersWithHeaderResponseAsync(SunriseStewardTestingClient stewardClient, SunriseBanParameters banParameters, BackgroundJobStatus expectedStatus)
        {
            var headersToValidate = new List<string> { "jobId" };
            var headersToSend = this.GenerateHeadersToSend("IntegrationTest", null);

            var response = await stewardClient.BanPlayersWithHeaderResponseAsync(banParameters, headersToValidate, headersToSend).ConfigureAwait(false);

            var stopWatch = new Stopwatch();
            stopWatch.Start();

            bool jobCompleted;
            IList<SunriseBanResult> jobResults;
            BackgroundJobStatus status;

            do
            {
                var backgroundJob = await stewardClient.GetJobStatusAsync(response.Headers["jobId"]).ConfigureAwait(false);

                Enum.TryParse<BackgroundJobStatus>(backgroundJob.Status, out status);

                jobCompleted = status == BackgroundJobStatus.Completed || status == BackgroundJobStatus.Failed;

                jobResults = backgroundJob.Result?.FromJson<IList<SunriseBanResult>>();

                if (stopWatch.ElapsedMilliseconds >= TestConstants.MaxLoopTimeInMilliseconds)
                {
                    break;
                }
            } while (!jobCompleted);

            Assert.AreEqual(expectedStatus, status);

            return jobResults;
        }

        private SunriseBanParameters GenerateBanParameters()
        {
            return new SunriseBanParameters
            {
                Xuids = new List<ulong> { xuid },
                Gamertags = new List<string> { gamertag },
                FeatureArea = "Matchmaking",
                Reason = "This is an automated test.",
                StartTimeUtc = DateTime.UtcNow,
                ExpireTimeUtc = DateTime.UtcNow.AddSeconds(5),
                BanAllConsoles = false,
                BanAllPcs = false,
                DeleteLeaderboardEntries = false,
                SendReasonNotification = false
            };
        }

        private SunrisePlayerInventory CreatePlayerInventory()
        {
            return new SunrisePlayerInventory
            {
                Xuid = xuid,
                Credits = 1,
                WheelSpins = 1,
                SuperWheelSpins = 1,
                SkillPoints = 1,
                ForzathonPoints = 1,
                Cars = new[]
                {
                    new SunriseCar
                    {
                        ItemId = 2616,
                        Quantity = 1
                    }
                },
                Emotes = new[]
                {
                    new SunriseInventoryItem
                    {
                        ItemId = 6,
                        Quantity = 1
                    }
                },
                CarHorns = new[]
                {
                    new SunriseInventoryItem
                    {
                        ItemId = 22,
                        Quantity = 1
                    }
                },
                VanityItems = new[]
                {
                    new SunriseInventoryItem
                    {
                        ItemId = 3,
                        Quantity = 1
                    }
                },
                QuickChatLines = new[]
                {
                    new SunriseInventoryItem
                    {
                        ItemId = 190,
                        Quantity = 1
                    }
                },
                GiftReason = "Integration Test Run"
            };
        }

        private Dictionary<string, string> GenerateHeadersToSend(string requestingAgent, string lspGiftingPassword)
        {
            var result = new Dictionary<string, string>();

            if (!string.IsNullOrWhiteSpace(requestingAgent))
            {
                result.Add("requestingAgent", requestingAgent);
            }

            if (!string.IsNullOrWhiteSpace(lspGiftingPassword))
            {
                result.Add("adminAuth", lspGiftingPassword);
            }

            return result;
        }

        private SunriseGroupGift CreateGroupGift()
        {
            return new SunriseGroupGift
            {
                Xuids = new List<ulong>
                {
                    xuid,
                    xuid,
                    xuid
                },
                Gamertags = new List<string>
                {
                    gamertag,
                    gamertag,
                    gamertag
                },
                GiftInventory = this.CreatePlayerInventory()
            };
        }
    }
}
