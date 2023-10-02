using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class MessageOfTheDayControllerTests : SteelheadControllerTestsBase
    {
        private static MessageOfTheDayControllerTestingClient stewardClient;
        private static MessageOfTheDayControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new MessageOfTheDayControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new MessageOfTheDayControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetMotDSelectionOptionsAsync()
        {
            try
            {
                var response = await stewardClient.GetMotDSelectionOptionsAsync().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetMotDSelectionOptionsAsync_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetMotDSelectionOptionsAsync().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetMotDCurrentValuesAsync()
        {
            try
            {
                var response = await stewardClient.GetMotDCurrentValuesAsync(TestConstants.TestMessageOfTheDayId).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetMotDCurrentValuesAsync_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetMotDCurrentValuesAsync(TestConstants.TestMessageOfTheDayId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
