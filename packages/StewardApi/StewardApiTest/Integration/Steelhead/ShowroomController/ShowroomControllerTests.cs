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
    public sealed class ShowroomControllerTests : SteelheadControllerTestsBase
    {
        private static ShowroomControllerTestingClient stewardClient;
        private static ShowroomControllerTestingClient unauthedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            await PrepareAuthAsync(testContext);

            stewardClient = new ShowroomControllerTestingClient(new Uri(endpoint), authKey);
            unauthedClient = new ShowroomControllerTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedCarShowcase_NoParam()
        {
            try
            {
                var response = await stewardClient.GetFeaturedCarShowcase().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedCarShowcase_ByXuid()
        {
            try
            {
                var response = await stewardClient.GetFeaturedCarShowcase(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedCarShowcase_ByXuid_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetFeaturedCarShowcase(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedDivision_NoParam()
        {
            try
            {
                var response = await stewardClient.GetFeaturedDivision().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedDivision_ByXuid()
        {
            try
            {
                var response = await stewardClient.GetFeaturedDivision(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedDivision_ByXuid_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetFeaturedDivision(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedManufacturer_NoParam()
        {
            try
            {
                var response = await stewardClient.GetFeaturedManufacturer().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedManufacturer_ByXuid()
        {
            try
            {
                var response = await stewardClient.GetFeaturedManufacturer(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedManufacturer_ByXuid_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetFeaturedManufacturer(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetCarSales_NoParam()
        {
            try
            {
                var response = await stewardClient.GetCarSales().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetCarSales_ByXuid()
        {
            try
            {
                var response = await stewardClient.GetCarSales(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetCarSales_ByXuid_InvalidXuid()
        {
            try
            {
                var response = await stewardClient.GetCarSales(TestConstants.InvalidXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedShowcases()
        {
            try
            {
                var response = await stewardClient.GetFeaturedShowcases().ConfigureAwait(false);
                Assert.IsNotNull(response);
            }
            catch (ServiceException ex)
            {
                Assert.Fail(ex.ResponseBody);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedCarShowcase_NoParam_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetFeaturedCarShowcase().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedCarShowcase_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetFeaturedCarShowcase(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedDivision_NoParam_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetFeaturedDivision().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedDivision_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetFeaturedDivision(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedManufacturer_NoParam_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetFeaturedManufacturer().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedManufacturer_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetFeaturedManufacturer(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetCarSales_NoParam_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetCarSales().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetCarSales_ByXuid_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetCarSales(TestConstants.TestAccountXuid).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }

        [TestMethod]
        [IntegrationTest]
        public async Task GetFeaturedShowcases_InvalidAuth()
        {
            try
            {
                var response = await unauthedClient.GetFeaturedShowcases().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException ex)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, ex.StatusCode);
            }
        }
    }
}
