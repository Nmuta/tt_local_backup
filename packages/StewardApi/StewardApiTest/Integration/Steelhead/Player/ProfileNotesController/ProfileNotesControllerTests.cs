using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SteelheadContent;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class ProfileNotesControllerTests : SteelheadControllerTestsBase
    {
        private static ProfileNotesControllerTestingClient stewardClient;
        private static ProfileNotesControllerTestingClient unauthedClient;

        private static string testProfileNote;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new ProfileNotesControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new ProfileNotesControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            testProfileNote = "Test note";
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetProfileNotesAsync_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetProfileNotesAsync(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetProfileNotesAsync_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetProfileNotesAsync(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task AddProfileNoteAsync_InvalidAuth()
        {
            try
            {
                await unauthedClient.AddProfileNoteAsync(TestConstants.TestAccountXuid, testProfileNote).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task AddProfileNoteAsync_InvalidXuid()
        {
            try
            {
                await stewardClient.AddProfileNoteAsync(TestConstants.InvalidXuid, testProfileNote).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }
    }
}
