using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead.Auctions
{
    [TestClass]
    public sealed class AuctionsControllerTests : SteelheadControllerTestsBase
    {
        private static AuctionsControllerTestingClient stewardClient;
        private static AuctionsControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new AuctionsControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new AuctionsControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetAuctionDetailsAsync()
        {
            try
            {
                var response = await stewardClient.GetAuctionDetails().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetAuctionDetailsAsync_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetAuctionDetails().ConfigureAwait(false); //unauthed
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetAuctionDetailsAsync_InvalidAuctionId()
        {
            try
            {
                var response = await stewardClient.GetAuctionDetails().ConfigureAwait(false); //invalid
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeleteAuctionAsync_InvalidAuctionId()
        {
            try
            {
                var response = await stewardClient.DeleteAuctionAsync().ConfigureAwait(false); //invalid
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeleteAuctionAsync_InvalidAuctionId_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.DeleteAuctionAsync().ConfigureAwait(false); //unauthed
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
