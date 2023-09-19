using System;
using System.Net;
using System.Threading.Tasks;
using Forza.Scoreboard.FM8.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class LeaderboardsControllerTests : SteelheadControllerTestsBase
    {
        private static LeaderboardsControllerTestingClient stewardClient;
        private static LeaderboardsControllerTestingClient unauthedClient;

        private static ScoreboardType scoreboardType = ScoreboardType.TimeAttack;
        private static ScoreType scoreType = ScoreType.Laptime;
        private static int trackId = 530;
        private static string pivotId = "2";
        private static string deviceTypes = "All";

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new LeaderboardsControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new LeaderboardsControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLeaderboards()
        {
            try
            {
                var response = await stewardClient.GetLeaderboards().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLeaderboards_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetLeaderboards().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLeaderboardMetadata()
        {
            try
            {
                var response = await stewardClient.GetLeaderboardMetadata(
                    scoreboardType,
                    scoreType,
                    trackId,
                    pivotId).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLeaderboardMetadata_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetLeaderboardMetadata(
                    scoreboardType,
                    scoreType,
                    trackId,
                    pivotId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLeaderboardScores()
        {
            try
            {
                var response = await stewardClient.GetLeaderboardScores(
                    scoreboardType,
                    scoreType,
                    trackId,
                    pivotId,
                    deviceTypes).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLeaderboardScores_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetLeaderboardScores(
                    scoreboardType,
                    scoreType,
                    trackId,
                    pivotId,
                    deviceTypes).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLeaderboardScoresAroundXuid()
        {
            try
            {
                var response = await stewardClient.GetLeaderboardScoresAroundXuid(
                    TestConstants.TestAccountXuid,
                    scoreboardType,
                    scoreType,
                    trackId,
                    pivotId,
                    deviceTypes).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLeaderboardScoresAroundXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetLeaderboardScoresAroundXuid(
                    TestConstants.TestAccountXuid,
                    scoreboardType,
                    scoreType,
                    trackId,
                    pivotId,
                    deviceTypes).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLeaderboardTalent()
        {
            try
            {
                var response = await stewardClient.GetLeaderboardTalent().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLeaderboardTalent_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetLeaderboardTalent().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
