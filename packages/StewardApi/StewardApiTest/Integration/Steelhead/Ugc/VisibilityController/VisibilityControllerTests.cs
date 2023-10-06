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
    public sealed class VisibilityControllerTests : SteelheadControllerTestsBase
    {
        private static VisibilityControllerTestingClient stewardClient;
        private static VisibilityControllerTestingClient unauthedClient;

        private string[] invalidUgcArray = { TestConstants.InvalidUgcId };

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new VisibilityControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new VisibilityControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task MakeUgcPrivate_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.MakeUgcPrivate(this.invalidUgcArray).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task MakeUgcPrivate_InvalidGuid()
        {
            try
            {
                var response = await stewardClient.MakeUgcPrivate(this.invalidUgcArray).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task MakeUgcPrivateBackground_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.MakeUgcPrivateBackground(this.invalidUgcArray).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task MakeUgcPrivateBackground_InvalidGuid()
        {
            try
            {
                var response = await stewardClient.MakeUgcPrivateBackground(this.invalidUgcArray).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task MakeUgcPublic_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.MakeUgcPublic(this.invalidUgcArray).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task MakeUgcPublic_InvalidGuid()
        {
            try
            {
                var response = await stewardClient.MakeUgcPublic(this.invalidUgcArray).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task MakeUgcPublicBackground_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.MakeUgcPublicBackground(this.invalidUgcArray).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task MakeUgcPublicBackground_InvalidGuid()
        {
            try
            {
                var response = await stewardClient.MakeUgcPublicBackground(this.invalidUgcArray).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }
    }
}
