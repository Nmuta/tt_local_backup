﻿using Microsoft.VisualStudio.TestTools.UnitTesting;
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
        public async Task PostSearchUgc_InvalidUgcType()
        {
            try
            {
                var response = await stewardClient.PostSearchUgc(TestConstants.InvalidUgcType).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.UnsupportedMediaType, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostSearchUgc_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostSearchUgc("Livery").ConfigureAwait(false);
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
                var response = await stewardClient.GetLiveryUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
                Assert.IsNotNull(response);
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
                var response = await unauthedClient.GetLiveryUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
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
                var response = await stewardClient.GetPhotoUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
                Assert.IsNotNull(response);
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
                var response = await unauthedClient.GetPhotoUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
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
                var response = await stewardClient.GetTuneBlobUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
                Assert.IsNotNull(response);
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
                var response = await unauthedClient.GetTuneBlobUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
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
                var response = await stewardClient.GetLayerGroupUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
                Assert.IsNotNull(response);
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
                var response = await unauthedClient.GetLayerGroupUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetGameOptionsUgc()
        {
            try
            {
                var response = await stewardClient.GetLayerGroupUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

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
                var response = await unauthedClient.GetGameOptionsUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
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
                var response = await stewardClient.GetReplayUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
                Assert.IsNotNull(response);
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
                var response = await unauthedClient.GetReplayUgc(TestConstants.TestAccountUgcId).ConfigureAwait(false);
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
                var response = await stewardClient.GetSharecodeUgc(TestConstants.ValidSharecode).ConfigureAwait(false);
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
                var response = await stewardClient.GetSharecodeUgc(TestConstants.InvalidSharecode).ConfigureAwait(false);
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
                var response = await unauthedClient.GetSharecodeUgc(TestConstants.ValidSharecode).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
