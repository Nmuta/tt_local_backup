using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class AuctionsControllerTests : SteelheadControllerTestsBase
    {
        private static AuctionsControllerTestingClient stewardClient;
        private static AuctionsControllerTestingClient unauthedClient;
        private ulong xuid = 2675352635783107;
        private string gamertag = "Plink";

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new AuctionsControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new AuctionsControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerAuctions()
        {
            try
            {
                var response = await stewardClient.GetPlayerAuctions(this.xuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerAuctionLog()
        {
            try
            {
                var response = await stewardClient.GetPlayerAuctionLog(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }
    }
}
