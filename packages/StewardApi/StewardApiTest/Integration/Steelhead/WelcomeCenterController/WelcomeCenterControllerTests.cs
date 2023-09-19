using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class WelcomeCenterControllerTests : SteelheadControllerTestsBase
    {
        private static WelcomeCenterControllerTestingClient stewardClient;
        private static WelcomeCenterControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new WelcomeCenterControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new WelcomeCenterControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWelcomeCenterConfig_NoParam()
        {
            try
            {
                var response = await stewardClient.GetWelcomeCenterConfig().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWelcomeCenterConfig_ByXuid()
        {
            try
            {
                var response = await stewardClient.GetWelcomeCenterConfig(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWelcomeCenterConfig_ByXuid_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetWelcomeCenterConfig(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWelcomeCenterConfig_NoParam_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetWelcomeCenterConfig().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWelcomeCenterConfig_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetWelcomeCenterConfig(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
