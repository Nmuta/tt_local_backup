using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Forza.WebServices.FMG.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardTest.Utilities;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class PlayerDetailsControllerTests : SteelheadControllerTestsBase
    {
        private static PlayerDetailsControllerTestingClient stewardClient;
        private static PlayerDetailsControllerTestingClient unauthedClient;
        private ulong xuid = 2675352635783107;
        private string gamertag = "Plink";

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await prepareAuthAsync(testContext);

            stewardClient = new PlayerDetailsControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new PlayerDetailsControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
            
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerDetails_ByXuid()
        {
            try
            {
                var response = await stewardClient.GetPlayerDetails(xuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerDetails_ByXuid_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetPlayerDetails(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerDetails_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayerDetails(xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerDetails_ByGamertag()
        {
            try
            {
                var response = await stewardClient.GetPlayerDetails(gamertag).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerDetails_ByGamertag_InvalidGamertag()
        {
            try
            {
                var response = await stewardClient.GetPlayerDetails(TestConstants.InvalidGamertag).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerDetails_ByGamertag_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayerDetails(gamertag).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerGameDetails_ByXuid()
        {
            try
            {
                var response = await stewardClient.GetPlayerGameDetails(xuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerGameDetails_ByXuid_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetPlayerGameDetails(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, ex.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task GetPlayerGameDetails_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayerGameDetails(xuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
