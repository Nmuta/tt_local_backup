using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class DriverLevelControllerTests : SteelheadControllerTestsBase
    {
        private static DriverLevelControllerTestingClient stewardClient;
        private static DriverLevelControllerTestingClient unauthedClient;

        private static SteelheadDriverLevel driverLevel;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new DriverLevelControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new DriverLevelControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
            driverLevel = new SteelheadDriverLevel();

            driverLevel.DriverLevel = 1;
            driverLevel.PrestigeRank = 0;
            driverLevel.ExperiencePoints = 0;
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetDriverLevel()
        {
            try
            {
                var response = await stewardClient.GetDriverLevel(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetDriverLevel_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetDriverLevel(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetDriverLevel_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetDriverLevel(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SetDriverLevel()
        {
            try
            {
                var response = await stewardClient.SetDriverLevel(TestConstants.TestAccountXuid, driverLevel).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SetDriverLevel_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.SetDriverLevel(TestConstants.TestAccountXuid, driverLevel).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SetDriverLevel_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.SetDriverLevel(TestConstants.InvalidXuid, driverLevel).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }
    }
}
