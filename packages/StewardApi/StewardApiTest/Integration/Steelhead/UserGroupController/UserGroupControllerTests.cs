using Forza.WebServices.MixerObjects.FH4.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class UserGroupControllerTests : SteelheadControllerTestsBase
    {
        private static UserGroupControllerTestingClient stewardClient;
        private static UserGroupControllerTestingClient unauthedClient;
        private static UpdateUserGroupInput testUpdateUserGroupInput;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new UserGroupControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new UserGroupControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
            testUpdateUserGroupInput = new UpdateUserGroupInput { Xuids = new[] { TestConstants.TestAccountXuid } };
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUserGroups()
        {
            try
            {
                var response = await stewardClient.GetUserGroups().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUserIsInGroup()
        {
            try
            {
                var response = await stewardClient.GetUserIsInGroup(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId, TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUserIsInGroup_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetUserIsInGroup(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId, TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBulkOperationStatus()
        {
            try
            {
                var response = await stewardClient.GetBulkOperationStatus(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId, 1).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBulkOperationStatus_InvalidOpId()
        {
            try
            {
                var response = await stewardClient.GetBulkOperationStatus(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId, 1).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUsersInGroup()
        {
            try
            {
                var response = await stewardClient.GetUsersInGroup(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUsersInGroup_InvalidGroupId()
        {
            try
            {
                var response = await stewardClient.GetUsersInGroup(TestConstants.InvalidGrouId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUserGroups_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetUserGroups().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUserIsInGroup_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetUserIsInGroup(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId, TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBulkOperationStatus_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetBulkOperationStatus(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId, 1).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUsersInGroup_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetUsersInGroup(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostCreateUserGroup_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostCreateUserGroup("TotallyRealGroupName").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostAddUserToGroup_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostAddUsersToGroup(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId, testUpdateUserGroupInput).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostRemoveUsersFromGroup_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostRemoveUsersFromGroup(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId, testUpdateUserGroupInput).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostRemoveAllUsersFromGroup_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostRemoveAllUsersFromGroup(TestConstants.LiveOpsLeaderboardTalentedPlayersGroupId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
