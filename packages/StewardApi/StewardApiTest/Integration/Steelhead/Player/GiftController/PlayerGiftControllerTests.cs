using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardApi.Contracts.Woodstock;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class PlayerGiftControllerTests : SteelheadControllerTestsBase
    {
        private static PlayerGiftControllerTestingClient stewardClient;
        private static PlayerGiftControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new PlayerGiftControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new PlayerGiftControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);


        }


        [TestMethod]
        [IntegrationTest]
        public async Task SendPlayerGift_InvalidAuth()
        {
            var gift = this.CreatePlayersGift(TestConstants.TestAccountXuid);

            try
            {
                var response = await unauthedClient.UpdateGroupInventoriesUseBackgroundProcessing(gift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SendPlayerGift_InvalidXuid()
        {
            var gift = this.CreatePlayersGift(TestConstants.InvalidXuid);

            try
            {
                var response = await stewardClient.UpdateGroupInventoriesUseBackgroundProcessing(gift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SendPlayerLiveryGift_InvalidAuth()
        {
            var bulkgift = this.CreateBulkLiveryGroupGift(TestConstants.TestAccountXuid);

            try
            {
                var response = await unauthedClient.GiftLiveryToPlayersUseBackgroundProcessing(bulkgift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SendPlayerLiveryGift_InvalidXuid()
        {
            var bulkgift = this.CreateBulkLiveryGroupGift(TestConstants.InvalidXuid);

            try
            {
                var response = await stewardClient.GiftLiveryToPlayersUseBackgroundProcessing(bulkgift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        private SteelheadGroupGift CreatePlayersGift(ulong xuid)
        {
            return new SteelheadGroupGift
            {
                Xuids = new List<ulong>
                {
                    xuid,
                },
                GiftReason = "Integration Test",
                Inventory = this.CreateGiftInventory(),
            };
        }

        private SteelheadMasterInventory CreateGiftInventory()
        {
            var giftInventory = new SteelheadMasterInventory
            {
                CreditRewards =
                    new List<MasterInventoryItem>
                    {
                        new MasterInventoryItem {Id = -1, Description = "Credits", Quantity = 1},
                    },
                Cars = new List<MasterInventoryItem> { new MasterInventoryItem { Id = 2870, Quantity = 1 } },
            };

            return giftInventory;
        }

        private BulkLiveryGift<LocalizedMessageExpirableGroupGift> CreateBulkLiveryGroupGift (ulong xuid)
        {
            return new BulkLiveryGift<LocalizedMessageExpirableGroupGift>
            {
                Target = this.CreateLiveryGift(xuid),
            };
        }

        private LocalizedMessageExpirableGroupGift CreateLiveryGift(ulong xuid)
        {
            return new LocalizedMessageExpirableGroupGift
            {
                Xuids = new List<ulong>
                {
                    xuid,
                },
                GiftReason = "Integration Test",
            };
        }
    }
}
