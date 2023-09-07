using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class BuildersCupControllerTests : SteelheadControllerTestsBase
    {
        private static BuildersCupControllerTestingClient stewardClient;
        private static BuildersCupControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new BuildersCupControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new BuildersCupControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetCmsBuildersCupSchedule()
        {
            try
            {
                var response = await stewardClient.GetCmsBuildersCupSchedule().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetCmsBuildersCupSchedule_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetCmsBuildersCupSchedule().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBuildersCupChampionships()
        {
            try
            {
                var response = await stewardClient.GetBuildersCupChampionships().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBuildersCupChampionships_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetBuildersCupChampionships().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBuildersCupLadders()
        {
            try
            {
                var response = await stewardClient.GetBuildersCupLadders().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBuildersCupLadders_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetBuildersCupLadders().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBuildersCupSeries()
        {
            try
            {
                var response = await stewardClient.GetBuildersCupSeries().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBuildersCupSeries_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetBuildersCupSeries().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
