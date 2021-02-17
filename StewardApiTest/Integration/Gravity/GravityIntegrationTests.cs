﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.Data.Common;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Contracts;
using Turn10.LiveOps.StewardApi.Contracts.Gravity;
using Turn10.LiveOps.StewardApi.Providers;
using Turn10.LiveOps.StewardTest.Utilities;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Gravity
{
    [TestClass]
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

        [ClassCleanup]
        public static async Task TearDown()
        {
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
        public async Task GetPlayerDetailsByT10Id_InvalidGamertag()
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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
            var gift = this.CreateGift();
            var resultBefore = await stewardClient.GetPlayerInventoryAsync(t10Id).ConfigureAwait(false);
            var beforeModifiedUtc = resultBefore.Cars.Where(car => car.ItemId == 200289).FirstOrDefault()?.ModifiedUtc;

            var result = await stewardClient.UpdatePlayerInventoryByT10IdAsync(t10Id, gift).ConfigureAwait(false);
            var afterModifiedUtc = result.Cars.Where(car => car.ItemId == 200289).FirstOrDefault().ModifiedUtc;

            Assert.IsNotNull(result);
            Assert.AreNotEqual(beforeModifiedUtc, afterModifiedUtc);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task UpdatePlayerInventoryByT10Id_InvalidT10Id()
        {
            var gift = this.CreateGift();

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
            var gift = this.CreateGift();

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
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
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
            var gift = this.CreateGift();

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

        private Dictionary<string, string> GenerateHeadersToSend(string requestingAgent)
        {
            var result = new Dictionary<string, string>();

            if (!string.IsNullOrWhiteSpace(requestingAgent))
            {
                result.Add("requestingAgent", requestingAgent);
            }

            return result;
        }

        private GravityMasterInventory CreateGiftInventory()
        {
            var giftInventory = new GravityMasterInventory();

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

            giftInventory.EnergyRefills = new List<MasterInventoryItem>()
            {
                new MasterInventoryItem()
                {
                    Id = 16,
                    Quantity = 1
                }
            };

            giftInventory.MasteryKits = new List<MasterInventoryItem>()
            {
                new MasterInventoryItem()
                {
                    Id = 310,
                    Quantity = 1
                }
            };

            giftInventory.RepairKits = new List<MasterInventoryItem>()
            {
                new MasterInventoryItem()
                {
                    Id = 2,
                    Quantity = 1
                }
            };

            giftInventory.UpgradeKits = new List<MasterInventoryItem>()
            {
                new MasterInventoryItem()
                {
                    Id = 84,
                    Quantity = 1
                }
            };

            return giftInventory;
        }

        private GravityPlayerInventory CreatePlayerInventory()
        {
            return new GravityPlayerInventory
            {
                Cars = new[]
                {
                    new GravityCar
                    {
                    Vin = new Guid("ffb44784-6af6-4bc6-9ff2-d21b91e5c657"),
                    PurchaseUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    CurrentMasteryRank = 1,
                    CumulativeMastery = 0,
                    RepairState = 3,
                    StarPoints = 20,
                    Color = 0,
                    Livery = 0,
                    ClientPr = 415,
                    AdvancedCarCustomization = 0,
                    ItemId = 200289,
                    Quantity = 7,
                    AcquisitionUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    ModifiedUtc = DateTime.Now,
                    LastUsedUtc = new DateTime(2019, 08, 01, 12, 10, 10)
                    }
                },
                MasteryKits = new[]
                {
                    new GravityInventoryItem
                    {
                    ItemId = 26,
                    Quantity = 11,
                    AcquisitionUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    ModifiedUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    LastUsedUtc = new DateTime(2019, 08, 01, 12, 10, 10)
                    }
                },
                UpgradeKits = new[]
                {
                    new GravityUpgradeKit
                    {
                    PartialQuantity = 0,
                    ItemId = 29,
                    Quantity = 2,
                    AcquisitionUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    ModifiedUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    LastUsedUtc = new DateTime(2019, 08, 01, 12, 10, 10)
                    }
                },
                RepairKits = new[]
                {
                    new GravityRepairKit
                    {
                    PartialQuantity = 0,
                    ItemId = 103,
                    Quantity = 100,
                    AcquisitionUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    ModifiedUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    LastUsedUtc = new DateTime(2019, 08, 01, 12, 10, 10)
                    }
                },
                Packs = new List<GravityInventoryItem>(),
                Currencies = new[]
                {
                    new GravityInventoryItem
                    {
                    ItemId = 1,
                    Quantity = 10,
                    AcquisitionUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    ModifiedUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    LastUsedUtc = new DateTime(2019, 08, 01, 12, 10, 10)
                    }
                },
                EnergyRefills = new[]
                {
                    new GravityInventoryItem()
                    {
                    ItemId = 60,
                    Quantity = 52,
                    AcquisitionUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    ModifiedUtc = new DateTime(2019, 08, 01, 12, 10, 10),
                    LastUsedUtc = new DateTime(2019, 08, 01, 12, 10, 10)
                    }
                },
                Xuid = xuid,
                T10Id = t10Id
            };
        }

        private GravityGift CreateGift()
        {
            return new GravityGift
            {
                GiftReason = "Integration Test",
                Inventory = this.CreateGiftInventory()
            };
        }
    }
}
