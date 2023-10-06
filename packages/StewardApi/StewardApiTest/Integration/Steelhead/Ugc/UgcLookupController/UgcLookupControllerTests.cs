using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Steelhead
{
    [TestClass]
    public sealed class UgcLookupControllerTests : SteelheadControllerTestsBase
    {
        private static UgcLookupControllerTestingClient stewardClient;
        private static UgcLookupControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new UgcLookupControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new UgcLookupControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchUgc()
        {
            try
            {
                var response = await stewardClient.PostSearchUgc("Livery", TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchUgc_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.PostSearchUgc("Livery", TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.IsTrue(response.Count == 0);
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchUgc_InvalidUgcType()
        {
            try
            {
                var response = await stewardClient.PostSearchUgc(TestConstants.InvalidUgcType, TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostSearchUgc("Livery", TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSearchCuratedUgc()
        {
            try
            {
                var response = await stewardClient.GetSearchCuratedUgc("Livery", TestConstants.ValidCuratedUgcType).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSearchCuratedUgc_InvalidUgcType()
        {
            try
            {
                var response = await stewardClient.GetSearchCuratedUgc(TestConstants.InvalidUgcType, TestConstants.ValidCuratedUgcType).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSearchCuratedUgc_InvalidCuratedUgcType()
        {
            try
            {
                var response = await stewardClient.GetSearchCuratedUgc("Livery", TestConstants.InvalidCuratedUgcType).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSearchCuratedUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetSearchCuratedUgc("Livery", TestConstants.ValidCuratedUgcType).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLiveryUgc()
        {
            try
            {
                var response = await stewardClient.GetLiveryUgc(TestConstants.ValidLiveryUgcId).ConfigureAwait(false);
                Assert.IsTrue(response.Type == UgcType.Livery);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLiveryUgc_InvalidUgcId()
        {
            try
            {
                var response = await stewardClient.GetLiveryUgc(TestConstants.InvalidUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLiveryUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetLiveryUgc(TestConstants.ValidLiveryUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPhotoUgc()
        {
            try
            {
                var response = await stewardClient.GetPhotoUgc(TestConstants.ValidPhotoUgcId).ConfigureAwait(false);
                Assert.IsTrue(response.Type == UgcType.Photo);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPhotoUgc_InvalidUgcId()
        {
            try
            {
                var response = await stewardClient.GetPhotoUgc(TestConstants.InvalidUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPhotoUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPhotoUgc(TestConstants.ValidPhotoUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPhotoThumbnail_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostPhotoThumbnail().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetTuneBlobUgc()
        {
            try
            {
                var response = await stewardClient.GetTuneBlobUgc(TestConstants.ValidTuneBlobUgcId).ConfigureAwait(false);
                Assert.IsTrue(response.Type == UgcType.TuneBlob);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetTuneBlobUgc_InvalidUgcId()
        {
            try
            {
                var response = await stewardClient.GetTuneBlobUgc(TestConstants.InvalidUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetTuneBlobUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetTuneBlobUgc(TestConstants.ValidTuneBlobUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLayerGroupUgc()
        {
            try
            {
                var response = await stewardClient.GetLayerGroupUgc(TestConstants.ValidLayerGroupUgcId).ConfigureAwait(false);
                Assert.IsTrue(response.Type == UgcType.LayerGroup);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLayerGroupUgc_InvalidUgcId()
        {
            try
            {
                var response = await stewardClient.GetLayerGroupUgc(TestConstants.InvalidUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetLayerGroupUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetLayerGroupUgc(TestConstants.ValidLayerGroupUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        // TODO: Needs a Valid GameOptions UGC
        //[TestMethod]
        //[IntegrationTest]
        //public async Task GetGameOptionsUgc()
        //{
        //    try
        //    {
        //        var response = await stewardClient.GetLayerGroupUgc(TestConstants.ValidGameOptionsUgcId).ConfigureAwait(false);
        //        Assert.IsTrue(response.Type == UgcType.GameOptions);
        //    }
        //    catch (ServiceException ex)
        //    {
        //        Assert.Fail(ex.ResponseBody);
        //    }
        //}

        [TestMethod]
        [IntegrationTest]
        public async Task GetGameOptionsUgc_InvalidUgcId()
        {
            try
            {
                var response = await stewardClient.GetGameOptionsUgc(TestConstants.InvalidUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetGameOptionsUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetGameOptionsUgc(TestConstants.ValidGameOptionsUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetReplayUgc()
        {
            try
            {
                var response = await stewardClient.GetReplayUgc(TestConstants.ValidReplayUgcId).ConfigureAwait(false);
                Assert.IsTrue(response.Type == UgcType.Replay);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetReplayUgc_InvalidUgcId()
        {
            try
            {
                var response = await stewardClient.GetReplayUgc(TestConstants.InvalidUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetReplayUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetReplayUgc(TestConstants.ValidReplayUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSharecodeUgc()
        {
            try
            {
                var response = await stewardClient.GetSharecodeUgc(TestConstants.ValidSharecode, "Livery").ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSharecodeUgc_InvalidSharecode()
        {
            try
            {
                var response = await stewardClient.GetSharecodeUgc(TestConstants.InvalidSharecode, "Livery").ConfigureAwait(false);
                Assert.IsTrue(response.Count == 0);
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSharecodeUgc_InvalidUgcType()
        {
            try
            {
                var response = await stewardClient.GetSharecodeUgc(TestConstants.ValidSharecode, TestConstants.InvalidUgcType).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetSharecodeUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetSharecodeUgc(TestConstants.ValidSharecode, "Livery").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
