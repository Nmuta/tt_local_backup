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
    public sealed class ProfileControllerTests : SteelheadControllerTestsBase
    {
        private static ProfileControllerTestingClient stewardClient;
        private static ProfileControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new ProfileControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new ProfileControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSavePlayerProfile_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostSavePlayerProfile(TestConstants.TestAccountXuid, TestConstants.TestAccountProfileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostLoadPlayerProfile_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostLoadPlayerProfile(TestConstants.TestAccountXuid, TestConstants.TestAccountProfileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostResetPlayerProfile_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostResetPlayerProfile(TestConstants.TestAccountXuid, TestConstants.TestAccountProfileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
