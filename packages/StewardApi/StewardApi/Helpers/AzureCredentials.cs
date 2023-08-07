using Azure.Core;
using Azure.Identity;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Alternate lists for sourcing Azure identity credentials.
    /// </summary>
    public static class AzureCredentials
    {
        /// <summary>
        ///     Same as <see cref="DefaultAzureCredential"/>, but with an adjusted order.
        ///     Attempts to use <see cref="AzureCliCredential"/> before using <see cref="VisualStudioCredential"/>.
        /// </summary>
        /// <remarks>
        ///     2023-04-03:
        ///     This is because <see cref="VisualStudioCredential"/> says it can provide credentials (and it can) - but takes 7 seconds on each request.
        ///     <see cref="AzureCliCredential"/> does not have this issue, but Azure CLI must be installed and authenticated to avoid this.
        /// </remarks>
        public static TokenCredential BetterDefaultAzureCredentials
            => new DefaultAzureCredential();

        // Disabling temporarily to unblock release. Need to change return type back to ChainedTokenCredential as well
        // BUG to track: https://dev.azure.com/t10motorsport/ForzaTech/_workitems/edit/1567851
        //// => new ChainedTokenCredential(
        //// new AzureCliCredential(),
        ////new DefaultAzureCredential());
    }
}
