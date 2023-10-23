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
    public sealed class ApiControllerTests : WoodstockControllerTestsBase
    {
        private static ApiControllerTestingClient stewardClient;
        private static ApiControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new ApiControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new ApiControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetApiPermissions()
        {
            try
            {
                var response = await stewardClient.GetApiPermissions().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetApiPermissions_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetApiPermissions().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
