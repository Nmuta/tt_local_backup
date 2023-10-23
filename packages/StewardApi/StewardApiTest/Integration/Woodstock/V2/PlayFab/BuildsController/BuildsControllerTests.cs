using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock.V2
{
    [TestClass]
    public sealed class BuildsControllerTests : WoodstockControllerTestsBase
    {
        private static BuildsControllerTestingClient stewardClient;
        private static BuildsControllerTestingClient unauthedClient;

        private static string buildId = "120c2beb-0ca4-4661-a95a-2659b64092cd";
        private static string invalidBuildId = "TotallyRealBuildId";

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new BuildsControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new BuildsControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayFabBuilds()
        {
            try
            {
                var response = await stewardClient.GetPlayFabBuilds().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayFabBuilds_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayFabBuilds().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayFabBuild()
        {
            try
            {
                var response = await stewardClient.GetPlayFabBuild(buildId).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayFabBuild_InvalidBuildId()
        {
            try
            {
                var response = await stewardClient.GetPlayFabBuild(invalidBuildId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayFabBuild_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayFabBuild(buildId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayFabBuildLocks()
        {
            try
            {
                var response = await stewardClient.GetPlayFabBuildLocks().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayFabBuildLocks_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayFabBuildLocks().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostLockPlayFabBuild_InvalidBuildId()
        {
            try
            {
                var response = await stewardClient.PostLockPlayFabBuild(invalidBuildId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostLockPlayFabBuild_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostLockPlayFabBuild(buildId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeleteLockedPlayFabBuild_InvalidBuildId()
        {
            try
            {
                var response = await stewardClient.DeleteLockedPlayFabBuild(invalidBuildId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeleteLockedPlayFabBuild_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.DeleteLockedPlayFabBuild(buildId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
