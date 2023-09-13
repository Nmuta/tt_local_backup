using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead.RivalsController
{
    [TestClass]
    public sealed class RivalsControllerTest : SteelheadControllerTestsBase
    {
        private static RivalsControllerTestingClient stewardClient;
        private static RivalsControllerTestingClient unauthedClient;
        private ulong xuid = 2675352635783107;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new RivalsControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new RivalsControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRivalsEvents_NoParam()
        {
            try
            {
                var response = await stewardClient.GetRivalsEvents().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRivalsEvents_ByXuid()
        {
            try
            {
                var response = await stewardClient.GetRivalsEvents(this.xuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRivalsEvents_ByXuid_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetRivalsEvents(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRivalEvents_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetRivalsEvents(this.xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRivalEvents_Reference()
        {
            try
            {
                var response = await stewardClient.GetRivalsEventsReference().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRivalEvents_Categories()
        {
            try
            {
                var response = await stewardClient.GetRivalsEventsCategories().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }
    }
}
