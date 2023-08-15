using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Turn10.Data.SecretProvider;
using Turn10.LiveOps.StewardApi.Contracts.Data;
using Turn10.LiveOps.StewardTest.Utilities;
using Turn10.LiveOps.StewardTest.Utilities.TestingClient;

namespace Turn10.LiveOps.StewardTest.Integration.Data
{
    [TestClass]
    public sealed class KustoIntegrationTests
    {
        private static string endpoint;
        private static string authKey;
        private static string validQuery;
        private static string ambiguousQuery;
        private static string invalidQuery;

        private static KustoQuery validKustoQuery;

        private static KeyVaultProvider KeyVaultProvider;
        private static KustoStewardTestingClient stewardClient;
        private static KustoStewardTestingClient unauthorizedClient;

        [ClassInitialize]
        public static async Task Setup(TestContext testContext)
        {
            KeyVaultProvider = new KeyVaultProvider(new KeyVaultClientFactory());

            TestUtilities.DisableSSLValidation();
            endpoint = testContext.Properties["EndPoint"].ToString();

            var clientId = testContext.Properties["ClientId"].ToString();
            var clientSecret = testContext.Properties["ClientSecret"].ToString();
            if (string.IsNullOrWhiteSpace(clientSecret))
            {
                var keyVaultName = testContext.Properties["KeyVaultName"].ToString();
                var clientSecretName = testContext.Properties["ClientSecretName"].ToString();
                clientSecret = await KeyVaultProvider.GetSecretAsync(keyVaultName, clientSecretName);
            }

            authKey = await TestUtilities.MintAuthorizationToken(clientId, clientSecret).ConfigureAwait(false);

            stewardClient = new KustoStewardTestingClient(new Uri(endpoint), authKey);
            unauthorizedClient = new KustoStewardTestingClient(new Uri(endpoint), TestConstants.InvalidAuthKey);

            validQuery = "database('T10Analytics').actual_platform_mapping_sunrise()";
            ambiguousQuery = "actual_platform_mapping_sunrise()";
            invalidQuery = "database('T10Analytics').not_a_real_function()";
            validKustoQuery = new KustoQuery("IntegrationTest", "Test", validQuery);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task RunQuery()
        {
            var result = await stewardClient.RunQueryAsync(validQuery).ConfigureAwait(false);

            Assert.IsNotNull(result);
            Assert.IsTrue(result[0].ContainsKey("ActualPlatform"));
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task RunQuery_Unauthorized()
        {
            try
            {
                var result = await unauthorizedClient.RunQueryAsync(validQuery).ConfigureAwait(false);
                Assert.IsNotNull(result);
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task RunQuery_AmbiguousQuery()
        {
            try
            {
                var result = await stewardClient.RunQueryAsync(ambiguousQuery).ConfigureAwait(false);
                Assert.IsNotNull(result);
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.BadRequest, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task RunQuery_InvalidQuery()
        {
            try
            {
                var result = await stewardClient.RunQueryAsync(invalidQuery).ConfigureAwait(false);
                Assert.IsNotNull(result);
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.InternalServerError, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task RetrieveQueries()
        {
            var result = await stewardClient.RetrieveQueriesAsync().ConfigureAwait(false);

            Assert.IsNotNull(result);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task RetrieveQueries_Unauthorized()
        {
            try
            {
                await unauthorizedClient.RetrieveQueriesAsync().ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SaveAndDeleteQueries()
        {
            await stewardClient.SaveQueryAsync(new List<KustoQuery> { validKustoQuery }).ConfigureAwait(false);
            var createResults = await stewardClient.RetrieveQueriesAsync().ConfigureAwait(false);
            var result = createResults.Where(query => query.Name == validKustoQuery.Name).First();
            Assert.IsNotNull(result);

            await stewardClient.DeleteQueriesAsync(result.Id.ToString()).ConfigureAwait(false);
            var deleteResults = await stewardClient.RetrieveQueriesAsync().ConfigureAwait(false);
            Assert.IsFalse(deleteResults.Where(query => query.Name == validKustoQuery.Name).Any());
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task SaveQuery_Unauthorized()
        {
            try
            {
                await unauthorizedClient.SaveQueryAsync(new List<KustoQuery> { validKustoQuery }).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task DeleteQueries_Unauthorized()
        {
            try
            {
                await unauthorizedClient.DeleteQueriesAsync(validKustoQuery.Name).ConfigureAwait(false);
                Assert.Fail();
            }
            catch (ServiceException e)
            {
                Assert.AreEqual(HttpStatusCode.Unauthorized, e.StatusCode);
            }
        }
    }
}
