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
    public sealed class MessagesControllerTests : SteelheadControllerTestsBase
    {
        private static MessagesControllerTestingClient stewardClient;
        private static MessagesControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new MessagesControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new MessagesControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUserGroupMessages()
        {
            try
            {
                var response = await stewardClient.GetUserGroupMessages(31).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUserGroupMessages_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetUserGroupMessages(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUserGroupMessages_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetUserGroupMessages(31).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }


        [TestMethod]
        [IntegrationTest]
        public async Task PostUserGroupMessage_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostUserGroupMessage(31).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostEditUserGroupMessage_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostEditUserGroupMessage(31, 1).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeleteUserGroupMessage_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.DeleteUserGroupMessage(31, 1).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
