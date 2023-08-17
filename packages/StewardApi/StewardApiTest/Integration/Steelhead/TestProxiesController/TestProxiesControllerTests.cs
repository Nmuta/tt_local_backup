using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class TestProxiesControllerTests : SteelheadControllerTestsBase
    {
        private static TestProxiesControllerTestingClient stewardClient;
        private static TestProxiesControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new TestProxiesControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new TestProxiesControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task VerifyServiceProxies()
        {
            try
            {
                await stewardClient.TestServiceProxies().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task VerifyServiceProxies_InvalidAuth()
        {
            try
            {
                await unauthedClient.TestServiceProxies().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }
    }
}
