using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Steelhead;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class FlagsControllerTests : SteelheadControllerTestsBase
    {
        private static FlagsControllerTestingClient stewardClient;
        private static FlagsControllerTestingClient unauthedClient;

        private static SteelheadUserFlagsInput flags;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new FlagsControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new FlagsControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            flags = new SteelheadUserFlagsInput
            {
                IsGamecoreVip = true,
                IsGamecoreUltimateVip = true,
                IsSteamVip = false,
                IsSteamUltimateVip = false,
                IsTurn10Employee = true,
                IsEarlyAccess = false,
                IsUnderReview = false,
                IsRaceMarshall = false,
                IsContentCreator = false,
                IsCommunityManager = false
            };
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFlags()
        {
            try
            {
                var response = await stewardClient.GetFlags(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFlags_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetFlags(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFlags_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetFlags(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        [Ignore]
        public async Task SetFlags()
        {
            try
            {
                var response = await stewardClient.SetFlags(TestConstants.TestAccountXuid, flags).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task SetFlags_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.SetFlags(TestConstants.TestAccountXuid, flags).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
        [TestMethod]
        [IntegrationTest]
        public async Task SetFlags_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.SetFlags(TestConstants.InvalidXuid, flags).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }
    }
}
