using Microsoft.Azure.Documents.Spatial;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Net;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class EditControllerTests : SteelheadControllerTestsBase
    {
        private static EditControllerTestingClient stewardClient;
        private static EditControllerTestingClient unauthedClient;
        private static UgcEditInput edit;
        private static UgcEditStatsInput stats;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new EditControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new EditControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            edit = new UgcEditInput()
            {
                Title = string.Empty,
                Description = string.Empty
            };

            stats = new UgcEditStatsInput()
            {
                Downloaded = 0,
                Liked = 0,
                Used = 0,
                Disliked = 0
            };
        }

        [TestMethod]
        [IntegrationTest]
        public async Task EditUgcTitleAndDescription_InvalidUgcId()
        {
            try
            {
                await stewardClient.EditUgcTitleAndDescription(TestConstants.InvalidUgcId, edit).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task EditUgcTitleAndDescription_InvalidAuth()
        {
            try
            {
                await unauthedClient.EditUgcTitleAndDescription(TestConstants.TestAccountUgcId, edit).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task EditUgcStats_InvalidUgcId()
        {
            try
            {
                await stewardClient.EditUgcStats(TestConstants.InvalidUgcId, stats).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task EditUgcStats_InvalidAuth()
        {
            try
            {
                await unauthedClient.EditUgcStats(TestConstants.TestAccountUgcId, stats).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
