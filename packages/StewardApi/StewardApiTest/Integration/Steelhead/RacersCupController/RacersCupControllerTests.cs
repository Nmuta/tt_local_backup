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
    public sealed class RacersCupControllerTests : SteelheadControllerTestsBase
    {
        private static RacersCupControllerTestingClient stewardClient;
        private static RacersCupControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new RacersCupControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new RacersCupControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSchedule_NoParam()
        {
            try
            {
                var response = await stewardClient.GetRacersCupSchedule().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSchedule_ByXuid()
        {
            try
            {
                var response = await stewardClient.GetRacersCupSchedule(TestConstants.TestAccountXuid).ConfigureAwait(false);
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
                var response = await stewardClient.GetRacersCupSchedule(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSchedule_ByEnv()
        {
            try
            {
                var response = await stewardClient.GetRacersCupSchedule("environment", "prod").ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSchedule_ByEnv_InvalidEnv()
        {
            try
            {
                var response = await stewardClient.GetRacersCupSchedule("environment", "notProd").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSchedule_BySlot()
        {
            try
            {
                var response = await stewardClient.GetRacersCupSchedule("slot", "live").ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSchedule_BySlot_InvalidEnv()
        {
            try
            {
                var response = await stewardClient.GetRacersCupSchedule("slot", "fakeSlot").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSchedule_NoParam_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetRacersCupSchedule().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSchedule_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetRacersCupSchedule(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSchedule_ByEnv_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetRacersCupSchedule("environment", "prod").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSchedule_BySlot_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetRacersCupSchedule("slot", "live").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSeries()
        {
            try
            {
                var response = await stewardClient.GetRacersCupSeries().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetRacersCupSeries_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetRacersCupSeries().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
