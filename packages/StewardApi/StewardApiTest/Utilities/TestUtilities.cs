using Microsoft.Identity.Client;
using System;
using System.Net;
using System.Threading.Tasks;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardTest.Utilities
{
    /// <summary>
    ///     Provides testing utilities.
    /// </summary>
    public static class TestUtilities
    {
        /// <summary>
        ///     Xuid minimum provided by Xbox Live team. This could change in the future.
        /// </summary>
        private static ulong XuidMinimum = 0x0009000000000000UL;

        /// <summary>
        ///     Xuid maximum provided by Xbox Live team. This could change in the future.
        /// </summary>
        private static ulong XuidMaximum = 0x0009FFFFFFFFFFFFUL;

        /// <summary>
        ///     Disables SSL validation.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Security", "CA5359:Do Not Disable Certificate Validation", Justification = "Fine for tests.")]
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

        public static ulong GenerateValidTestXuid()
        {
            var random = new Random();
            return (ulong)random.NextInt64((long)XuidMinimum, (long)XuidMaximum);
        }
    }
}
