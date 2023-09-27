using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead.WelcomeCenter.WorldOfForza;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class GenericPopupTitleTests : SteelheadControllerTestsBase
    {
        private static GenericPopupTitleTestingClient stewardClient;
        private static GenericPopupTitleTestingClient unauthedClient;
        private static WofGenericPopupBridge bridge;
        private static id;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new GenericPopupTitleTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new GenericPopupTitleTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            bridge = new WofGenericPopupBridge();
            id = "someIdtobedetermined"
            

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
                var response = await stewardClient.GetWorldOfForzaGenericCurrentValuesAsync("invalidID").ConfigureAwait(false);
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
