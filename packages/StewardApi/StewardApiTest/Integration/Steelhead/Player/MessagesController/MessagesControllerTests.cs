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
    public sealed class PlayerMessagesControllerTests : SteelheadControllerTestsBase
    {
        private static PlayerMessagesControllerTestingClient stewardClient;
        private static PlayerMessagesControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new PlayerMessagesControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new PlayerMessagesControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerMessages()
        {
            try
            {
                var response = await stewardClient.GetPlayerMessages(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerMessages_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetPlayerMessages(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerMessage()
        {
            try
            {
                var response = await stewardClient.GetPlayerMessage(TestConstants.TestAccountXuid, TestConstants.TestAccountMessageId).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerMessage_InvalidMessageId()
        {
            try
            {
                var response = await stewardClient.GetPlayerMessage(TestConstants.InvalidXuid, "VeryRealMessageId").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerMessages_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayerMessages(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeletePlayerMessages_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.DeletePlayerMessages(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerMessage_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayerMessage(TestConstants.TestAccountXuid, TestConstants.TestAccountMessageId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostEditPlayerMessage_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostEditPlayerMessage(TestConstants.TestAccountXuid, TestConstants.TestAccountMessageId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeletePlayerMessage_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.DeletePlayerMessage(TestConstants.TestAccountXuid, TestConstants.TestAccountMessageId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
