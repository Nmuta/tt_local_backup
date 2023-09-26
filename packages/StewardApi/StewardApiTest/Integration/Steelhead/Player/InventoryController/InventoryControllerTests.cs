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
    public sealed class InventoryControllerTests : SteelheadControllerTestsBase
    {
        private static InventoryControllerTestingClient stewardClient;
        private static InventoryControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new InventoryControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new InventoryControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventory()
        {
            try
            {
                var response = await stewardClient.GetPlayerInventory(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventory_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetPlayerInventory(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventory_ProfileId()
        {
            try
            {
                var response = await stewardClient.GetPlayerInventoryByProfileId(TestConstants.TestAccountXuid, TestConstants.TestAccountProfileId).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventory_ProfileId_InvalidProfileId()
        {
            try
            {
                var response = await stewardClient.GetPlayerInventoryByProfileId(TestConstants.TestAccountXuid, 1000000).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventory_SpecificCar()
        {
            try
            {
                var response = await stewardClient.GetPlayerInventorySpecificCar(TestConstants.TestAccountXuid, TestConstants.TestAccountProfileId, TestConstants.TestAccountKnownVin).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventory_SpecificCar_InvalidVin()
        {
            try
            {
                var response = await stewardClient.GetPlayerInventorySpecificCar(TestConstants.TestAccountXuid, TestConstants.TestAccountProfileId, "VeryRealVin").ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventoryProfiles()
        {
            try
            {
                var response = await stewardClient.GetPlayerInventoryProfiles(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventoryProfiles_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetPlayerInventoryProfiles(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventory_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayerInventory(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventory_ProfileId_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayerInventoryByProfileId(TestConstants.TestAccountXuid, TestConstants.TestAccountProfileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventory_SpecificCar_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayerInventorySpecificCar(TestConstants.TestAccountXuid, TestConstants.TestAccountProfileId, TestConstants.TestAccountKnownVin).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetPlayerInventoryProfiles_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetPlayerInventoryProfiles(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task PostEditPlayerInventory_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.PostEditPlayerInventory(TestConstants.TestAccountXuid, TestConstants.TestAccountExternalProfileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task DeletePlayerInventoryItems_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.DeletePlayerInventoryItems(TestConstants.TestAccountXuid, TestConstants.TestAccountExternalProfileId).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
