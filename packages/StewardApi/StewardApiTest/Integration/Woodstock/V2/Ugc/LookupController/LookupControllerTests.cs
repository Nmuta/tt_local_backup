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
    public sealed class LookupControllerTests : WoodstockControllerTestsBase
    {
        private static LookupControllerTestingClient stewardClient;
        private static LookupControllerTestingClient unauthedClient;

        private static IList<string> validUgcIds;
        private static IList<string> invalidUgcIds;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new LookupControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new LookupControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            validUgcIds = new List<string>();
            validUgcIds.Add(TestConstants.ValidWoodstockLiveryUgcId);

            invalidUgcIds = new List<string>();
            invalidUgcIds.Add(TestConstants.InvalidUgcId);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchUgcItems_InvalidUgcId()
        {
            try
            {
                await stewardClient.PostSearchUgcItems(invalidUgcIds).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchUgcItems_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostSearchUgcItems(validUgcIds).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
