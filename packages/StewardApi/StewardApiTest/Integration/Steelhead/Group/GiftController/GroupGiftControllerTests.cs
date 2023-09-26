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
    public sealed class GroupGiftControllerTests : SteelheadControllerTestsBase
    {
        private static GroupGiftControllerTestingClient stewardClient;
        private static GroupGiftControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new GroupGiftControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new GroupGiftControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);


        }

        [TestMethod]
        [IntegrationTest]
        public async Task SendGrouoGift_InvalidAuth()
        {
            var gift = this.CreateGift(TestConstants.TestAccountXuid);

            try
            {
                var response = await unauthedClient.UpdateGroupInventory(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId, gift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SendGroupGift_InvalidGroupId()
        {
            var gift = this.CreateGift(TestConstants.InvalidXuid);

            try
            {
                var response = await stewardClient.UpdateGroupInventory(TestConstants.InvalidGrouId, gift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SendGroupLiveryGift_InvalidAuth()
        {
            var bulkgift = this.CreateBulkLiveryGift(TestConstants.TestAccountXuid);

            try
            {
                var response = await unauthedClient.GiftLiveryToUserGroup(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId, bulkgift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SendGroupLiveryGift_InvalidGroupId()
        {
            var bulkgift = this.CreateBulkLiveryGift(TestConstants.InvalidXuid);

            try
            {
                var response = await stewardClient.GiftLiveryToUserGroup(TestConstants.InvalidGrouId, bulkgift).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
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

        private SteelheadGift CreateGift(ulong xuid)
        {
            return new SteelheadGift
            {
                GiftReason = "Integration Test",
                Inventory = this.CreateGiftInventory(),
            };

        }

        private BulkLiveryGift<LocalizedMessageExpirableGift> CreateBulkLiveryGift(ulong xuid)
        {
            return new BulkLiveryGift<LocalizedMessageExpirableGift>
            {
                Target = this.CreateLiveryGift(xuid),
            };
        }

    }
}
