using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class DeeplinkTileControllerTests : SteelheadControllerTestsBase
    {
        private static DeeplinkTileControllerTestingClient stewardClient;
        private static DeeplinkTileControllerTestingClient unauthedClient;
        private static WofDeeplinkBridge bridge;
        private static id;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new DeeplinkTileControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new DeeplinkTileControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            bridge = new WofDeeplinkBridge();
            id = "someIdtobedetermined"
            

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWorldOfForzaDeeplinkSelectionOptionsAsync()
        {
            try
            {
                var response = await stewardClient.GetWorldOfForzaDeeplinkSelectionOptionsAsync().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWorldOfForzaDeeplinkSelectionOptionsAsync_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetWorldOfForzaDeeplinkSelectionOptionsAsync().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWorldOfForzaDeeplinkCurrentValuesAsync()
        {
            try
            {
                var response = await stewardClient.GetWorldOfForzaDeeplinkCurrentValuesAsync(id).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWorldOfForzaDeeplinkCurrentValuesAsync_InvalidId()
        {
            try
            {
                var response = await stewardClient.GetWorldOfForzaDeeplinkCurrentValuesAsync("invalidID").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWorldOfForzaDeeplinkCurrentValuesAsync_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetWorldOfForzaDeeplinkCurrentValuesAsync(id).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task EditAndSubmitDeeplinkTile_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.EditAndSubmitDeeplinkTile(id, bridge).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
