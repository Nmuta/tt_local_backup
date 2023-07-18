using System.Collections.Generic;
using System.Linq;
using Turn10.LiveOps.StewardApi.Contracts.Common;
using Turn10.LiveOps.StewardApi.Contracts.Errors;

namespace Turn10.LiveOps.StewardApi.Helpers
{
    /// <summary>
    ///     Contains assorted extension methods for use in Steward.
    /// </summary>
    public static class IdentityLookupExtensions
    {
        private const ulong InvalidXuidThreshold = 100;

        /// <summary>
        ///     Sets error property for invalid XUID.
        /// </summary>
        public static void SetErrorForInvalidXuid(this IdentityResultAlpha identityResult)
        {
            if (identityResult.Error == null && identityResult.Xuid <= InvalidXuidThreshold)
            {
                identityResult.Error = new InvalidArgumentsStewardError($"Invalid XUID, must be greater than 100. XUID provided: {identityResult.Xuid}");
            }
        }

        /// <summary>
        ///     Sets error property for invalid XUID.
        /// </summary>
        public static void SetErrorForInvalidXuid(this IdentityResultBeta identityResult)
        {
            if (identityResult.Error == null && identityResult.Xuid <= InvalidXuidThreshold)
            {
                identityResult.Error = new InvalidArgumentsStewardError($"Invalid XUID, must be greater than 100. XUID provided: {identityResult.Xuid}");
            }
        }

        /// <summary>
        ///     Sets error property for invalid XUIDs.
        /// </summary>
        public static void SetErrorsForInvalidXuids(this IList<IdentityResultAlpha> identityResults)
        {
            identityResults = identityResults.Select(identity =>
            {
                identity.SetErrorForInvalidXuid();
                return identity;
            }).ToList();
        }

        /// <summary>
        ///     Sets error property for invalid XUIDs.
        /// </summary>
        public static void SetErrorsForInvalidXuids(this IList<IdentityResultBeta> identityResults)
        {
            identityResults = identityResults.Select(identity =>
            {
                identity.SetErrorForInvalidXuid();
                return identity;
            }).ToList();
        }
    }
}
