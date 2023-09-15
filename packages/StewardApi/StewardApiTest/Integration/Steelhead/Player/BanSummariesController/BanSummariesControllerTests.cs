using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;
using Turn10.Services.LiveOps.FH5_main.Generated;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class BanSummariesControllerTests : SteelheadControllerTestsBase
    {
        private static BanSummariesControllerTestingClient stewardClient;
        private static BanSummariesControllerTestingClient unauthedClient;
        private static List<ulong> xuids;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new BanSummariesControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new BanSummariesControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            // private static xuids = new List<ulong> {TestConstants.TestAccountXuid};
            // private static invalidXuids = 

           // private static xuids = new List<ulong> {2675352635783107};

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanSummaries()
        {
            try
            {
                var response = await stewardClient.GetBanSummaries(TestConstants., this.banconfig).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanSummaries_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetBanSummaries(new listTestConstants.InvalidXuid, this.banconfig).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanSummaries_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetBanSummaries(TestConstants., this.banconfig).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
