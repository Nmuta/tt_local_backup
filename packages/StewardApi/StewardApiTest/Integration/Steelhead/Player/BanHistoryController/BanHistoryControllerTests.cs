using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class BanHistoryControllerTests : SteelheadControllerTestsBase
    {
        private static BanHistoryControllerTestingClient stewardClient;
        private static BanHistoryControllerTestingClient unauthedClient;

        // This xuid refers to gamertag - "Plink"
        private ulong xuid = 2675352635783107;

        // Suggest pulling BanReasonGroup out of Players/BanHistoryController class.
        // This Guid refers to the BanReasonGroup - "Developer" 
        private Guid banconfig = new Guid("c8ec2fac-6132-4c87-85dc-1b799e08aca4");
        private Guid invalidBanconfig = new Guid("55555555-5555-5555-5555-555555555555");

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new BanHistoryControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new BanHistoryControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanHistory()
        {
            try
            {
                var response = await stewardClient.GetBanHistory(this.xuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanHistory_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetBanHistory(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanHistory_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetBanHistory(this.xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
