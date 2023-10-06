using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Net;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class FeaturedStatusControllerTests : SteelheadControllerTestsBase
    {
        private static FeaturedStatusControllerTestingClient stewardClient;
        private static FeaturedStatusControllerTestingClient unauthedClient;
        private static UgcFeaturedStatus status;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new FeaturedStatusControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new FeaturedStatusControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            status = new UgcFeaturedStatus()
            {
                IsFeatured = false
            };
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SetUgcFeaturedStatus_InvalidUgcId()
        {
            try
            {
                var response = await stewardClient.SetUgcFeaturedStatus(TestConstants.InvalidUgcId, status).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SetUgcFeaturedStatus_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.SetUgcFeaturedStatus(TestConstants.TestAccountUgcId, status).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
