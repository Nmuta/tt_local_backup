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
    public sealed class UgcControllerTests : SteelheadControllerTestsBase
    {
        private static UgcControllerTestingClient stewardClient;
        private static UgcControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new UgcControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new UgcControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUgcItems()
        {
            try
            {
                var response = await stewardClient.GetUgcItems(TestConstants.TestAccountXuid, "Livery").ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUgcItems_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetUgcItems(TestConstants.InvalidXuid, "Livery").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUgcItems_InvalidUgcType()
        {
            try
            {
                var response = await stewardClient.GetUgcItems(TestConstants.TestAccountXuid, "VeryRealUgcType").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUgcItems_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetUgcItems(TestConstants.TestAccountXuid, "Livery").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetHiddenUgcItems()
        {
            try
            {
                var response = await stewardClient.GetHiddenUgcItems(TestConstants.TestAccountXuid, "Livery").ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetHiddenUgcItems_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetHiddenUgcItems(TestConstants.InvalidXuid, "Livery").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetHiddenUgcItems_InvalidUgcType()
        {
            try
            {
                var response = await stewardClient.GetHiddenUgcItems(TestConstants.TestAccountXuid, "VeryRealUgcType").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetHiddenUgcItems_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetHiddenUgcItems(TestConstants.TestAccountXuid, "Livery").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
