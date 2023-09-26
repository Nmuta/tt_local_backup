using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Net;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;
using Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class CmsOverrideControllerTests : SteelheadControllerTestsBase
    {
        private static CmsOverrideControllerTestingClient stewardClient;
        private static CmsOverrideControllerTestingClient unauthedClient;
        private static ForzaCMSOverride cms;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new CmsOverrideControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new CmsOverrideControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            cms = new ForzaCMSOverride()
            {
                Environment = string.Empty,
                Slot = string.Empty,
                Snapshot = string.Empty
            };
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerCmsOverride()
        {
            try
            {
                var response = await stewardClient.GetPlayerCmsOverride(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerCmsOverride_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetPlayerCmsOverride(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerCmsOverride_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayerCmsOverride(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SetPlayerCmsOverride_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.SetPlayerCmsOverride(TestConstants.TestAccountXuid, cms).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeletePlayerCmsOverride_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.DeletePlayerCmsOverride(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
