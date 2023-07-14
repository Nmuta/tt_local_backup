using System.Net;
using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardTest.Utilities
{
    /// <summary>
    ///     Provides testing utilities.
    /// </summary>
    public static class TestUtilities
    {
        /// <summary>
        ///     Disables SSL validation.
        /// </summary>
        public static void DisableSSLValidation()
        {
            ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, errors) => true;
        }

        public static async Task<string> MintAuthorizationToken(string clientId, string clientSecret)
        {
            clientId.ShouldNotBeNullEmptyOrWhiteSpace(nameof(clientId));
            clientSecret.ShouldNotBeNullEmptyOrWhiteSpace(nameof(clientSecret));

            var confidentialClientApplication = ConfidentialClientApplicationBuilder
                .Create(clientId)
                .WithAuthority("https://login.windows.net/microsoft.onmicrosoft.com/oauth2/v2.0/token/")
                .WithRedirectUri("http://localhost")
                .WithClientSecret(clientSecret)
                .Build();

            var scopes = new[] { "api://" + clientId + "/.default" };

            var response = await confidentialClientApplication.AcquireTokenForClient(scopes).ExecuteAsync().ConfigureAwait(false);

            return $"bearer {response.AccessToken}";
        }
    }
}
