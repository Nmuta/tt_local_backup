using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    [IntegrationTest]
    public sealed class TestProxiesControllerTests : SteelheadControllerTestsBase
    {
        private static TestProxiesControllerTestingClient stewardClient;
        private static TestProxiesControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new TestProxiesControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new TestProxiesControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestAllServiceProxies()
        {
            try
            {
                await stewardClient.TestAllServiceProxies().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestAllServiceProxies_InvalidAuth()
        {
            try
            {
                await unauthedClient.TestAllServiceProxies().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestAuctionManagementServiceProxy()
        {
            try
            {
                await stewardClient.TestAuctionManagementServiceProxy().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestAuctionManagementServiceProxy_InvalidAuth()
        {
            try
            {
                await unauthedClient.TestAuctionManagementServiceProxy().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestGiftingManagementServiceProxy()
        {
            try
            {
                await stewardClient.TestGiftingManagementServiceProxy().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestGiftingManagementServiceProxy_InvalidAuth()
        {
            try
            {
                await unauthedClient.TestGiftingManagementServiceProxy().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestLiveOpsServiceProxy()
        {
            try
            {
                await stewardClient.TestLiveOpsServiceProxy().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestLiveOpsServiceProxy_InvalidAuth()
        {
            try
            {
                await unauthedClient.TestLiveOpsServiceProxy().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestLocalizationManagementServiceProxy()
        {
            try
            {
                await stewardClient.TestLocalizationManagementServiceProxy().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestLocalizationManagementServiceProxy_InvalidAuth()
        {
            try
            {
                await unauthedClient.TestLocalizationManagementServiceProxy().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestUserManagementServiceProxy()
        {
            try
            {
                await stewardClient.TestUserManagementServiceProxy().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestUserManagementServiceProxy_InvalidAuth()
        {
            try
            {
                await unauthedClient.TestUserManagementServiceProxy().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestUserInventoryManagementServiceProxy()
        {
            try
            {
                await stewardClient.TestUserInventoryManagementServiceProxy().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestUserInventoryManagementServiceProxy_InvalidAuth()
        {
            try
            {
                await unauthedClient.TestUserInventoryManagementServiceProxy().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestStorefrontManagementServiceProxy()
        {
            try
            {
                await stewardClient.TestStorefrontManagementServiceProxy().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestStorefrontManagementServiceProxy_InvalidAuth()
        {
            try
            {
                await unauthedClient.TestStorefrontManagementServiceProxy().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestNotificationManagementServiceProxy()
        {
            try
            {
                await stewardClient.TestNotificationManagementServiceProxy().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestNotificationManagementServiceProxy_InvalidAuth()
        {
            try
            {
                await unauthedClient.TestNotificationManagementServiceProxy().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestPermissionsManagementServiceProxy()
        {
            try
            {
                await stewardClient.TestPermissionsManagementServiceProxy().ConfigureAwait(false);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task TestPermissionsManagementServiceProxy_InvalidAuth()
        {
            try
            {
                await unauthedClient.TestPermissionsManagementServiceProxy().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }
    }
}
