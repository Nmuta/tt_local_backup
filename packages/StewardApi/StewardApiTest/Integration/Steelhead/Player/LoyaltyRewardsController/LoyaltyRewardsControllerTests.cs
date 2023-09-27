using System;
using System.Collections;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class LoyaltyRewardsControllerTests : SteelheadControllerTestsBase
    {
        private static LoyaltyRewardsControllerTestingClient stewardClient;
        private static LoyaltyRewardsControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new LoyaltyRewardsControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new LoyaltyRewardsControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetHasPlayedRecord_ByXuid()
        {
            try
            {
                var response = await stewardClient.GetHasPlayedRecord(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetHasPlayedRecord_ByXuid_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetHasPlayedRecord(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetHasPlayedRecord_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetHasPlayedRecord(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task ResendLoyaltyRewards_ByXuid_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.ResendLoyaltyRewards(TestConstants.InvalidXuid, TestConstants.TestAccountTitlesOwned).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task ResendLoyaltyRewards_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.ResendLoyaltyRewards(TestConstants.TestAccountXuid, TestConstants.TestAccountTitlesOwned).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
