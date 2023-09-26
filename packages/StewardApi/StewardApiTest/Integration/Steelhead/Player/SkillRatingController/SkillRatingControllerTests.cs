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
    public sealed class SkillRatingControllerTests : SteelheadControllerTestsBase
    {
        private static SkillRatingControllerTestingClient stewardClient;
        private static SkillRatingControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new SkillRatingControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new SkillRatingControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSkillRating()
        {
            try
            {
                var response = await stewardClient.GetSkillRating(TestConstants.TestAccountXuid, TestConstants.TestAccountExternalProfileId.ToString()).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSkillRating_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetSkillRating(TestConstants.InvalidXuid, TestConstants.TestAccountExternalProfileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSkillRating_InvalidProfileId()
        {
            try
            {
                var response = await stewardClient.GetSkillRating(TestConstants.TestAccountXuid, "VeryRealProfileId").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeleteSkillRating_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.DeleteSkillRating(TestConstants.InvalidXuid, TestConstants.TestAccountExternalProfileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeleteSkillRating_InvalidProfileId()
        {
            try
            {
                var response = await stewardClient.DeleteSkillRating(TestConstants.TestAccountXuid, "VeryRealProfileId").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSetSkillRating_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.PostSetSkillRating(TestConstants.InvalidXuid, TestConstants.TestAccountExternalProfileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSetSkillRating_InvalidProfileId()
        {
            try
            {
                var response = await stewardClient.PostSetSkillRating(TestConstants.TestAccountXuid, "VeryRealProfileId").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSkillRating_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetSkillRating(TestConstants.TestAccountXuid, TestConstants.TestAccountExternalProfileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeleteSkillRating_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.DeleteSkillRating(TestConstants.TestAccountXuid, TestConstants.TestAccountExternalProfileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSetSkillRating_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostSetSkillRating(TestConstants.TestAccountXuid, TestConstants.TestAccountExternalProfileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

    }
}
