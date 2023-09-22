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
    public sealed class PaidEntitlementsControllerTests : SteelheadControllerTestsBase
    {
        private static PaidEntitlementsControllerTestingClient stewardClient;
        private static PaidEntitlementsControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new PaidEntitlementsControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new PaidEntitlementsControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPaidEntitlements()
        {
            try
            {
                var response = await stewardClient.GetPaidEntitlements(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPaidEntitlements_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetPaidEntitlements(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPaidEntitlements_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPaidEntitlements(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PutPaidEntitlement_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PutPaidEntitlement(TestConstants.TestAccountXuid, TestConstants.ValidProductId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
