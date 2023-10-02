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
    public sealed class IdentitiesControllerTests : SteelheadControllerTestsBase
    {
        private static IdentitiesControllerTestingClient stewardClient;
        private static IdentitiesControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new IdentitiesControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new IdentitiesControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchPlayersIdentities_ByXuid()
        {
            try
            {
                var response = await stewardClient.PostSearchPlayersIdentitiesByXuid(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchPlayersIdentities_ByXuid_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.PostSearchPlayersIdentitiesByXuid(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.IsTrue(response.Any(x => x.Error != null));
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchPlayersIdentities_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostSearchPlayersIdentitiesByXuid(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchPlayersIdentities_ByGamerTag()
        {
            try
            {
                var response = await stewardClient.PostSearchPlayersIdentitiesByGamerTag(TestConstants.TestAccountGamertag).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchPlayersIdentities_ByGamerTag_InvalidGamerTag()
        {
            try
            {
                var response = await stewardClient.PostSearchPlayersIdentitiesByGamerTag(TestConstants.InvalidGamertag).ConfigureAwait(false);
                Assert.IsTrue(response.Any(x => x.Error != null));
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchPlayersIdentities_ByGamerTag_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostSearchPlayersIdentitiesByGamerTag(TestConstants.TestAccountGamertag).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
