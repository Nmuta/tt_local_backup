using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class BanSummariesControllerTests : SteelheadControllerTestsBase
    {
        private static BanSummariesControllerTestingClient stewardClient;
        private static BanSummariesControllerTestingClient unauthedClient;
        private static IList<ulong> xuidList;
        private static IList<ulong> invalidXuidList;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new BanSummariesControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new BanSummariesControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            xuidList = new List<ulong> { TestConstants.TestAccountXuid };
            invalidXuidList = new List<ulong> { TestConstants.InvalidXuid };

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanSummaries()
        {
            try
            {
                var response = await stewardClient.GetBanSummaries(xuidList).ConfigureAwait(false);
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
                var response = await stewardClient.GetBanSummaries(invalidXuidList).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanSummaries_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetBanSummaries(xuidList).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
