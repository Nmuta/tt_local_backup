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
    public sealed class FeaturedStatusControllerTests : SteelheadControllerTestsBase
    {
        private static FeaturedStatusControllerTestingClient stewardClient;
        private static FeaturedStatusControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new FeaturedStatusControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new FeaturedStatusControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSetUgcGeoFlags_InvalidUgcId()
        {
            try
            {
                var response = await stewardClient.PostSetUgcGeoFlags(TestConstants.InvalidUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSetUgcGeoFlags_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostSetUgcGeoFlags(TestConstants.TestAccountUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
