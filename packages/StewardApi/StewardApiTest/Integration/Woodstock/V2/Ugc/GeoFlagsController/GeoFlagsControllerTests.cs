using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock.V2
{
    [TestClass]
    public sealed class GeoFlagsControllerTests : WoodstockControllerTestsBase
    {
        private static GeoFlagsControllerTestingClient stewardClient;
        private static GeoFlagsControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new GeoFlagsControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new GeoFlagsControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSetGeoFlag_InvalidUgcId()
        {
            try
            {
                await stewardClient.PostSetGeoFlag(TestConstants.InvalidUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSetGeoFlag_InvalidAuth()
        {
            try
            {
                await unauthedClient.PostSetGeoFlag(TestConstants.ValidWoodstockLiveryUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
