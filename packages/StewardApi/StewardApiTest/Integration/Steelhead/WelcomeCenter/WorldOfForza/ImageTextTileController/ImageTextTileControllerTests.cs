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
    public sealed class ImageTextTileControllerTests : SteelheadControllerTestsBase
    {
        private static ImageTextTileControllerTestingClient stewardClient;
        private static ImageTextTileControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new ImageTextTileControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new ImageTextTileControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetAllImageTextTileEntries()
        {
            try
            {
                var response = await stewardClient.GetAllImageTextTileEntries().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetAllImageTextTileEntries_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetAllImageTextTileEntries().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetImageTextTileEntry()
        {
            try
            {
                var response = await stewardClient.GetImageTextTileEntry(TestConstants.ValidTextTileId).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetImageTextTileEntry_InvalidId()
        {
            try
            {
                var response = await stewardClient.GetImageTextTileEntry(TestConstants.InvalidXuid.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetImageTextTileEntry_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetImageTextTileEntry(TestConstants.ValidTextTileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostEditImageTextTileEntry_InvalidId()
        {
            try
            {
                var response = await stewardClient.PostEditImageTextTileEntry(TestConstants.InvalidXuid.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostEditImageTextTileEntry_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostEditImageTextTileEntry(TestConstants.ValidTextTileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
