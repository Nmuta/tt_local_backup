using System;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class PlayersBanControllerTests : SteelheadControllerTestsBase
    {
        private static PlayersBanControllerTestingClient stewardClient;
        private static PlayersBanControllerTestingClient unauthedClient;

        private V2BanParametersInput defaultBanParameters = new V2BanParametersInput()
        {
            ReasonGroupName = "Developer",
            Reason = "Testing",
            Xuid = TestConstants.InvalidXuid,
            DeleteLeaderboardEntries = false,
            Override = false,
            OverrideDuration = new TimeSpan(1),
            OverrideDurationPermanent = false,
            OverrideBanConsoles = false
        };

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new PlayersBanControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new PlayersBanControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanReasonGroups()
        {
            try
            {
                var response = await stewardClient.GetBanReasonGroups().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanReasonGroups_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetBanReasonGroups().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanConfigurations()
        {
            try
            {
                var response = await stewardClient.GetBanConfigurations().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetBanConfigurations_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetBanConfigurations().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task BanPlayers_InvalidAuth()
        {
            var banParameters = this.defaultBanParameters;
            banParameters.Xuid = TestConstants.InvalidXuid;

            var banInput = new List<V2BanParametersInput> { banParameters };

            try
            {
                var response = await unauthedClient.BanPlayers(banInput).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task BanPlayers_InvalidXuid()
        {
            var banParameters = this.defaultBanParameters;
            banParameters.Xuid = TestConstants.InvalidXuid;

            var banInput = new List<V2BanParametersInput> { banParameters };

            try
            {
                var response = await stewardClient.BanPlayers(banInput).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task BanPlayersBackground_InvalidAuth()
        {
            var banParameters = this.defaultBanParameters;
            banParameters.Xuid = TestConstants.InvalidXuid;

            var banInput = new List<V2BanParametersInput> { banParameters };

            try
            {
                var response = await unauthedClient.BanPlayersBackground(banInput).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task BanPlayersBackground_InvalidXuid()
        {
            var banParameters = this.defaultBanParameters;
            banParameters.Xuid = TestConstants.InvalidXuid;

            var banInput = new List<V2BanParametersInput> { banParameters };

            try
            {
                var response = await stewardClient.BanPlayersBackground(banInput).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

    }
}
