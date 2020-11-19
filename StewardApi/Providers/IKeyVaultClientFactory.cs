using Microsoft.Azure.KeyVault;
using Microsoft.Rest.TransientFaultHandling;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <summary>
    ///     Exposes methods for creating instances of <see cref="IKeyVaultClient"/>.
    /// </summary>
    public interface IKeyVaultClientFactory
    {
        /// <summary>
        ///     Creates a new <see cref="IKeyVaultClient"/> instance.
        /// </summary>
        /// <returns>
        ///     A new <see cref="IKeyVaultClient"/>.
        /// </returns>
        IKeyVaultClient Create();

        /// <summary>
        ///     Creates a new <see cref="IKeyVaultClient"/> instance.
        /// </summary>
        /// <param name="retryPolicy">Specifies the retry policy that should be used in the underlying client.</param>
        /// <returns>
        ///     A new <see cref="IKeyVaultClient"/>.
        /// </returns>
        IKeyVaultClient Create(RetryPolicy retryPolicy);
    }
}
