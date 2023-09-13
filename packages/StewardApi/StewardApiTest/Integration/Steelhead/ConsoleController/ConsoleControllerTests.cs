using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class ConsoleControllerTests : SteelheadControllerTestsBase
    {
        private static ConsoleControllerTestingClient stewardClient;
        private static ConsoleControllerTestingClient unauthedClient;
        private static ulong consoleId;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new ConsoleControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new ConsoleControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
            consoleId = 18230640064596068933;

        }

        [TestMethod]
        [IntegrationTest]
        public async Task SetConsoleBanStatusAsync()
        {
            try
            {
                var response = await stewardClient.SetConsoleBanStatus(consoleId, false).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SetConsoleBanStatusAsync_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.SetConsoleBanStatus(consoleId, false).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SetConsoleBanStatusAsync_InvalidConsoleId()
        {
            try
            {
                var response = await stewardClient.SetConsoleBanStatus(TestConstants.InvalidXuid, false).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, ex.StatusCode);
            }
        }
    }
}
