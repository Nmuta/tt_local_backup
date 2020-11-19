using System;
using Microsoft.Rest.TransientFaultHandling;

namespace Turn10.LiveOps.StewardApi.Providers
{
    /// <inheritdoc />
    /// <summary>
    ///     Represents a default error detection strategy for Key Vault requests over HTTP.
    /// </summary>
    /// <seealso cref="ITransientErrorDetectionStrategy" />
    public sealed class KeyVaultDefaultErrorDetectionStrategy : ITransientErrorDetectionStrategy
    {
        /// <inheritdoc />
        /// <summary>
        ///     Determines whether the specified exception is transient.
        /// </summary>
        /// <param name="ex">The ex.</param>
        /// <returns>
        ///   <c>true</c> if the specified ex is transient; otherwise, <c>false</c>.
        /// </returns>
        public bool IsTransient(Exception ex)
        {
            if (ex is HttpRequestWithStatusException exception)
            {
                return TransientHttpErrorDetector.IsTransientHttpStatusCode(exception.StatusCode);
            }

            return false;
        }
    }
}
