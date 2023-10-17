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
    public sealed class CloneToDevControllerTests : WoodstockControllerTestsBase
    {
        private static CloneToDevControllerTestingClient stewardClient;
        private static CloneToDevControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new CloneToDevControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new CloneToDevControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostCloneToDev_InvalidUgcId()
        {
            try
            {
                var response = await stewardClient.PostCloneToDev(TestConstants.InvalidUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostCloneToDev_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostCloneToDev(TestConstants.ValidWoodstockLiveryUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
