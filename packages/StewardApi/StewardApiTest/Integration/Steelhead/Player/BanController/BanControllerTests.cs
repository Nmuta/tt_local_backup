using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class BanControllerTests : SteelheadControllerTestsBase
    {
        private static BanControllerTestingClient stewardClient;
        private static BanControllerTestingClient unauthedClient;

        // Suggest pulling BanReasonGroup out of Players/BanController class.
        // This Guid refers to the BanReasonGroup - "Developer" 
        private Guid banconfig = new Guid("c8ec2fac-6132-4c87-85dc-1b799e08aca4");
        private Guid invalidBanconfig = new Guid("55555555-5555-5555-5555-555555555555");

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new BanControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new BanControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetNextBanDuration()
        {
            try
            {
                var response = await stewardClient.GetNextBanDuration(TestConstants.TestAccountXuid, this.banconfig).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetNextBanDuration_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetNextBanDuration(TestConstants.InvalidXuid, this.banconfig).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetNextBanDuration_InvalidBanconfig()
        {
            try
            {
                var response = await stewardClient.GetNextBanDuration(TestConstants.TestAccountXuid, this.invalidBanconfig).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetNextBanDuration_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetNextBanDuration(TestConstants.TestAccountXuid, this.banconfig).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
