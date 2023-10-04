using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class GenericPopupTileControllerTests : SteelheadControllerTestsBase
    {
        private static GenericPopupTileControllerTestingClient stewardClient;
        private static GenericPopupTileControllerTestingClient unauthedClient;
        private static WofGenericPopupBridge bridge;
        private static string id;
        private static string invalidId;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new GenericPopupTileControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new GenericPopupTileControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            bridge = new WofGenericPopupBridge();
            // Below id refers to - "[TEST] Pop-up Test"
            id = "a32f4e4f-1e9d-4e9d-9925-12d99e898c14";
            invalidId = "invalid";
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWorldOfForzaGenericPopupSelectionOptionsAsync()
        {
            try
            {
                var response = await stewardClient.GetWorldOfForzaGenericPopupSelectionOptionsAsync().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWorldOfForzaGenericPopupSelectionOptionsAsync_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetWorldOfForzaGenericPopupSelectionOptionsAsync().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWorldOfForzaGenericCurrentValuesAsync()
        {
            try
            {
                var response = await stewardClient.GetWorldOfForzaGenericCurrentValuesAsync(id).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWorldOfForzaGenericCurrentValuesAsync_InvalidId()
        {
            try
            {
                var response = await stewardClient.GetWorldOfForzaGenericCurrentValuesAsync(invalidId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetWorldOfForzaGenericCurrentValuesAsync_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetWorldOfForzaGenericCurrentValuesAsync(id).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task EditAndSubmitGenericPopupTile_InvalidId()
        {
            try
            {
                var response = await stewardClient.EditAndSubmitGenericPopupTile(invalidId, bridge).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task EditAndSubmitGenericPopupTile_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.EditAndSubmitGenericPopupTile(id, bridge).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
