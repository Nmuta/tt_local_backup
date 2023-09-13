using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;
using Turn10.Services.LiveOps.FM8.Generated;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class ApiPermissionsTests : SteelheadControllerTestsBase
    {
        private static ApiPermissionsTestingClient stewardClient;
        private static ApiPermissionsTestingClient unauthedClient;

        private int deviceRegion = 0;
        private int startAt = 0;
        private int maxResults = 0;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new ApiPermissionsTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new ApiPermissionsTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetServicesApiPermissions()
        {
            try
            {
                var response = await stewardClient.GetServicesApiPermissions(this.deviceRegion, this.startAt, this.maxResults).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetServicesApiPermissions_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetServicesApiPermissions(this.deviceRegion, this.startAt, this.maxResults).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SetServicesApiPermissions_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.SetServicesApiPermissions(Array.Empty<ForzaLiveOpsPermissionsUpdateParameters>()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
