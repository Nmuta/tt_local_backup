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
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardTest.Utilities;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Gravity
{
    [TestClass]
    [Ignore]
    public sealed class GravityIntegrationTests
    {
        private static string endpoint;
        private static string authKey;
        private static ulong xuid;
        private static string gamertag;
        private static string t10Id;
        private static Guid profileId;
        private static Guid gameSettingsId;
        private static KeyVaultProvider KeyVaultProvider;
        private static GravityStewardTestingClient stewardClient;
        private static GravityStewardTestingClient unauthorizedClient;

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

            xuid = 2535429724504183;
            gamertag = "FreeStuff04";
            t10Id = "Sc5wFABwQEyKkQ694nSdnw";
            profileId = new Guid("1f818186-9fa6-41c2-b1b0-ac6ecd32a536");
            gameSettingsId = new Guid("{7eed4e97-4ddd-f55a-ac49-d79a6d9ad85d}");

            stewardClient = new GravityStewardTestingClient(new Uri(endpoint), authKey);
            unauthorizedClient = new GravityStewardTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityByT10Id()
        {
            var query = new IdentityQueryBeta { T10Id = t10Id };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryBeta> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(xuid, result[0].Xuid);
            Assert.IsNull(result[0].Error);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityByT10Id_InvalidT10Id()
        {
            var query = new IdentityQueryBeta { T10Id = TestConstants.InvalidT10Id };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryBeta> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result[0].Error);
            Assert.IsTrue(result[0].Xuid == default);
            Assert.IsTrue(string.IsNullOrWhiteSpace(result[0].Gamertag));
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityByXuid()
        {
            var query = new IdentityQueryBeta { Xuid = xuid };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryBeta> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result[0].T10Ids);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityByXuid_InvalidXuid()
        {
            var query = new IdentityQueryBeta { Xuid = TestConstants.InvalidXuid };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryBeta> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result[0].Error);
            Assert.IsTrue(result[0].Xuid == default);
            Assert.IsTrue(string.IsNullOrWhiteSpace(result[0].Gamertag));
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityByXuid_XuidBelow100()
        {
            var query = new IdentityQueryBeta { Xuid = TestConstants.InvalidXuidBelow100 };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryBeta> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result[0].Error);
            Assert.IsTrue(result[0].Xuid == default);
            Assert.AreEqual(result[0].Query.Xuid, TestConstants.InvalidXuidBelow100);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityByGamertag()
        {
            var query = new IdentityQueryBeta { Gamertag = gamertag };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryBeta> { query }).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsNotNull(result[0].T10Ids);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerIdentityByGamertag_InvalidGamertag()
        {
            var query = new IdentityQueryBeta { Gamertag = TestConstants.InvalidGamertag };

            var result = await stewardClient.GetPlayerIdentitiesAsync(new List<IdentityQueryBeta> { query }).ConfigureAwait(false);

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
            Assert.AreEqual(t10Id, result.T10Id);
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
            Assert.AreEqual(t10Id, result.T10Id);
            Assert.AreEqual(xuid, result.Xuid);
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
        public async Task GetPlayerDetailsByT10Id()
        {
            var result = await stewardClient.GetPlayerDetailsByTurn10IdAsync(t10Id).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(gamertag, result.Gamertag);
            Assert.AreEqual(xuid, result.Xuid);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerDetailsByT10Id_InvalidT10Id()
        {
            try
            {
                await stewardClient.GetPlayerDetailsByTurn10IdAsync(TestConstants.InvalidT10Id).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerDetailsByT10Id_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetPlayerDetailsByTurn10IdAsync(t10Id).ConfigureAwait(false);
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
        public async Task GetPlayerInventoryByT10Id()
        {
            var result = await stewardClient.GetPlayerInventoryAsync(t10Id).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.Cars.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByT10Id_InvalidT10Id()
        {
            try
            {
                await stewardClient.GetPlayerInventoryAsync(TestConstants.InvalidT10Id).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByT10Id_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetPlayerInventoryAsync(t10Id).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByXuidAndProfileId()
        {
            var result = await stewardClient.GetPlayerInventoryAsync(xuid, profileId.ToString()).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(4, result.Cars.Count);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByXuidAndProfileId_InvalidXuid()
        {
            try
            {
                await stewardClient.GetPlayerInventoryAsync(TestConstants.InvalidXuid, profileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByXuidAndProfileId_InvalidProfileId()
        {
            try
            {
                await stewardClient.GetPlayerInventoryAsync(xuid, Guid.NewGuid().ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByXuidAndProfileId_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetPlayerInventoryAsync(xuid, profileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByT10IdAndProfileId()
        {
            var result = await stewardClient.GetPlayerInventoryAsync(t10Id, profileId.ToString()).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.AreEqual(4, result.Cars.Count);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByT10IdAndProfileId_InvalidXuid()
        {
            try
            {
                await stewardClient.GetPlayerInventoryAsync(TestConstants.InvalidT10Id, profileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByT10IdAndProfileId_InvalidProfileId()
        {
            try
            {
                await stewardClient.GetPlayerInventoryAsync(t10Id, Guid.NewGuid().ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerInventoryByT10IdAndProfileId_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetPlayerInventoryAsync(t10Id, profileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventoryByT10Id()
        {
            var gift = new GravityGift
            {
                GiftReason = "Integration Test",
                Inventory = new GravityMasterInventory
                {
                    CreditRewards = new List<MasterInventoryItem>(),
                    Cars = new List<MasterInventoryItem>(),
                    EnergyRefills = new List<MasterInventoryItem>(),
                    RepairKits = new List<MasterInventoryItem>(),
                    MasteryKits = new List<MasterInventoryItem>(),
                    UpgradeKits = new List<MasterInventoryItem>()
                }
            };

            gift.Inventory.CreditRewards.Add(new MasterInventoryItem
            {
                Id = 0,
                Description = "Credits",
                Quantity = 1
            });

            var response = await stewardClient.UpdatePlayerInventoryByT10IdAsync(t10Id, gift).ConfigureAwait(false);

            Assert.IsNotNull(response);
            Assert.IsNull(response.Errors);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventoryByT10Id_InvalidT10Id()
        {
            var gift = CreateGift();

            try
            {
                await stewardClient.UpdatePlayerInventoryByT10IdAsync(TestConstants.InvalidT10Id, gift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventoryByT10Id_Unauthorized()
        {
            var gift = CreateGift();

            try
            {
                await unauthorizedClient.UpdatePlayerInventoryByT10IdAsync(t10Id, gift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventoryByT10Id_UseBackgroundProcessing()
        {
            var gift = new GravityGift
            {
                GiftReason = "Integration Test",
                Inventory = new GravityMasterInventory
                {
                    CreditRewards = new List<MasterInventoryItem>(),
                    Cars = new List<MasterInventoryItem>(),
                    EnergyRefills = new List<MasterInventoryItem>(),
                    RepairKits = new List<MasterInventoryItem>(),
                    MasteryKits = new List<MasterInventoryItem>(),
                    UpgradeKits = new List<MasterInventoryItem>()
                }
            };

            gift.Inventory.CreditRewards.Add(new MasterInventoryItem
            {
                Id = 0,
                Description = "Credits",
                Quantity = 1
            });

            var response = await this.UpdatePlayerInventoriesWithHeaderResponseAsync(stewardClient, t10Id, gift, BackgroundJobStatus.Completed).ConfigureAwait(false);

            Assert.IsNotNull(response);
            Assert.IsNull(response.Errors);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGameSettings()
        {
            var result = await stewardClient.GetGameSettingsAsync(gameSettingsId.ToString()).ConfigureAwait(false);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGameSettings_InvalidGameSettingsId()
        {
            try
            {
                await stewardClient.GetGameSettingsAsync(Guid.NewGuid().ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGameSettings_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetGameSettingsAsync(gameSettingsId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGiftHistory()
        {
            var gift = new GravityGift
            {
                GiftReason = "Integration Test",
                Inventory = new GravityMasterInventory
                {
                    CreditRewards = new List<MasterInventoryItem>(),
                    Cars = new List<MasterInventoryItem>(),
                    EnergyRefills = new List<MasterInventoryItem>(),
                    RepairKits = new List<MasterInventoryItem>(),
                    MasteryKits = new List<MasterInventoryItem>(),
                    UpgradeKits = new List<MasterInventoryItem>()
                }
            };

            gift.Inventory.CreditRewards.Add(new MasterInventoryItem
            {
                Id = 0,
                Description = "Credits",
                Quantity = 1
            });

            await stewardClient.UpdatePlayerInventoryByT10IdAsync(t10Id, gift).ConfigureAwait(false);

            var result = await stewardClient.GetGiftHistoriesAsync(t10Id).ConfigureAwait(false);
            Assert.IsTrue(result.Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetGiftHistory_Unauthorized()
        {
            try
            {
                await unauthorizedClient.GetGiftHistoriesAsync(t10Id).ConfigureAwait(false);
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
            var result = await stewardClient.GetGiftHistoriesAsync(TestConstants.InvalidT10Id).ConfigureAwait(false);

            Assert.IsFalse(result.Any());
        }

        private async Task<GiftResponse<string>> UpdatePlayerInventoriesWithHeaderResponseAsync(GravityStewardTestingClient stewardClient, string t10Id, GravityGift groupGift, BackgroundJobStatus expectedStatus)
        {
            var headersToValidate = new List<string> { "jobId" };

            var response = await stewardClient.UpdatePlayerInventoryWithHeaderResponseAsync(t10Id, groupGift, headersToValidate).ConfigureAwait(false);

            var stopWatch = new Stopwatch();
            stopWatch.Start();

            bool jobCompleted;
            BackgroundJobStatus status;
            GiftResponse<string> jobResult;

            do
            {
                var backgroundJob = await stewardClient.GetJobStatusAsync(response.Headers["jobId"])
                    .ConfigureAwait(false);

                status = backgroundJob.Status;

                jobCompleted = status == BackgroundJobStatus.Completed || status == BackgroundJobStatus.Failed;

                jobResult = JsonConvert.DeserializeObject<GiftResponse<string>>(
                    JsonConvert.SerializeObject(backgroundJob.RawResult));

                if (stopWatch.ElapsedMilliseconds >= TestConstants.MaxLoopTimeInMilliseconds)
                {
                    break;
                }
            }
            while (!jobCompleted);

            Assert.AreEqual(expectedStatus, status);

            return jobResult;
        }

        private static GravityMasterInventory CreateGiftInventory()
        {
            var giftInventory = new GravityMasterInventory
            {
                CreditRewards =
                    new List<MasterInventoryItem>
                    {
                        new MasterInventoryItem {Id = -1, Description = "Credits", Quantity = 1},
                    },
                Cars = new List<MasterInventoryItem> {new MasterInventoryItem {Id = 2616, Quantity = 1}},
                EnergyRefills = new List<MasterInventoryItem> {new MasterInventoryItem {Id = 16, Quantity = 1}},
                MasteryKits = new List<MasterInventoryItem> {new MasterInventoryItem {Id = 310, Quantity = 1}},
                RepairKits = new List<MasterInventoryItem> {new MasterInventoryItem {Id = 2, Quantity = 1}},
                UpgradeKits = new List<MasterInventoryItem> {new MasterInventoryItem {Id = 84, Quantity = 1}}
            };

            return giftInventory;
        }

        private static GravityGift CreateGift()
        {
            return new GravityGift
            {
                GiftReason = "Integration Test",
                Inventory = CreateGiftInventory()
            };
        }
    }
}
