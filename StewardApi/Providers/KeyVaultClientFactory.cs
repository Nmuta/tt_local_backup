using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Rest.TransientFaultHandling;
using Turn10.Data.Common;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <inheritdoc />
    /// <summary>
    ///     Represents a factory for <see cref="IKeyVaultClient" /> objects.
    /// </summary>
    public sealed class KeyVaultClientFactory : IKeyVaultClientFactory
    {
        /// <inheritdoc />
        /// <summary>
        ///     Creates a new <see cref="IKeyVaultClient" /> instance.
        /// </summary>
        /// <returns>
        ///     A new <see cref="IKeyVaultClient" />.
        /// </returns>
        public IKeyVaultClient Create()
        {
            return this.Create(new KeyVaultDefaultRetryPolicy());
        }

        /// <inheritdoc />
        /// <summary>
        ///     Creates a new <see cref="IKeyVaultClient" /> instance.
        /// </summary>
        /// <param name="retryPolicy">Specifies the retry policy that should be used in the underlying client.</param>
        /// <returns>
        ///     A new <see cref="IKeyVaultClient" />.
        /// </returns>
        public IKeyVaultClient Create(RetryPolicy retryPolicy)
        {
            retryPolicy.ShouldNotBeNull(nameof(retryPolicy));

            var tokenProvider = new AzureServiceTokenProvider();
            var authenticationCallback = new KeyVaultClient.AuthenticationCallback(tokenProvider.KeyVaultTokenCallback);
            var keyVaultClient = new KeyVaultClient(authenticationCallback);

            keyVaultClient.SetRetryPolicy(retryPolicy);

            return keyVaultClient;
        }
    }
}
