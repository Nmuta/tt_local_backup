using System;
using Microsoft.Rest.TransientFaultHandling;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <inheritdoc />
    /// <summary>
    ///     Represents a default policy for Key Vault retries.
    /// </summary>
    public sealed class KeyVaultDefaultRetryPolicy : RetryPolicy
    {
        private const int DefaultRetryCount = 5;

        /*
         * The below settings result in approximately (with variance):
         * Retry #1: Wait 1 second, retry request
         * Retry #2: If still retry-able wait 2 seconds, retry request
         * Retry #3: If still retry-able wait 4 seconds, retry request
         * Retry #4: If still retry-able wait 8 seconds, retry request
         * Retry #5: If still retry-able wait 16 seconds, retry request
         * These numbers are based off of https://docs.microsoft.com/en-us/azure/key-vault/key-vault-ovw-throttling.
         */
        private static readonly TimeSpan MinBackoff = TimeSpan.FromSeconds(1);
        private static readonly TimeSpan MaxBackoff = TimeSpan.FromSeconds(16);
        private static readonly TimeSpan DeltaBackoff = TimeSpan.FromSeconds(1);

        /// <summary>
        ///     Initializes a new instance of the <see cref="KeyVaultDefaultRetryPolicy" /> class.
        /// </summary>
        public KeyVaultDefaultRetryPolicy()
            : base(new KeyVaultDefaultErrorDetectionStrategy(), CreateRetryStrategy())
        {
        }

        private static ExponentialBackoffRetryStrategy CreateRetryStrategy()
        {
            var retryStrategy = new ExponentialBackoffRetryStrategy(
                DefaultRetryCount,
                MinBackoff,
                MaxBackoff,
                DeltaBackoff)
            {
                FastFirstRetry = false
            };

            return retryStrategy;
        }
    }
}