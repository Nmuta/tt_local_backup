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
    public sealed class ProfileTemplatesControllerTests : SteelheadControllerTestsBase
    {
        private static ProfileTemplatesControllerTestingClient stewardClient;
        private static ProfileTemplatesControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new ProfileTemplatesControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new ProfileTemplatesControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetProfileTemplates()
        {
            try
            {
                var response = await stewardClient.GetProfileTemplates().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetProfileTemplates_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetProfileTemplates().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
