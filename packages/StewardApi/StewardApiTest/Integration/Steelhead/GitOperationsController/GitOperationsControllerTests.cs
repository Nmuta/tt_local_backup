using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.TeamFoundation.SourceControl.WebApi;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class GitOperationsControllerTests : SteelheadControllerTestsBase
    {
        private static GitOperationsControllerTestingClient stewardClient;
        private static GitOperationsControllerTestingClient unauthedClient;
        private static PullRequestStatus status;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new GitOperationsControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new GitOperationsControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            status = PullRequestStatus.All;
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPullRequestsAsync()
        {
            try
            {
                var response = await stewardClient.GetPullRequests(status).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPullRequestsAsync_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPullRequests(status).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetAllBranchesAsync()
        {
            try
            {
                var response = await stewardClient.GetAllBranches().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetAllBranchesAsync_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetAllBranches().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
