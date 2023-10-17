using Forza.WebServices.FMG.Generated;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Woodstock.V2
{
    [TestClass]
    public sealed class SearchControllerTests : WoodstockControllerTestsBase
    {
        private static SearchControllerTestingClient stewardClient;
        private static SearchControllerTestingClient unauthedClient;

        private static string defaultUgcType = "Livery";

        private static UgcSearchFilters defaultFilters;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new SearchControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new SearchControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            defaultFilters = new UgcSearchFilters();
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.Get(defaultUgcType, defaultFilters).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUgc_InvalidUgcType()
        {
            try
            {
                var response = await stewardClient.Get(TestConstants.InvalidUgcType, defaultFilters).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetUgc()
        {
            try
            {
                var response = await stewardClient.Get(defaultUgcType, defaultFilters).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetCuratedUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetCurated(defaultUgcType, TestConstants.ValidCuratedUgcType).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetCuratedUgc_InvalidUgcType()
        {
            try
            {
                var response = await stewardClient.GetCurated(TestConstants.InvalidUgcType, TestConstants.ValidCuratedUgcType).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetCuratedUgc()
        {
            try
            {
                var response = await stewardClient.GetCurated(defaultUgcType, TestConstants.ValidCuratedUgcType).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }
    }
}
