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
    public sealed class ServicesTableStorageControllerTests : SteelheadControllerTestsBase
    {
        private static ServicesTableStorageControllerTestingClient stewardClient;
        private static ServicesTableStorageControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new ServicesTableStorageControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new ServicesTableStorageControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetTableStorage()
        {
            try
            {
                var response = await stewardClient.GetTableStorage(TestConstants.TestAccountXuid, TestConstants.TestAccountExternalProfileId).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetTableStorage_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetTableStorage(TestConstants.InvalidXuid, TestConstants.TestAccountExternalProfileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetTableStorage_InvalidProfileId()
        {
            try
            {
                var response = await stewardClient.GetTableStorage(TestConstants.TestAccountXuid, TestConstants.InvalidProfileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetTableStorage_InvalidParams()
        {
            try
            {
                var response = await stewardClient.GetTableStorage(TestConstants.InvalidXuid, TestConstants.InvalidProfileId.ToString()).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetTableStorage_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetTableStorage(TestConstants.TestAccountXuid, TestConstants.TestAccountExternalProfileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
