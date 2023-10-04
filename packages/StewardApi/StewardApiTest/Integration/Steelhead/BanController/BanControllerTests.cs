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
    public sealed class SteelheadBanControllerTests : SteelheadControllerTestsBase
    {
        private static SteelheadBanControllerTestingClient stewardClient;
        private static SteelheadBanControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new SteelheadBanControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new SteelheadBanControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostExpireBan_InvalidBanEntryId()
        {
            try
            {
                await stewardClient.PostExpireBan(TestConstants.InvalidXuid.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostExpireBan_InvalidAuth()
        {
            try
            {
                await unauthedClient.PostExpireBan(TestConstants.TestAccountXuid.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeleteBan_InvalidBanEntryId()
        {
            try
            {
                await stewardClient.DeleteBan(TestConstants.InvalidXuid.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeleteBan_InvalidAuth()
        {
            try
            {
                await unauthedClient.DeleteBan(TestConstants.TestAccountXuid.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
