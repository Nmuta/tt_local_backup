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
    public sealed class LspTaskControllerTest : SteelheadControllerTestsBase
    {
        private static LspTaskControllerTestingClient stewardClient;
        private static LspTaskControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new LspTaskControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new LspTaskControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLspTaskList()
        {
            try
            {
                var response = await stewardClient.GetLspTaskList().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLspTaskList_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetLspTaskList().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
